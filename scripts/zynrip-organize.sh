#!/usr/bin/env bash
# =============================================
# ZynRip ORGANIZE + MAP — for Claude Desktop Commander / local Mac terminal
# =============================================
# What this does:
#  1. Builds a logical folder structure on the Mac Desktop (ZYNTHIO_MASTER/...)
#  2. Routes existing Desktop files to the right folder by name pattern
#  3. Mirrors Suno track files from ~/Music (or known fallback dirs) into 03_SONGPAL
#  4. Generates a MAP markdown file that any AI session can read first
#
# Safety:
#  - Default mode is DRY-RUN. Nothing on disk is moved unless --apply is passed.
#  - --yes is required alongside --apply to confirm destructive moves on Desktop.
#  - --personal-skip (default ON) refuses to touch 09_PERSONAL contents.
#  - macOS + Linux compatible (uses POSIX-friendly stat fallback).
#  - Idempotent: existing folders/files are preserved; map gets a new dated file.
#
# Usage:
#   bash scripts/zynrip-organize.sh                 # dry run, prints plan only
#   bash scripts/zynrip-organize.sh --apply --yes   # actually move files + write map
#   bash scripts/zynrip-organize.sh --help
# =============================================

set -euo pipefail

APPLY=0
CONFIRM=0
PERSONAL_SKIP=1

print_help() {
  sed -n '2,30p' "$0"
}

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --yes) CONFIRM=1 ;;
    --no-personal-skip) PERSONAL_SKIP=0 ;;
    -h|--help) print_help; exit 0 ;;
    *) echo "Unknown arg: $arg"; print_help; exit 2 ;;
  esac
done

if [ "$APPLY" -eq 1 ] && [ "$CONFIRM" -ne 1 ]; then
  echo "Refusing to apply changes without --yes confirmation."
  echo "Re-run with: bash scripts/zynrip-organize.sh --apply --yes"
  exit 2
fi

DATE=$(date +%Y%m%d_%H%M%S)
HOME_DIR="${HOME:-/Users/coreymcivor}"
DESKTOP="$HOME_DIR/Desktop"
MASTER="$DESKTOP/ZYNTHIO_MASTER"

if [ ! -d "$DESKTOP" ]; then
  echo "Desktop not found at $DESKTOP — exiting safely."
  exit 0
fi

mode="DRY-RUN"
[ "$APPLY" -eq 1 ] && mode="APPLY"

echo "=== ZynRip ORGANIZE v2 — $DATE ($mode) ==="
echo "Desktop:       $DESKTOP"
echo "Master folder: $MASTER"
echo "Personal skip: $PERSONAL_SKIP"
echo

# Helper: portable file size
file_size() {
  if stat -f%z "$1" >/dev/null 2>&1; then
    stat -f%z "$1"
  else
    stat --printf="%s" "$1" 2>/dev/null || echo "?"
  fi
}

# Helper: do or describe
run() {
  if [ "$APPLY" -eq 1 ]; then
    eval "$@"
  else
    echo "DRY: $*"
  fi
}

# 1. Folder structure
FOLDERS=(
  "01_COREINTENT"
  "02_ZYNRIP"
  "03_SONGPAL"
  "03_SONGPAL/suno_tracks"
  "03_SONGPAL/lyrics"
  "03_SONGPAL/distrokid"
  "04_LEGAL"
  "05_AI_SESSIONS"
  "06_VPS"
  "07_BRANDS"
  "08_SECURITY"
  "09_PERSONAL"
  "10_ARCHIVE"
  "MAP"
)
for f in "${FOLDERS[@]}"; do
  run mkdir -p "\"$MASTER/$f\""
done

# Helper: move files matching a pattern to a destination folder
move_pattern() {
  local dest="$1"; shift
  for pattern in "$@"; do
    for f in $pattern; do
      [ -e "$f" ] || continue
      if [ "$PERSONAL_SKIP" -eq 1 ] && echo "$f" | grep -qiE "(personal|family|private|ruby|michelle|willy|chas|hannah|wesley)"; then
        echo "SKIP (personal): $f"
        continue
      fi
      run mv "\"$f\"" "\"$dest/\""
    done
  done
}

# 2. Route ZynRip files
move_pattern "$MASTER/02_ZYNRIP" \
  "$DESKTOP/ZYNRIP-SCAN-*.txt" \
  "$DESKTOP/COR_ZYNRIP_*.md" \
  "$DESKTOP/CAL_ZYNRIP_*.md" \
  "$DESKTOP/ZYNRIP_DAILY_*.md" \
  "$DESKTOP/daily-zynrip.sh" \
  "$DESKTOP/gemini_zynrip_answers.md"

# 3. Route AI session files
move_pattern "$MASTER/05_AI_SESSIONS" \
  "$DESKTOP/SESSION_STATE*.md" \
  "$DESKTOP/MASTER_HANDOVER*.md" \
  "$DESKTOP/TODO_MASTER_LIVE*.md" \
  "$DESKTOP/COREY_WORDS*.md" \
  "$DESKTOP/SESSION_SAVE_*.md" \
  "$DESKTOP/ARCHITECTURE_TRUTH_*.md"

# 4. Route audio files (only top-level Desktop, not deep)
move_pattern "$MASTER/03_SONGPAL" \
  "$DESKTOP/DJ_ZynRose_Drop*" \
  "$DESKTOP/*.mp3" \
  "$DESKTOP/*.wav" \
  "$DESKTOP/*.m4a" \
  "$DESKTOP/*.aac"

# 5. Mirror Suno tracks (cp, not mv — keep originals)
SUNO_CANDIDATES=(
  "$HOME_DIR/Music"
  "$HOME_DIR/Downloads/Suno"
  "$HOME_DIR/Downloads/suno"
  "$HOME_DIR/Documents/Suno"
  "$HOME_DIR/Documents/Music"
)
for SRC in "${SUNO_CANDIDATES[@]}"; do
  [ -d "$SRC" ] || continue
  echo "Suno source: $SRC"
  while IFS= read -r track; do
    base=$(basename "$track")
    dest="$MASTER/03_SONGPAL/suno_tracks/$base"
    if [ -e "$dest" ]; then
      echo "skip existing: $base"
      continue
    fi
    run cp "\"$track\"" "\"$dest\""
  done < <(find "$SRC" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.aac" -o -name "*.flac" -o -name "*.ogg" \) 2>/dev/null)
done

# 6. Route remaining loose .md files by content pattern
for f in "$DESKTOP"/*.md; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  if echo "$base" | grep -iqE "(legal|trademark|complaint|^ip[_-]|privacy|terms)"; then
    run mv "\"$f\"" "\"$MASTER/04_LEGAL/\""
  elif echo "$base" | grep -iqE "(security|f18|protect|evidence)"; then
    run mv "\"$f\"" "\"$MASTER/08_SECURITY/\""
  elif echo "$base" | grep -iqE "(brand|zynthio|mosoko|kervalon|coreyai)"; then
    run mv "\"$f\"" "\"$MASTER/07_BRANDS/\""
  elif echo "$base" | grep -iqE "(song|music|lyric|distro|suno)"; then
    run mv "\"$f\"" "\"$MASTER/03_SONGPAL/\""
  else
    run mv "\"$f\"" "\"$MASTER/05_AI_SESSIONS/\""
  fi
done

# 7. Archive remaining loose Desktop files (txt/pdf/png/jpg/json)
for f in "$DESKTOP"/*.txt "$DESKTOP"/*.pdf "$DESKTOP"/*.png "$DESKTOP"/*.jpg "$DESKTOP"/*.json; do
  [ -f "$f" ] || continue
  run mv "\"$f\"" "\"$MASTER/10_ARCHIVE/\""
done

# 8. Generate MAP file (only on apply — dry-run prints intent)
MAP_FILE="$MASTER/MAP/ZYNRIP_MAP_${DATE}.md"
if [ "$APPLY" -eq 1 ]; then
  {
    echo "# ZYNTHIO MASTER MAP"
    echo "Generated: $(date)"
    echo "Source: $DESKTOP"
    echo "Owner: Corey McIvor (@coreintentdev)"
    echo
    echo "## Folder Structure"
    echo
    echo "| Folder | Purpose | File Count |"
    echo "|--------|---------|------------|"
    echo "| 01_COREINTENT | Trading engine repo | $(find "$MASTER/01_COREINTENT" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 02_ZYNRIP | Scans, protocols, scripts | $(find "$MASTER/02_ZYNRIP" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 03_SONGPAL | Music, lyrics, DistroKid | $(find "$MASTER/03_SONGPAL" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 04_LEGAL | Legal docs, TM, IP | $(find "$MASTER/04_LEGAL" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 05_AI_SESSIONS | Handovers, AI logs | $(find "$MASTER/05_AI_SESSIONS" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 06_VPS | VPS state, SSH, deploys | $(find "$MASTER/06_VPS" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 07_BRANDS | Zynthio, CoreyAI, etc | $(find "$MASTER/07_BRANDS" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 08_SECURITY | F18, identity, evidence | $(find "$MASTER/08_SECURITY" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 09_PERSONAL | Family, private (AI off-limits) | $(find "$MASTER/09_PERSONAL" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 10_ARCHIVE | Old/inactive files | $(find "$MASTER/10_ARCHIVE" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo
    echo "## Full File Index"
    find "$MASTER" -type f | sort | while read -r filepath; do
      rel="${filepath#$MASTER/}"
      size=$(file_size "$filepath")
      echo "- \`$rel\` ($size bytes)"
    done
    echo
    echo "## Suno Track Count"
    echo "Total tracks in 03_SONGPAL/suno_tracks: $(find "$MASTER/03_SONGPAL/suno_tracks" -type f 2>/dev/null | wc -l | tr -d ' ')"
    echo
    echo "## Rules for AI Sessions"
    echo "1. READ this map before touching any file."
    echo "2. 09_PERSONAL is OFF LIMITS to AI."
    echo "3. Never fabricate family data."
    echo "4. NZ-first for all legal/business."
    echo "5. Label demo data honestly."
    echo
    echo "---"
    echo "Generated by ZynRip Organize v2"
  } > "$MAP_FILE"
fi

echo
echo "=== ZYNRIP ORGANIZE COMPLETE ($mode) ==="
echo "Master folder: $MASTER"
if [ "$APPLY" -eq 1 ]; then
  echo "Map written:   $MAP_FILE"
  echo "Total files:   $(find "$MASTER" -type f | wc -l | tr -d ' ')"
  echo "Suno tracks:   $(find "$MASTER/03_SONGPAL/suno_tracks" -type f 2>/dev/null | wc -l | tr -d ' ')"
fi
echo "336 — signal organised."
