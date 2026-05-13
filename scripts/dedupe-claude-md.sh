#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# dedupe-claude-md.sh — find all CLAUDE.md across Mac, dedupe by hash
#
# Operator screenshot 2026-05-13: Finder search "CLAUDE.md" on Desktop
# returned 53 results, mostly 9KB duplicates dated May 4-6.
# Operator uploaded 5 samples; 4 of 5 were identical 147-line stale
# copies; 1 was the gold 229-line doctrine.
#
# This script (run on Mac) finds every CLAUDE.md across the Mac
# (Desktop + ~/zynthio-tools + ~/.claude + Documents), groups by
# sha256, keeps the newest of each unique content, moves the
# duplicates to ~/Desktop/CLAUDE_MD_DUPES_<timestamp>/ for review
# before delete (idempotent, non-destructive).
#
# Run:
#   chmod +x scripts/dedupe-claude-md.sh
#   ./scripts/dedupe-claude-md.sh         # safe — moves to quarantine
#   ./scripts/dedupe-claude-md.sh --delete  # if quarantine reviewed, actually delete
# ═══════════════════════════════════════════════════════════════

set -uo pipefail
shopt -s nullglob

MODE="${1:-quarantine}"   # "quarantine" (default) or "--delete"
QUARANTINE="$HOME/Desktop/CLAUDE_MD_DUPES_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$QUARANTINE"
INDEX="$QUARANTINE/_INDEX.tsv"
printf 'action\tpath\tsize\tsha256\tmtime\n' > "$INDEX"

# Scan roots — operator-canonical surfaces
ROOTS=(
  "$HOME/Desktop"
  "$HOME/Desktop/zynthio-tools"
  "$HOME/.claude"
  "$HOME/Documents"
)
for v in /Volumes/*; do
  [ "$v" = "/Volumes/Macintosh HD" ] && continue
  ROOTS+=("$v")
done

# Gather every CLAUDE.md
TMP=$(mktemp)
for r in "${ROOTS[@]}"; do
  [ -d "$r" ] || continue
  find "$r" -maxdepth 8 -type f \( -name 'CLAUDE.md' -o -name 'claude.md' \) 2>/dev/null
done | sort -u > "$TMP"

COUNT=$(wc -l < "$TMP" | xargs)
echo "Found $COUNT CLAUDE.md files."

# Build hash → newest-path map
declare -A NEWEST_PATH
declare -A NEWEST_MTIME
while read -r f; do
  sh=$(shasum -a 256 "$f" 2>/dev/null | awk '{print $1}')
  [ -z "$sh" ] && continue
  mt=$(stat -f%m "$f" 2>/dev/null || stat -c%Y "$f")
  if [ -z "${NEWEST_PATH[$sh]:-}" ] || [ "$mt" -gt "${NEWEST_MTIME[$sh]}" ]; then
    NEWEST_PATH[$sh]="$f"
    NEWEST_MTIME[$sh]="$mt"
  fi
done < "$TMP"

UNIQUE=${#NEWEST_PATH[@]}
echo "Unique content variants: $UNIQUE"
echo "Duplicates to handle: $((COUNT - UNIQUE))"
echo ""

# For each file, if it's the newest of its content-hash, KEEP. Otherwise quarantine/delete.
while read -r f; do
  sh=$(shasum -a 256 "$f" 2>/dev/null | awk '{print $1}')
  sz=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  mt=$(stat -f%Sm "$f" 2>/dev/null || stat -c%y "$f")
  if [ "$f" = "${NEWEST_PATH[$sh]}" ]; then
    printf 'KEEP\t%s\t%s\t%s\t%s\n' "$f" "$sz" "$sh" "$mt" >> "$INDEX"
    continue
  fi
  safe="${f//\//_}"
  safe="${safe// /_}"
  if [ "$MODE" = "--delete" ]; then
    rm -f "$f"
    printf 'DELETED\t%s\t%s\t%s\t%s\n' "$f" "$sz" "$sh" "$mt" >> "$INDEX"
  else
    cp "$f" "$QUARANTINE/${sh:0:8}__${safe}.md" 2>/dev/null
    printf 'QUARANTINED\t%s\t%s\t%s\t%s\n' "$f" "$sz" "$sh" "$mt" >> "$INDEX"
  fi
done < "$TMP"

rm -f "$TMP"

echo "Done. See $INDEX"
echo ""
echo "Summary:"
awk -F'\t' 'NR>1 {c[$1]++} END {for (k in c) print k, c[k]}' "$INDEX"
echo ""
if [ "$MODE" != "--delete" ]; then
  echo "Files moved to $QUARANTINE (originals untouched until you run --delete)."
  echo "To actually delete duplicates after review:"
  echo "  ./scripts/dedupe-claude-md.sh --delete"
fi
