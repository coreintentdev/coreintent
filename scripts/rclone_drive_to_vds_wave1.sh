#!/usr/bin/env bash
#
# rclone_drive_to_vds_wave1.sh
# Mac-bypass Wave 1 deploy: pulls files directly from Google Drive to Contabo VDS
# via rclone, no Mac courier required.
#
# Run ON THE VDS via:
#   ssh -i ~/.ssh/zynthio_dc root@161.97.89.49
#   bash /root/zynthio/scripts/rclone_drive_to_vds_wave1.sh [--dry-run]
#
# Prereqs (verify with pre-flight in WAVE_1_MANIFEST_20260505.md):
#   - rclone configured with remote named 'gdrive' pointing at corey.mcivor@gmail.com Drive
#   - >5G free on /root
#   - bash >= 4
#
# Doctrine: nothing public-pushes from this script. Files land in
# /root/zynthio/wave1_<UTC>/ as immutable snapshot.

set -euo pipefail

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "DRY RUN — no files will be transferred"
fi

UTC_STAMP=$(date -u +%Y%m%d_%H%M%S)
TARGET="/root/zynthio/wave1_${UTC_STAMP}"
LOG="${TARGET}/_wave1_rclone.log"

mkdir -p "${TARGET}"/{session,songs,delegations,migration_doctrine,pr67_multilingual}

echo "Wave 1 deploy → ${TARGET}"
echo "Started: $(date -u -Iseconds)" | tee -a "${LOG}"

# File ID arrays (verified 2026-05-05 via Drive API read)
declare -A SESSION=(
  [1N_4kBr4KyYX05_-khQhHKUZWo5GR-zBaW4UR5iPChUs]="ZYNTHIO_SOVEREIGN_MATRIX_HANDOVER.md"
  [1sAANdu58D5X55aWee9Ssnb2sQAPYxzF-ufbjpBHnGiY]="ZYNTHIO_Sovereign_Matrix_Roadmap.md"
  [1ZRe1gIB45QV4iHeAKWiFq9VcPfTh6lNxDJfiUIjYook]="Workspace_Search_and_Project_Status_Report.md"
  [1iKnLBEyvn6UrH3rxh87JZPf2Z1IFLoZugUY30OYEZpw]="Timeline_of_Critical_AI_Failures_2026.csv"
  [1hxm-mz48BDSnJkH7EKOeaWQtlpUTtw4x]="SOVEREIGN_MATRIX_TRIAGE_20260505.md"
  [15XN0VasnD_-x-935ve5FmDIgs_5Uam7D]="SUNO_FILTER_AVOIDANCE_RULES_336.md"
)

declare -A SONGS=(
  [1kPKJ4jQB-eP7zr9ODTyrwzC4eczhWXQxE9pqVir7ke8]="SONG_TAXI_DENIS_UNA_VIDA_EN_EL_ESPEJO_20260505.md"
  [1n4onh9z67aovy_vjSk2eKRqNX6xuSjhG]="SONG_SET_TAXI_DENIS_BILINGUAL_20260505.md"
  [1aIq0QcQZg0qjsejeUEMQxBBCcP4_3p2H]="SONG_DENIS_FUERZA_INTELIGENTE_20260505.md"
  [12ksb5F5d4qkVDTlWtei5mDXI_0F-fHv5]="SONG_GUSTAVO_DESDE_ADENTRO_20260505.md"
  [1NHjuM2pQtv6uiVMXtxTFNS4aIXMoy4Xt89deddirNGE]="SONG_MICHELLE_GOTTA_LOTTA_336.md"
  [1xHJ9eyLNnn8ZFTRInW_Sm8c8ekIEwomy_PPp5kiA53U]="SONG_GOOSE_FRA_BA_336.md"
  [1VL0AZTyy-yS-FahkvKSCbKx5mfOQJVxoqsSfaRYJ93k]="FOOD_PLAY_TRACKS_336.md"
)

declare -A DELEGATIONS=(
  [1tEKhK4P_hRd5E-aQS-8NVVMe5v70KsYXvMJYgOdrcK0]="WELCOME_AUDIO_RAFA_KELVIN_SPEC.md"
  [1QGUnRGdS5p3pB1tCIs1iML3aPe3adaTD]="SINGPAL_PRACTICE_COACH_SPEC.md"
  [1HRdhXqBS53IdfpdXotb2IEcEOo_2hkCw]="NICK_DELEGATION_NOTE.md"
  [1QBIvRAAeCiaOURBLkYGQjuc1TIcMJxxT]="RAFA_DELEGATION_NOTE.md"
  [1tBsdF73bVkZE6ZPRMyFYtgv7IJaU6AsZ]="KELVIN_DELEGATION_NOTE.md"
  [1l6Hqt5u5jsL1vSi3ck8xvDQTiT8SwuCd]="SONG_TRUST_GROWS_RESPECT_TEAM_20260505.md"
  [1uSwcMzNE4Ry6W9CLWac_yTmQiMn7hZr-]="SONG_TRUST_EVEN_SLATE_CLEAR_20260505.md"
  [1RFxmAg6dBD2ZUUHeq-SRTeIAdXtDBFjk]="WIN_REPORT_336_TRUST_RESTORED_20260505.md"
)

declare -A MIGRATION=(
  [1ZrTVxk7hsuTzT2WKF98Fuazz9pwTDGG5]="Urgent_Tech_Support_and_Data_Migration.md"
  [1_uEIX9Hf7e3PO29RfRuiRtXwzmCNeQu9Mpi24874qIU]="Zynthio_Project_and_Google_to_Proton_Migration.md"
  [1jn4zad2D_miW_sJtxD6cz5k9x7_19fuh]="VDS_RCLONE_MAIL_READ_SETUP_20260428.md"
  [1v0ozCF9pNF_jRRC1aROqXXh8oc3pq64T]="RCLONE_GOOGLE_TO_PROTON_VDS.md"
  [1HWV0jm4YSvrQ34Kb7-13UtneczY_FlGw]="VDS_AUDIT_2026-04-21.md"
  [1OR_DwPBXaYBTlrQA86QnEUbjU0sYg9Jg]="GOOGLE_DUAL_PATH_RCLONE_VDS_PLUS_TAKEOUT_STRATEGY.md"
  [13CPY33YdILAGojmOKCOHGgoexSRVoY5YzaodbtsBSMg]="Zynthio_Stack_Deployment_Checklist.md"
  [1RxC7JspPBGF3ctNvOWWiRRZu9p7m-d3cU_NVwstSvoc]="Zynthio_Project_Handover_and_Activity.md"
  [1pNaOCqjgfXEnX6C5PBbERFrVg7r-AFHaYDrn1TNIDkk]="Zynthio_Stack_Future_Development_Recommendations.md"
)

# Pull function — handles gdoc/gsheet export to markdown/csv
pull_group() {
  local group_name=$1
  local subdir=$2
  local -n files_ref=$3

  echo "" | tee -a "${LOG}"
  echo "── ${group_name} ──" | tee -a "${LOG}"

  for file_id in "${!files_ref[@]}"; do
    local out_name="${files_ref[$file_id]}"
    local out_path="${TARGET}/${subdir}/${out_name}"

    # Detect Google native types by trying export first; fall back to copy for native files
    if [[ "${out_name}" == *.csv ]]; then
      echo "  export gsheet ${file_id} → ${out_name}" | tee -a "${LOG}"
      [[ -z "${DRY_RUN}" ]] && rclone copyto "gdrive:{${file_id}}" "${out_path}" \
        --drive-export-formats csv 2>>"${LOG}" || true
    else
      echo "  pull ${file_id} → ${out_name}" | tee -a "${LOG}"
      [[ -z "${DRY_RUN}" ]] && rclone copyto "gdrive:{${file_id}}" "${out_path}" \
        --drive-export-formats md 2>>"${LOG}" || true
    fi
  done
}

pull_group "Session deliverables" "session" SESSION
pull_group "Today's song specs" "songs" SONGS
pull_group "Delegations + research" "delegations" DELEGATIONS
pull_group "VDS migration doctrine" "migration_doctrine" MIGRATION

# Pull PR #67 multilingual tracks via git
echo "" | tee -a "${LOG}"
echo "── PR #67 multilingual-wordplay branch ──" | tee -a "${LOG}"
if [[ -z "${DRY_RUN}" ]]; then
  if command -v gh &>/dev/null; then
    gh repo clone coreintentdev/coreintent "${TARGET}/pr67_multilingual" -- \
      --branch claude/multilingual-wordplay-support-iym1B --depth 1 2>>"${LOG}"
  else
    git clone --depth 1 --branch claude/multilingual-wordplay-support-iym1B \
      https://github.com/coreintentdev/coreintent.git \
      "${TARGET}/pr67_multilingual" 2>>"${LOG}"
  fi
else
  echo "  [dry-run] would clone coreintentdev/coreintent#claude/multilingual-wordplay-support-iym1B" | tee -a "${LOG}"
fi

# Summary
echo "" | tee -a "${LOG}"
echo "── Summary ──" | tee -a "${LOG}"
if [[ -z "${DRY_RUN}" ]]; then
  echo "Files landed:" | tee -a "${LOG}"
  find "${TARGET}" -type f \( -name "*.md" -o -name "*.csv" \) -not -name "_wave1_rclone.log" \
    | sort | tee -a "${LOG}"
  echo "" | tee -a "${LOG}"
  echo "Total size:" | tee -a "${LOG}"
  du -sh "${TARGET}" | tee -a "${LOG}"
fi
echo "Finished: $(date -u -Iseconds)" | tee -a "${LOG}"
echo ""
echo "Wave 1 complete. Snapshot at: ${TARGET}"
echo "Log: ${LOG}"
echo ""
echo "DOCTRINE GATES (do NOT skip):"
echo "  - Denis hears first (TAXI tracks 7-9)"
echo "  - Gustavo hears first (track 10)"
echo "  - Michelle hears first (track 11) + credit must be © Michelle Grogan × ZYNTHIO™"
echo "  - Doctrine 24 filter scan before any Suno generation"
echo "  - PII (Denis WhatsApp) intentional for taxi-marketing only; redact for non-Denis-approved channels"
