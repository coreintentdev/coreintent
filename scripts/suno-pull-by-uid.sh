#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# SongPal / Zynthio — Suno track puller, multi-UID, VDS-side
#
# Pulls new tracks + lyrics from N Suno accounts (by UID), stores
# audio + lyrics + cover on VDS, keeps a per-UID manifest so re-runs
# only fetch NEW tracks since last successful pull.
#
# Where to run: on the VDS (vmi3205024), out of cron / systemd timer.
# This Linux sandbox cannot run it — sandbox has no outbound to
# suno.com (firewalled, same restriction as api.cloudflare.com).
#
# Required env (in /root/zynthio/.env on the VDS):
#   SUNO_API_TOKEN     bearer token from Suno session cookie or API key
#   SUNO_UIDS          comma-separated list of 7 (or N) Suno account UIDs
#                      e.g. SUNO_UIDS="uid-abc,uid-def,uid-ghi,..."
#   SUNO_DEST          base dir on VDS (default /root/zynthio/songpal/suno)
#
# Optional:
#   SUNO_API_BASE      override Suno API base URL (default https://studio-api.suno.ai)
#   SUNO_RATE_MS       sleep between calls in ms (default 600)
#
# What it writes per track:
#   $SUNO_DEST/<uid>/<track_id>/audio.mp3
#   $SUNO_DEST/<uid>/<track_id>/lyrics.txt
#   $SUNO_DEST/<uid>/<track_id>/cover.jpg
#   $SUNO_DEST/<uid>/<track_id>/meta.json
#   $SUNO_DEST/<uid>/_manifest.tsv      (track_id<TAB>title<TAB>created_at<TAB>sha256)
#
# Manifest is the source-of-truth for "what's already pulled" — skip if
# track_id already present. New tracks append. SHA256 catches re-encodes.
#
# Cron example (every 6h, on VDS):
#   0 */6 * * * /root/zynthio/scripts/suno-pull-by-uid.sh >> /var/log/suno-pull.log 2>&1
#
# Per COR-51 ("Suno rip requested for months, never executed until forced"):
# the working pattern was already on VDS as suno_export.py with 249 links
# in my_suno_links.txt. This script generalises that from a links-file
# model to a per-UID polling model so new tracks land without manual list
# maintenance.
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Load VDS .env
if [ -f /root/zynthio/.env ]; then set -a; . /root/zynthio/.env; set +a; fi

SUNO_API_TOKEN="${SUNO_API_TOKEN:-}"
SUNO_UIDS="${SUNO_UIDS:-}"
SUNO_DEST="${SUNO_DEST:-/root/zynthio/songpal/suno}"
SUNO_API_BASE="${SUNO_API_BASE:-https://studio-api.suno.ai}"
SUNO_RATE_MS="${SUNO_RATE_MS:-600}"

if [ -z "$SUNO_API_TOKEN" ] || [ -z "$SUNO_UIDS" ]; then
  echo "ERROR: SUNO_API_TOKEN and SUNO_UIDS must be set in /root/zynthio/.env"
  echo "  SUNO_UIDS is comma-separated, e.g.: SUNO_UIDS=uid1,uid2,uid3,uid4,uid5,uid6,uid7"
  exit 1
fi

mkdir -p "$SUNO_DEST"

AUTH=( -H "Authorization: Bearer $SUNO_API_TOKEN" -H "Accept: application/json" \
       -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 zynthio-songpal/1.0" )

sleep_rate() { sleep "$(awk -v ms="$SUNO_RATE_MS" 'BEGIN { print ms/1000 }')"; }

pull_uid() {
  local uid="$1"
  local dest="$SUNO_DEST/$uid"
  local manifest="$dest/_manifest.tsv"
  local page=0 page_size=100 total_added=0

  mkdir -p "$dest"
  touch "$manifest"

  echo "──── uid=$uid ────"

  while :; do
    local resp_body resp_code list_json count
    # Suno feed endpoint shape — adjust if your suno_export.py uses a different one.
    # Common patterns:
    #   GET /api/feed/v2?page=$page&size=$page_size&user_id=$uid
    #   GET /api/external/clips?user_id=$uid&offset=$((page * page_size))
    # Pick whichever your existing suno_export.py / .env was using.
    resp_body=$(curl -sS "${AUTH[@]}" \
      "${SUNO_API_BASE}/api/feed/v2?page=${page}&size=${page_size}&user_id=${uid}" \
      || echo '{"clips":[]}')
    count=$(echo "$resp_body" | jq '.clips | length' 2>/dev/null || echo 0)
    if [ "$count" -eq 0 ] 2>/dev/null; then break; fi

    # iterate clips
    echo "$resp_body" | jq -c '.clips[]' 2>/dev/null | while read -r clip; do
      local id title audio_url image_url lyrics created
      id=$(echo "$clip" | jq -r '.id // empty')
      [ -z "$id" ] && continue

      # skip if already in manifest
      if grep -qE "^$id\b" "$manifest" 2>/dev/null; then continue; fi

      title=$(echo "$clip" | jq -r '.title // "untitled"' | tr '/' '_')
      audio_url=$(echo "$clip" | jq -r '.audio_url // empty')
      image_url=$(echo "$clip" | jq -r '.image_url // empty')
      lyrics=$(echo "$clip" | jq -r '.metadata.prompt // .metadata.gpt_description_prompt // ""')
      created=$(echo "$clip" | jq -r '.created_at // ""')

      local track_dir="$dest/$id"
      mkdir -p "$track_dir"
      echo "$clip" > "$track_dir/meta.json"
      [ -n "$lyrics" ] && printf '%s\n' "$lyrics" > "$track_dir/lyrics.txt"

      # audio (with UA — Suno blocks the default curl UA per COR-51 notes)
      if [ -n "$audio_url" ]; then
        curl -sS -L "${AUTH[@]}" "$audio_url" -o "$track_dir/audio.mp3" \
          && local sha; sha=$(sha256sum "$track_dir/audio.mp3" | awk '{print $1}') \
          || sha="DOWNLOAD_FAIL"
      else
        sha="NO_AUDIO_URL"
      fi

      # cover
      if [ -n "$image_url" ]; then
        curl -sS -L "${AUTH[@]}" "$image_url" -o "$track_dir/cover.jpg" || true
      fi

      printf '%s\t%s\t%s\t%s\n' "$id" "$title" "$created" "$sha" >> "$manifest"
      total_added=$((total_added + 1))
      sleep_rate
    done

    if [ "$count" -lt "$page_size" ]; then break; fi
    page=$((page + 1))
  done

  echo "uid=$uid new_tracks=$total_added manifest=$manifest"
}

echo "═══ suno-pull-by-uid starting $(date -u +%Y-%m-%dT%H:%M:%SZ) ═══"
IFS=',' read -ra UIDS_ARR <<< "$SUNO_UIDS"
for uid in "${UIDS_ARR[@]}"; do
  uid=$(echo "$uid" | xargs)  # trim
  [ -z "$uid" ] && continue
  pull_uid "$uid" || echo "FAIL uid=$uid"
done
echo "═══ done $(date -u +%Y-%m-%dT%H:%M:%SZ) ═══"
echo ""
echo "Total tracks per uid (audio + lyrics + cover + meta):"
find "$SUNO_DEST" -maxdepth 2 -mindepth 2 -type d | awk -F/ '{print $(NF-1)}' | sort | uniq -c | sort -rn
