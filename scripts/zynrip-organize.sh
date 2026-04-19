#!/usr/bin/env bash
# =============================================
# ZynRip ORGANIZE + MAP — v3 (macOS, Linux, Windows Git Bash / WSL)
# =============================================
# Resolves Desktop + master paths from env or flags so the same script runs
# on your machine and on teammates' (Windows: use Git Bash or WSL, not cmd.exe).
#
# Env overrides (optional):
#   ZYNRIP_DESKTOP      — folder to scan for loose files (default: auto-detect)
#   ZYNRIP_MASTER       — full path to ZYNTHIO_MASTER (default: $DESKTOP/ZYNTHIO_MASTER)
#   ZYNRIP_MUSIC_DIRS   — colon-separated extra dirs to mirror audio from (optional)
#
# Flags:
#   --desktop PATH      — same as ZYNRIP_DESKTOP
#   --master PATH       — same as ZYNRIP_MASTER
#   --music PATH        — add one music root (repeatable); merged with ZYNRIP_MUSIC_DIRS
#   --apply --yes       — perform moves + write map (otherwise dry-run only)
#   --no-personal-skip  — do not skip filenames matching personal keywords
#   -h, --help
#
# Default remains DRY-RUN until --apply --yes.
# =============================================

set -euo pipefail

APPLY=0
CONFIRM=0
PERSONAL_SKIP=1
DESKTOP_ARG=""
MASTER_ARG=""
MUSIC_EXTRA=()

print_help() {
  sed -n '2,35p' "$0"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --yes) CONFIRM=1 ;;
    --no-personal-skip) PERSONAL_SKIP=0 ;;
    --desktop)
      shift
      DESKTOP_ARG="${1:?--desktop requires a path}"
      ;;
    --master)
      shift
      MASTER_ARG="${1:?--master requires a path}"
      ;;
    --music)
      shift
      MUSIC_EXTRA+=("${1:?--music requires a path}")
      ;;
    -h|--help) print_help; exit 0 ;;
    *)
      echo "Unknown arg: $1"
      print_help
      exit 2
      ;;
  esac
  shift || true
done

if [ "$APPLY" -eq 1 ] && [ "$CONFIRM" -ne 1 ]; then
  echo "Refusing to apply changes without --yes confirmation."
  echo "Re-run with: bash scripts/zynrip-organize.sh --apply --yes"
  exit 2
fi

detect_desktop() {
  if [ -n "${DESKTOP_ARG}" ]; then
    echo "$DESKTOP_ARG"
    return
  fi
  if [ -n "${ZYNRIP_DESKTOP:-}" ]; then
    echo "$ZYNRIP_DESKTOP"
    return
  fi
  # Windows Git Bash
  if [ -n "${USERPROFILE:-}" ] && [ -d "${USERPROFILE}/Desktop" ]; then
    echo "${USERPROFILE}/Desktop"
    return
  fi
  # macOS / typical Linux
  if [ -d "${HOME}/Desktop" ]; then
    echo "${HOME}/Desktop"
    return
  fi
  echo ""
}

detect_master() {
  if [ -n "${MASTER_ARG}" ]; then
    echo "$MASTER_ARG"
    return
  fi
  if [ -n "${ZYNRIP_MASTER:-}" ]; then
    echo "$ZYNRIP_MASTER"
    return
  fi
  local d
  d=$(detect_desktop)
  if [ -z "$d" ]; then
    echo ""
    return
  fi
  echo "$d/ZYNTHIO_MASTER"
}

build_suno_candidates() {
  local -a c=()
  # Explicit --music flags
  local m
  for m in "${MUSIC_EXTRA[@]}"; do
    [ -n "$m" ] && c+=("$m")
  done
  # ZYNRIP_MUSIC_DIRS colon-separated
  if [ -n "${ZYNRIP_MUSIC_DIRS:-}" ]; then
    local IFS=':'
    for m in $ZYNRIP_MUSIC_DIRS; do
      [ -n "$m" ] && c+=("$m")
    done
  fi
  # Defaults (idempotent — add if not already present)
  local defaults=(
    "${HOME}/Music"
    "${HOME}/Downloads/Suno"
    "${HOME}/Downloads/suno"
    "${HOME}/Documents/Suno"
    "${HOME}/Documents/Music"
  )
  if [ -n "${USERPROFILE:-}" ]; then
    defaults+=("${USERPROFILE}/Music")
  fi
  for m in "${defaults[@]}"; do
    local found=0
    local e
    for e in "${c[@]+"${c[@]}"}"; do
      [ "$e" = "$m" ] && found=1 && break
    done
    [ "$found" -eq 0 ] && c+=("$m")
  done
  printf '%s\n' "${c[@]}"
}

DATE=$(date +%Y%m%d_%H%M%S)
DESKTOP=$(detect_desktop)
MASTER=$(detect_master)

if [ -z "$DESKTOP" ] || [ ! -d "$DESKTOP" ]; then
  echo "Desktop not found. Set ZYNRIP_DESKTOP or pass --desktop /path/to/Desktop"
  echo "Examples:"
  echo "  macOS:   --desktop \"\$HOME/Desktop\""
  echo "  Linux:   --desktop \"\$HOME/Desktop\""
  echo "  Win GB:  --desktop \"\$USERPROFILE/Desktop\""
  exit 0
fi

if [ -z "$MASTER" ]; then
  echo "Could not resolve master folder. Set ZYNRIP_MASTER or --master /full/path/ZYNTHIO_MASTER"
  exit 2
fi

mode="DRY-RUN"
[ "$APPLY" -eq 1 ] && mode="APPLY"

echo "=== ZynRip ORGANIZE v3 — $DATE ($mode) ==="
echo "Desktop:       $DESKTOP"
echo "Master folder: $MASTER"
echo "Personal skip: $PERSONAL_SKIP"
echo "OS:            $(uname -s 2>/dev/null || echo unknown)"
echo

file_size() {
  if stat -f%z "$1" >/dev/null 2>&1; then
    stat -f%z "$1"
  else
    stat --printf="%s" "$1" 2>/dev/null || echo "?"
  fi
}

run() {
  if [ "$APPLY" -eq 1 ]; then
    eval "$@"
  else
    # Do not use echo "DRY: $*" — arguments can contain " and break parsing of the whole script.
    printf 'DRY:'
    local _a
    for _a in "$@"; do printf ' %q' "$_a"; done
    printf '\n'
  fi
}

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

move_pattern() {
  local dest="$1"; shift
  for pattern in "$@"; do
    # shellcheck disable=SC2086
    for f in $pattern; do
      [ -e "$f" ] || continue
      if [ "$PERSONAL_SKIP" -eq 1 ] && echo "$f" | grep -qiE '(personal|family|private|ruby|michelle|willy|chas|hannah|wesley)'; then
        echo "SKIP (personal): $f"
        continue
      fi
      run mv "\"$f\"" "\"$dest/\""
    done
  done
}

move_pattern "$MASTER/02_ZYNRIP" \
  "$DESKTOP/ZYNRIP-SCAN-*.txt" \
  "$DESKTOP/COR_ZYNRIP_*.md" \
  "$DESKTOP/CAL_ZYNRIP_*.md" \
  "$DESKTOP/ZYNRIP_DAILY_*.md" \
  "$DESKTOP/daily-zynrip.sh" \
  "$DESKTOP/gemini_zynrip_answers.md"

move_pattern "$MASTER/05_AI_SESSIONS" \
  "$DESKTOP/SESSION_STATE*.md" \
  "$DESKTOP/MASTER_HANDOVER*.md" \
  "$DESKTOP/TODO_MASTER_LIVE*.md" \
  "$DESKTOP/COREY_WORDS*.md" \
  "$DESKTOP/SESSION_SAVE_*.md" \
  "$DESKTOP/ARCHITECTURE_TRUTH_*.md"

move_pattern "$MASTER/03_SONGPAL" \
  "$DESKTOP/DJ_ZynRose_Drop*" \
  "$DESKTOP"/*.mp3 \
  "$DESKTOP"/*.wav \
  "$DESKTOP"/*.m4a \
  "$DESKTOP"/*.aac

while IFS= read -r SRC; do
  [ -z "$SRC" ] && continue
  [ -d "$SRC" ] || continue
  echo "Suno source: $SRC"
  while IFS= read -r track; do
    [ -z "$track" ] && continue
    base=$(basename "$track")
    dest="$MASTER/03_SONGPAL/suno_tracks/$base"
    if [ -e "$dest" ]; then
      echo "skip existing: $base"
      continue
    fi
    run cp "\"$track\"" "\"$dest\""
  done < <(find "$SRC" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.aac" -o -name "*.flac" -o -name "*.ogg" \) 2>/dev/null || true)
done < <(build_suno_candidates)

for f in "$DESKTOP"/*.md; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  if echo "$base" | grep -iqE '(legal|trademark|complaint|^ip[_-]|privacy|terms)'; then
    run mv "\"$f\"" "\"$MASTER/04_LEGAL/\""
  elif echo "$base" | grep -iqE '(security|f18|protect|evidence)'; then
    run mv "\"$f\"" "\"$MASTER/08_SECURITY/\""
  elif echo "$base" | grep -iqE '(brand|zynthio|mosoko|kervalon|coreyai)'; then
    run mv "\"$f\"" "\"$MASTER/07_BRANDS/\""
  elif echo "$base" | grep -iqE '(song|music|lyric|distro|suno)'; then
    run mv "\"$f\"" "\"$MASTER/03_SONGPAL/\""
  else
    run mv "\"$f\"" "\"$MASTER/05_AI_SESSIONS/\""
  fi
done

for f in "$DESKTOP"/*.txt "$DESKTOP"/*.pdf "$DESKTOP"/*.png "$DESKTOP"/*.jpg "$DESKTOP"/*.json; do
  [ -f "$f" ] || continue
  run mv "\"$f\"" "\"$MASTER/10_ARCHIVE/\""
done

MAP_FILE="$MASTER/MAP/ZYNRIP_MAP_${DATE}.md"
if [ "$APPLY" -eq 1 ]; then
  {
    echo "# ZYNTHIO MASTER MAP"
    echo "Generated: $(date)"
    echo "Source desktop: $DESKTOP"
    echo "Master: $MASTER"
    echo 'Owner: Corey McIvor (@coreintentdev)'
    echo
    echo "## Folder Structure"
    echo
    echo "| Folder | Purpose | File Count |"
    echo "|--------|---------|------------|"
    # Inner path quotes must be escaped: outer echo is "... $(find " — a bare " after find closes the outer string.
    echo "| 01_COREINTENT | Trading engine repo | $(find \"$MASTER/01_COREINTENT\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 02_ZYNRIP | Scans, protocols, scripts | $(find \"$MASTER/02_ZYNRIP\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 03_SONGPAL | Music, lyrics, DistroKid | $(find \"$MASTER/03_SONGPAL\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 04_LEGAL | Legal docs, TM, IP | $(find \"$MASTER/04_LEGAL\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 05_AI_SESSIONS | Handovers, AI logs | $(find \"$MASTER/05_AI_SESSIONS\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 06_VPS | VPS state, SSH, deploys | $(find \"$MASTER/06_VPS\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 07_BRANDS | Zynthio, CoreyAI, etc | $(find \"$MASTER/07_BRANDS\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 08_SECURITY | F18, identity, evidence | $(find \"$MASTER/08_SECURITY\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 09_PERSONAL | Family, private (AI off-limits) | $(find \"$MASTER/09_PERSONAL\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo "| 10_ARCHIVE | Old/inactive files | $(find \"$MASTER/10_ARCHIVE\" -type f 2>/dev/null | wc -l | tr -d ' ') |"
    echo
    echo "## Full File Index"
    find "$MASTER" -type f | sort | while read -r filepath; do
      rel="${filepath#$MASTER/}"
      size=$(file_size "$filepath")
      echo "- \`$rel\` ($size bytes)"
    done
    echo
    echo "## Suno Track Count"
    echo "Total tracks in 03_SONGPAL/suno_tracks: $(find \"$MASTER/03_SONGPAL/suno_tracks\" -type f 2>/dev/null | wc -l | tr -d ' ')"
    echo
    echo "## Rules for AI Sessions"
    echo "1. READ this map before touching any file."
    echo "2. 09_PERSONAL is OFF LIMITS to AI."
    echo "3. Never fabricate family data."
    echo "4. NZ-first for all legal/business."
    echo "5. Label demo data honestly."
    echo
    echo "---"
    echo "Generated by ZynRip Organize v3"
  } > "$MAP_FILE"
fi

echo
echo "=== ZynRip ORGANIZE COMPLETE ($mode) ==="
echo "Master folder: $MASTER"
if [ "$APPLY" -eq 1 ]; then
  echo "Map written:   $MAP_FILE"
  echo "Total files:   $(find \"$MASTER\" -type f | wc -l | tr -d ' ')"
  echo "Suno tracks:   $(find \"$MASTER/03_SONGPAL/suno_tracks\" -type f 2>/dev/null | wc -l | tr -d ' ')"
  if [ "$(uname -s 2>/dev/null || echo other)" = "Darwin" ]; then
    open "$MASTER" 2>/dev/null || true
  fi
fi
echo "336 — signal organised."
