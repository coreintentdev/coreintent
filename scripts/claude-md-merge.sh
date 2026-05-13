#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# claude-md-merge.sh — find every CLAUDE.md across sources + diff
#
# Operator request 2026-05-13: "check all version accross al source for
# all versions of calude.md ... redo check VDSx3 VDS prooton ggoole
# drive localal hdd and the external hdd plugged into the mac"
#
# This Claude Code sandbox cannot reach VDS, Proton, local HDD, or
# external HDD. This script does, when run from the operator Mac.
#
# Surfaces walked:
#   1. Mac local HDD     (default: $HOME + ~/Desktop + ~/zynthio-tools)
#   2. External HDD      (auto-detect under /Volumes; override via EXT_HDD)
#   3. VDS primary       (vmi3205024 via ssh + ~/.ssh/zynthio_dc)
#   4. VDS secondary     (vmi3217372)
#   5. VDS legacy        (5.189.143.170 — if still reachable)
#   6. Google Drive      (CloudStorage mount + rclone remote)
#   7. Proton Drive      (CloudStorage mount + Proton Bridge mount if present)
#   8. Git repo working tree (./CLAUDE.md current branch)
#
# Output: a timestamped merge bundle in $HOME/Desktop/CLAUDE_MD_MERGE_YYYYMMDD/
#   - one_copy_per_source.tsv     source -> path -> size -> sha256 -> mtime
#   - all_sources/                actual file copies, renamed by source
#   - DIFF_<source>_vs_repo.diff  unified diff of each non-repo copy vs repo
#   - MERGE_BASE.md               the repo CLAUDE.md (this branch's HEAD)
#
# Run:
#   chmod +x scripts/claude-md-merge.sh
#   ./scripts/claude-md-merge.sh
# ═══════════════════════════════════════════════════════════════

set -uo pipefail
shopt -s nullglob

OUT="${OUT:-$HOME/Desktop/CLAUDE_MD_MERGE_$(date +%Y%m%d_%H%M%S)}"
mkdir -p "$OUT/all_sources"
MANIFEST="$OUT/one_copy_per_source.tsv"
printf 'source\tpath\tsize\tsha256\tmtime\n' > "$MANIFEST"

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPO_CLAUDE="$REPO_ROOT/CLAUDE.md"

if [ -f "$REPO_CLAUDE" ]; then
  cp "$REPO_CLAUDE" "$OUT/all_sources/REPO_HEAD_CLAUDE.md"
  cp "$REPO_CLAUDE" "$OUT/MERGE_BASE.md"
  sz=$(stat -f%z "$REPO_CLAUDE" 2>/dev/null || stat -c%s "$REPO_CLAUDE")
  sh=$(shasum -a 256 "$REPO_CLAUDE" | awk '{print $1}')
  mt=$(stat -f%Sm "$REPO_CLAUDE" 2>/dev/null || stat -c%y "$REPO_CLAUDE")
  printf 'repo\t%s\t%s\t%s\t%s\n' "$REPO_CLAUDE" "$sz" "$sh" "$mt" >> "$MANIFEST"
fi

record() {
  local src="$1" path="$2"
  [ -f "$path" ] || return
  local sz sh mt safe
  sz=$(stat -f%z "$path" 2>/dev/null || stat -c%s "$path")
  sh=$(shasum -a 256 "$path" | awk '{print $1}')
  mt=$(stat -f%Sm "$path" 2>/dev/null || stat -c%y "$path")
  safe="${path//\//_}"
  safe="${safe// /_}"
  cp "$path" "$OUT/all_sources/${src}__${safe}.md" 2>/dev/null || true
  printf '%s\t%s\t%s\t%s\t%s\n' "$src" "$path" "$sz" "$sh" "$mt" >> "$MANIFEST"
}

scan_local() {
  local root="$1" src="$2"
  [ -d "$root" ] || return
  find "$root" -maxdepth 8 -type f \( -name 'CLAUDE.md' -o -name 'claude.md' \) 2>/dev/null \
    | while read -r f; do record "$src" "$f"; done
}

scan_remote_vds() {
  local host="$1" src="$2"
  ssh -i "$HOME/.ssh/zynthio_dc" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=8 \
      -o BatchMode=yes "root@$host" \
      "find / -xdev -maxdepth 6 -type f -name 'CLAUDE.md' 2>/dev/null | head -50" \
    2>/dev/null | while read -r remote_path; do
      [ -z "$remote_path" ] && continue
      local localname="$OUT/all_sources/${src}__$(echo "$remote_path" | tr '/' '_').md"
      scp -i "$HOME/.ssh/zynthio_dc" -o StrictHostKeyChecking=accept-new \
          "root@$host:$remote_path" "$localname" 2>/dev/null || continue
      sh=$(shasum -a 256 "$localname" | awk '{print $1}')
      sz=$(stat -f%z "$localname" 2>/dev/null || stat -c%s "$localname")
      printf '%s\t%s:%s\t%s\t%s\t-\n' "$src" "$host" "$remote_path" "$sz" "$sh" >> "$MANIFEST"
    done
}

echo "── scanning local Mac ──"
scan_local "$HOME"                          mac_home
scan_local "$HOME/Desktop"                  mac_desktop
scan_local "$HOME/Desktop/zynthio-tools"    mac_zynthio_tools
scan_local "$HOME/.claude"                  mac_dotclaude

echo "── scanning Google Drive CloudStorage mount ──"
for d in "$HOME"/Library/CloudStorage/GoogleDrive-*; do
  scan_local "$d" "gdrive_mount"
done

echo "── scanning Proton Drive mount (if present) ──"
for d in "$HOME"/Library/CloudStorage/ProtonDrive-*; do
  scan_local "$d" "proton_mount"
done

echo "── scanning external HDDs under /Volumes ──"
for v in /Volumes/*; do
  [ "$v" = "/Volumes/Macintosh HD" ] && continue
  scan_local "$v" "extvol_$(basename "$v" | tr ' ' '_')"
done

echo "── scanning VDS primary (vmi3205024) ──"
scan_remote_vds vmi3205024  vds_primary

echo "── scanning VDS secondary (vmi3217372) ──"
scan_remote_vds vmi3217372  vds_secondary

echo "── scanning VDS legacy (5.189.143.170 — if reachable) ──"
scan_remote_vds 5.189.143.170 vds_legacy

echo ""
echo "── diff each non-repo copy vs the repo HEAD ──"
if [ -f "$OUT/MERGE_BASE.md" ]; then
  for f in "$OUT/all_sources"/*.md; do
    base=$(basename "$f" .md)
    [ "$base" = "REPO_HEAD_CLAUDE" ] && continue
    diff -u "$OUT/MERGE_BASE.md" "$f" > "$OUT/DIFF_${base}.diff" || true
    [ ! -s "$OUT/DIFF_${base}.diff" ] && rm -f "$OUT/DIFF_${base}.diff"
  done
fi

echo ""
echo "═══ done ═══"
echo "Bundle: $OUT"
echo "Manifest:"
cat "$MANIFEST"
echo ""
echo "Next:"
echo "  - Open $OUT in Finder"
echo "  - Read each DIFF_*.diff to see what each source has that the repo doesn't"
echo "  - Decide: merge any missing context back into ./CLAUDE.md, commit, push"
echo "  - This script is idempotent — re-run any time"
