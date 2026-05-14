# Wave 1 Deploy Manifest — 2026-05-05

**Target:** Contabo VDS `161.97.89.49` (NOT legacy Cloudzy `104.194.156.109`)
**Approach:** Mac-bypass — pull directly from Google Drive via `rclone` running ON the VDS
**Why bypass Mac:** Resolves all three CLI-Max gate-catches in one move — wrong host, missing SSH key, 143G→16G disk overflow
**Disk impact:** ~7.5 MB (well under Contabo free space; verify with audit before run)
**Runner:** Execute `scripts/rclone_drive_to_vds_wave1.sh` on the VDS via SSH session

---

## Wave 1 contents (verified Drive IDs, all read 2026-05-05)

### Today's session deliverables (~30 KB markdown, gdoc-form)

| # | Title | Drive ID | Size | Mime | Doctrine gate |
|---|---|---|---|---|---|
| 1 | ZYNTHIO SOVEREIGN MATRIX: MASTER ARCHITECTURAL HANDOVER | `1N_4kBr4KyYX05_-khQhHKUZWo5GR-zBaW4UR5iPChUs` | 8.4 KB | gdoc | none |
| 2 | The ZYNTHIO Sovereign Matrix: Unified Strategic Roadmap & Forensic Evidence Compendium | `1sAANdu58D5X55aWee9Ssnb2sQAPYxzF-ufbjpBHnGiY` | 9 KB | gdoc | none |
| 3 | Workspace Search and Project Status Report | `1ZRe1gIB45QV4iHeAKWiFq9VcPfTh6lNxDJfiUIjYook` | 27 KB | gdoc | none |
| 4 | Timeline of Critical AI Failures and Legal Disputes 2026 | `1iKnLBEyvn6UrH3rxh87JZPf2Z1IFLoZugUY30OYEZpw` | 5 KB | gsheet | none |
| 5 | SOVEREIGN_MATRIX_TRIAGE_20260505 | `1hxm-mz48BDSnJkH7EKOeaWQtlpUTtw4x` | 2.2 KB | md | none |
| 6 | SUNO_FILTER_AVOIDANCE_RULES_336 | `15XN0VasnD_-x-935ve5FmDIgs_5Uam7D` | 2.1 KB | md | none |

### Today's song specs — paste-ready (~28 KB)

| # | Title | Drive ID | Size | Mime | Doctrine gate |
|---|---|---|---|---|---|
| 7 | SONG_TAXI_DENIS_UNA_VIDA_EN_EL_ESPEJO_20260505 (8-track album) | `1kPKJ4jQB-eP7zr9ODTyrwzC4eczhWXQxE9pqVir7ke8` | 5.3 KB | gdoc | **Denis hears first** |
| 8 | SONG_SET_TAXI_DENIS_BILINGUAL_20260505 (4 jingles) | `1n4onh9z67aovy_vjSk2eKRqNX6xuSjhG` | 4.6 KB | md | **Denis hears first** + PII (phone in lyrics) |
| 9 | SONG_DENIS_FUERZA_INTELIGENTE_20260505 | `1aIq0QcQZg0qjsejeUEMQxBBCcP4_3p2H` | 2.8 KB | md | **Denis hears first** |
| 10 | SONG_GUSTAVO_DESDE_ADENTRO_20260505 | `12ksb5F5d4qkVDTlWtei5mDXI_0F-fHv5` | 2.4 KB | md | **Gustavo hears first** |
| 11 | SONG_MICHELLE_GOTTA_LOTTA_336 | `1NHjuM2pQtv6uiVMXtxTFNS4aIXMoy4Xt89deddirNGE` | 4.6 KB | gdoc | **Michelle hears first**, credit `© Michelle Grogan × ZYNTHIO™` |
| 12 | SONG_GOOSE_FRA_BA_336 | `1xHJ9eyLNnn8ZFTRInW_Sm8c8ekIEwomy_PPp5kiA53U` | 3.6 KB | gdoc | none |
| 13 | FOOD_PLAY_TRACKS_336 | `1VL0AZTyy-yS-FahkvKSCbKx5mfOQJVxoqsSfaRYJ93k` | 7.8 KB | gdoc | none |

### `new-for-research/` folder — today's delegation set (~30 KB)

| # | Title | Drive ID | Size |
|---|---|---|---|
| 14 | WELCOME_AUDIO_RAFA_KELVIN_SPEC | `1tEKhK4P_hRd5E-aQS-8NVVMe5v70KsYXvMJYgOdrcK0` | 3.9 KB |
| 15 | SINGPAL_PRACTICE_COACH_SPEC | `1QGUnRGdS5p3pB1tCIs1iML3aPe3adaTD` | 4.2 KB |
| 16 | NICK_DELEGATION_NOTE | `1HRdhXqBS53IdfpdXotb2IEcEOo_2hkCw` | 2.6 KB |
| 17 | RAFA_DELEGATION_NOTE | `1QBIvRAAeCiaOURBLkYGQjuc1TIcMJxxT` | 2.2 KB |
| 18 | KELVIN_DELEGATION_NOTE | `1tBsdF73bVkZE6ZPRMyFYtgv7IJaU6AsZ` | 1.7 KB |
| 19 | SONG_TRUST_GROWS_RESPECT_TEAM_20260505 | `1l6Hqt5u5jsL1vSi3ck8xvDQTiT8SwuCd` | 3.7 KB |
| 20 | SONG_TRUST_EVEN_SLATE_CLEAR_20260505 | `1uSwcMzNE4Ry6W9CLWac_yTmQiMn7hZr-` | 3.6 KB |
| 21 | WIN_REPORT_336_TRUST_RESTORED_20260505 | `1RFxmAg6dBD2ZUUHeq-SRTeIAdXtDBFjk` | 2.3 KB |

### VDS migration doctrine (Apr 21–30, ~120 KB)

| # | Title | Drive ID | Size |
|---|---|---|---|
| 22 | Urgent Tech Support and Data Migration (md) | `1ZrTVxk7hsuTzT2WKF98Fuazz9pwTDGG5` | 51.6 KB |
| 23 | Zynthio Project & Google to Proton Migration | `1_uEIX9Hf7e3PO29RfRuiRtXwzmCNeQu9Mpi24874qIU` | 27 KB |
| 24 | VDS_RCLONE_MAIL_READ_SETUP_20260428 | `1jn4zad2D_miW_sJtxD6cz5k9x7_19fuh` | 1.8 KB |
| 25 | RCLONE_GOOGLE_TO_PROTON_VDS | `1v0ozCF9pNF_jRRC1aROqXXh8oc3pq64T` | 1.3 KB |
| 26 | VDS_AUDIT_2026-04-21 | `1HWV0jm4YSvrQ34Kb7-13UtneczY_FlGw` | 11.7 KB |
| 27 | GOOGLE_DUAL_PATH_RCLONE_VDS_PLUS_TAKEOUT_STRATEGY | `1OR_DwPBXaYBTlrQA86QnEUbjU0sYg9Jg` | 6.5 KB |
| 28 | Zynthio Stack Deployment Checklist | `13CPY33YdILAGojmOKCOHGgoexSRVoY5YzaodbtsBSMg` | 26 KB |
| 29 | Zynthio Project Handover and Activity | `1RxC7JspPBGF3ctNvOWWiRRZu9p7m-d3cU_NVwstSvoc` | 26 KB |
| 30 | Zynthio Stack Future Development Recommendations | `1pNaOCqjgfXEnX6C5PBbERFrVg7r-AFHaYDrn1TNIDkk` | 28 KB |

### Multilingual-wordplay branch (PR #67) — pull via git, not rclone

| # | Source | Files |
|---|---|---|
| 31 | `coreintentdev/coreintent` branch `claude/multilingual-wordplay-support-iym1B` | `track_01..track_10` (~700 lines, 10 paste-ready Suno specs) |

**Pull command on VDS:**
```bash
gh repo clone coreintentdev/coreintent /root/zynthio/wave1_$(date -u +%Y%m%d_%H%M%S)/coreintent_pr67
cd coreintent_pr67 && git checkout claude/multilingual-wordplay-support-iym1B
```

---

## Doctrine gates (HARD — do not skip)

1. **Denis hears first** — no public push of items 7, 8, 9 until Denis Claro greenlights
2. **Gustavo hears first** — no public push of item 10 until Gustavo greenlights
3. **Michelle hears first** — no public push of item 11; credit must read `© Michelle Grogan × ZYNTHIO™` (never "Michelle McIvor")
4. **PII redaction for public push only** — Denis's WhatsApp `+505 5807 3146` is intentional in song lyrics (his taxi marketing); fine for VDS storage; redact only if pushing to channels Denis hasn't approved
5. **Doctrine 24 filter clean** — applies to all SONG_* items; verify in CLI before generation
6. **Family Proton accounts (Ruby + Wesley)** — NOT in Wave 1; parent-side execution only, no AI session creates accounts

---

## Excluded from Wave 1 (waiting on user decisions)

- Lawyer evidence pack (`FOR_LAWYER_THEIR_EVIDENCE_ONLY_20260430/`, ~17 MB) — separate handover, legal chain-of-custody
- `conversations.json` (89 MB) — Wave 2, after Contabo disk verified
- NotebookLM corpus — Wave 2, after agent-scrub of node_modules residue
- ZYNRIP_* dated snapshots (~3 GB total) — Wave 3, newest snapshot only after consolidation

---

## Pre-flight gates (run BEFORE the rclone script)

1. **Verify Contabo disk** — `ssh -i ~/.ssh/zynthio_dc root@161.97.89.49 'df -h /'` should show >5G free
2. **Verify rclone gdrive remote on VDS** — `ssh ... root@161.97.89.49 'rclone lsd gdrive:'` should list folders
3. **Verify writable target dir** — `ssh ... root@161.97.89.49 'mkdir -p /root/zynthio/wave1_test && rmdir /root/zynthio/wave1_test'` should succeed
4. **Dry-run** — `bash scripts/rclone_drive_to_vds_wave1.sh --dry-run` and review file list

If any of (1)–(3) fails, do NOT proceed. Resolve first.

---

## Rollback

Each Wave is its own timestamped dir: `/root/zynthio/wave1_<UTC_TIMESTAMP>/`. If anything breaks, `rm -rf` the dated dir. No in-place sync, no overwrites.
