#!/bin/bash
# =============================================
# ZynRip ORGANIZE + MAP — for Claude Desktop Commander
# Paste this into Claude Desktop on your Mac
# =============================================
# 1. Organizes Desktop into logical folders
# 2. Rips Suno tracks (Music/) into the structure
# 3. Creates a full MAP for any AI to read
# =============================================

set -e

DATE=$(date +%Y%m%d_%H%M%S)
HOME_DIR="/Users/coreymcivor"
DESKTOP="$HOME_DIR/Desktop"
MASTER="$DESKTOP/ZYNTHIO_MASTER"

echo "=== ZynRip ORGANIZE v1 — $DATE ==="
echo "Organizing: $DESKTOP"
echo "Master folder: $MASTER"

# ─── Create the logical folder structure ───
echo "Creating folder structure..."

mkdir -p "$MASTER/01_COREINTENT"          # The trading engine repo
mkdir -p "$MASTER/02_ZYNRIP"              # All ZynRip scans, protocols, scripts
mkdir -p "$MASTER/03_SONGPAL"             # Music: Suno tracks, lyrics, DistroKid
mkdir -p "$MASTER/03_SONGPAL/suno_tracks" # The 439+ tracks
mkdir -p "$MASTER/03_SONGPAL/lyrics"      # Written lyrics
mkdir -p "$MASTER/03_SONGPAL/distrokid"   # Distribution records
mkdir -p "$MASTER/04_LEGAL"               # Legal docs, TM, IP, complaints
mkdir -p "$MASTER/05_AI_SESSIONS"         # Session handovers, Claude/Grok/Gemini logs
mkdir -p "$MASTER/06_VPS"                 # VPS state, SSH configs, deploy logs
mkdir -p "$MASTER/07_BRANDS"              # Zynthio, CoreyAI, Mosoko, Kervalon, etc
mkdir -p "$MASTER/08_SECURITY"            # F18, identity protection, evidence
mkdir -p "$MASTER/09_PERSONAL"            # Family, private (NOT for AI)
mkdir -p "$MASTER/10_ARCHIVE"             # Old stuff, not actively used
mkdir -p "$MASTER/MAP"                    # Maps and indexes

echo "Folder structure created."

# ─── Move ZynRip files to 02_ZYNRIP ───
echo "Organizing ZynRip files..."
for f in "$DESKTOP"/ZYNRIP-SCAN-*.txt \
         "$DESKTOP"/COR_ZYNRIP_*.md \
         "$DESKTOP"/CAL_ZYNRIP_*.md \
         "$DESKTOP"/ZYNRIP_DAILY_*.md \
         "$DESKTOP"/daily-zynrip.sh \
         "$DESKTOP"/gemini_zynrip_answers.md; do
  [ -f "$f" ] && mv "$f" "$MASTER/02_ZYNRIP/" && echo "  Moved: $(basename "$f")"
done

# ─── Move AI session/comparison files to 05_AI_SESSIONS ───
echo "Organizing AI session files..."
for f in "$DESKTOP"/SESSION_STATE*.md \
         "$DESKTOP"/MASTER_HANDOVER*.md \
         "$DESKTOP"/TODO_MASTER_LIVE*.md \
         "$DESKTOP"/COREY_WORDS*.md; do
  [ -f "$f" ] && mv "$f" "$MASTER/05_AI_SESSIONS/" && echo "  Moved: $(basename "$f")"
done

# ─── Move audio files to 03_SONGPAL ───
echo "Organizing audio files..."
for f in "$DESKTOP"/DJ_ZynRose_Drop* \
         "$DESKTOP"/*.mp3 \
         "$DESKTOP"/*.wav \
         "$DESKTOP"/*.m4a \
         "$DESKTOP"/*.aac; do
  [ -f "$f" ] && mv "$f" "$MASTER/03_SONGPAL/" && echo "  Moved: $(basename "$f")"
done

# ─── Rip Suno tracks from Music folder ───
echo "Ripping Suno tracks from Music/..."
SUNO_SOURCE="$HOME_DIR/Music"
if [ -d "$SUNO_SOURCE" ]; then
  # Find all audio files recursively in Music/
  find "$SUNO_SOURCE" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" -o -name "*.aac" -o -name "*.flac" -o -name "*.ogg" \) | while read -r track; do
    cp "$track" "$MASTER/03_SONGPAL/suno_tracks/" 2>/dev/null && echo "  Copied: $(basename "$track")"
  done
  TRACK_COUNT=$(find "$MASTER/03_SONGPAL/suno_tracks" -type f | wc -l | tr -d ' ')
  echo "Suno tracks copied: $TRACK_COUNT"
else
  echo "No Music/ folder found. Check if Suno tracks are in Downloads/ or another location."
  # Try common alternative locations
  for ALT in "$HOME_DIR/Downloads/Suno" "$HOME_DIR/Downloads/suno" "$HOME_DIR/Documents/Suno" "$HOME_DIR/Documents/Music"; do
    if [ -d "$ALT" ]; then
      echo "  Found alternative: $ALT"
      find "$ALT" -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.m4a" \) -exec cp {} "$MASTER/03_SONGPAL/suno_tracks/" \;
      echo "  Copied from $ALT"
    fi
  done
fi

# ─── Move remaining Desktop .md files to appropriate folders ───
echo "Organizing remaining docs..."
for f in "$DESKTOP"/*.md; do
  [ -f "$f" ] || continue
  BASE=$(basename "$f")
  # Skip if already in MASTER
  [ -f "$MASTER/02_ZYNRIP/$BASE" ] && continue
  [ -f "$MASTER/05_AI_SESSIONS/$BASE" ] && continue
  # Route by content
  if echo "$BASE" | grep -iq "legal\|trademark\|complaint\|ip\|privacy\|terms"; then
    mv "$f" "$MASTER/04_LEGAL/" && echo "  Moved to Legal: $BASE"
  elif echo "$BASE" | grep -iq "security\|f18\|protect\|evidence"; then
    mv "$f" "$MASTER/08_SECURITY/" && echo "  Moved to Security: $BASE"
  elif echo "$BASE" | grep -iq "brand\|zynthio\|mosoko\|kervalon\|coreyai"; then
    mv "$f" "$MASTER/07_BRANDS/" && echo "  Moved to Brands: $BASE"
  elif echo "$BASE" | grep -iq "song\|music\|lyric\|distro\|suno"; then
    mv "$f" "$MASTER/03_SONGPAL/" && echo "  Moved to SongPal: $BASE"
  else
    mv "$f" "$MASTER/05_AI_SESSIONS/" && echo "  Moved to AI Sessions: $BASE"
  fi
done

# ─── Move remaining loose files on Desktop to Archive ───
echo "Archiving remaining Desktop clutter..."
for f in "$DESKTOP"/*.txt "$DESKTOP"/*.pdf "$DESKTOP"/*.png "$DESKTOP"/*.jpg "$DESKTOP"/*.json; do
  [ -f "$f" ] || continue
  BASE=$(basename "$f")
  mv "$f" "$MASTER/10_ARCHIVE/" && echo "  Archived: $BASE"
done

# ─── Generate the MAP ───
echo ""
echo "=== Generating MAP ==="
MAP_FILE="$MASTER/MAP/ZYNRIP_MAP_${DATE}.md"

cat > "$MAP_FILE" << MAPEOF
# ZYNTHIO MASTER MAP
Generated: $(date)
Source: $DESKTOP
Owner: Corey McIvor (@coreintentdev)

## Folder Structure

| Folder | Purpose | File Count |
|--------|---------|------------|
| 01_COREINTENT | Trading engine repo | $(find "$MASTER/01_COREINTENT" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 02_ZYNRIP | Scans, protocols, scripts | $(find "$MASTER/02_ZYNRIP" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 03_SONGPAL | Music, lyrics, DistroKid | $(find "$MASTER/03_SONGPAL" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 04_LEGAL | Legal docs, TM, IP | $(find "$MASTER/04_LEGAL" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 05_AI_SESSIONS | Handovers, AI logs | $(find "$MASTER/05_AI_SESSIONS" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 06_VPS | VPS state, SSH, deploys | $(find "$MASTER/06_VPS" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 07_BRANDS | Zynthio, CoreyAI, etc | $(find "$MASTER/07_BRANDS" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 08_SECURITY | F18, identity, evidence | $(find "$MASTER/08_SECURITY" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 09_PERSONAL | Family, private | $(find "$MASTER/09_PERSONAL" -type f 2>/dev/null | wc -l | tr -d ' ') |
| 10_ARCHIVE | Old/inactive files | $(find "$MASTER/10_ARCHIVE" -type f 2>/dev/null | wc -l | tr -d ' ') |

## Full File Index
MAPEOF

# List every file in the master structure
find "$MASTER" -type f | sort | while read -r filepath; do
  REL="${filepath#$MASTER/}"
  SIZE=$(stat -f%z "$filepath" 2>/dev/null || stat --printf="%s" "$filepath" 2>/dev/null || echo "?")
  echo "- \`$REL\` ($SIZE bytes)" >> "$MAP_FILE"
done

echo "" >> "$MAP_FILE"
echo "## Suno Track Count" >> "$MAP_FILE"
echo "Total tracks in 03_SONGPAL/suno_tracks: $(find "$MASTER/03_SONGPAL/suno_tracks" -type f 2>/dev/null | wc -l | tr -d ' ')" >> "$MAP_FILE"
echo "" >> "$MAP_FILE"
echo "## Rules for AI Sessions" >> "$MAP_FILE"
echo "1. READ this map before touching any file" >> "$MAP_FILE"
echo "2. 09_PERSONAL is OFF LIMITS to AI" >> "$MAP_FILE"
echo "3. Never fabricate family data" >> "$MAP_FILE"
echo "4. NZ-first for all legal/business" >> "$MAP_FILE"
echo "5. Label demo data honestly" >> "$MAP_FILE"
echo "---" >> "$MAP_FILE"
echo "Generated by ZynRip Organize v1" >> "$MAP_FILE"

echo ""
echo "=== MAP GENERATED ==="
echo "Map file: $MAP_FILE"
echo ""

# ─── Summary ───
echo "=========================================="
echo " ZYNRIP ORGANIZE COMPLETE"
echo "=========================================="
echo ""
echo " Master folder: $MASTER"
echo " Total files:   $(find "$MASTER" -type f | wc -l | tr -d ' ')"
echo " Suno tracks:   $(find "$MASTER/03_SONGPAL/suno_tracks" -type f 2>/dev/null | wc -l | tr -d ' ')"
echo " Map:           $MAP_FILE"
echo ""
echo " Desktop is clean. Everything has a home."
echo " Next: paste the map into your next AI session."
echo ""
echo " 336 — signal organised."
echo ""

# Open the master folder
open "$MASTER"
