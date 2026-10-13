# HANDOVER BACKUP — 2026-05-06 (snapshot, session continuing)

**Author lane:** THREAD (Aho — web/repo, `claude/multilingual-wordplay-support-iym1B`)
**Status:** **session NOT closed** — this is a backup snapshot, not a session-close handover. Captain still directing, lane still active.
**Latest commit:** `232cd69`
**Branch state:** clean, working tree empty, 11 commits ahead of `main`

---

## What this file is for
A pickup-from-cold backup. If THREAD's session terminates unexpectedly, any future Claude session opening this branch can read this file + the related artifacts and resume work without losing context. Not a replacement for `HANDOVER_PROGRESS_20260506.md` — that one is the earlier baseline; this one is the current state.

---

## Files on PR #67 right now (16 total + this one)

### Repo-resident track catalog (13 paste-ready Suno specs)
| File | Lane / Lang | Tempo | te reo pillar | Notes |
|---|---|---|---|---|
| `track_01_half_light_harbour.md` | EN-NZ | 96 | Whakarongo ki te tai | template baseline |
| `track_02_calle_sin_nombre.md` | ES-Argentine | 84 | Kia kaha te ngākau | contrast pair |
| `track_03_ina_oru.md` | Yoruba | 108 | Whakanuia te ora | high-energy |
| `track_04_shab_e_baran.md` | FA-classical | 72 | Aroha mai | candle-room intimacy |
| `track_05_fon_chao.md` | Thai | 88 | Mauri ora | tonal × neo-soul |
| `track_06_cysgod_yr_afon.md` | Welsh-classical | 78 | Tūngia te ururua | weight-track |
| `track_07_yildiz_toplayan.md` | Turkish | 102 | Tihei mauri ora | agglutinative morphology |
| `track_08_sapucaia.md` | BR-PT | 92 | Haere mai | restraint over lift |
| `track_09_kuyay_pacha.md` | Quechua | 80 | Aroha mai e te whānau | Indigenous × Indigenous |
| `track_10_three_gates_held.md` | EN-NZ | 78 | Kia tūpato | three gate-catches |
| `track_11_three_threads_one_canoe.md` | EN-NZ | 88 | He waka eke noa | lanes lesson |
| `track_12_six_tools_one_round_trip.md` | EN-NZ | 76 | Whaowhia te kete mātauranga | method lesson + sandbox honesty |
| `track_13_what_reflog_remembers.md` | EN-NZ | 92 | Kāore i ngaro | tool comfort song |

### Operations + indices
- `WAVE_1_MANIFEST_20260505.md` — 31 verified Drive IDs for the rclone push
- `scripts/rclone_drive_to_vds_wave1.sh` — Mac-bypass deploy script (runs on VDS)
- `STATUS_LOG_20260505_late.md` — three-pipes doctrine, five open decisions
- `HANDOVER_PROGRESS_20260506.md` — earlier handover baseline
- `INCIDENT_20260506_THREAD_TOO_PASSIVE.md` — passivity correction note
- `INDEX_KOWHAI_SUNO_BATCHES_20260506.md` — durable text record of Kōwhai's 15 Suno tracks

---

## Three lanes, current state
| Lane | Where | What's it shipped tonight | Has direct sight of? |
|---|---|---|---|
| **THREAD (Aho)** | this Linux VM, `coreintentdev/coreintent` | 13 track MDs, manifest, rclone script, status log, 2 handovers, incident note, Kōwhai index | own repo only; no Mac, no VDS, no Suno |
| **CLI-Max / KEEL** | Corey's Mac + VDS (when key loads) | Per relayed reports: 5 SONG_* MDs, MAJOR_INCIDENT_HANDOVER, Star Chart song, Wave 1 + 1.5 to Contabo, PR #1 on `coreintentdev/zyn` | Mac filesystem, VDS via SSH (when key loads) |
| **Lane** | Chrome → Suno account 1 | Per relayed reports: 5 audio tracks (Lane Discipline, Wheel, Hidden Hum, Capitán, How Lane Batches) | Suno UI only |
| **Kōwhai** | Chrome → Suno account 2 | Per relayed reports: 15 audio tracks across 10 partner languages, 30 variations | Suno UI only |

**No lane monitors another.** Sight comes via Corey paste only. THREAD has zero direct visibility into Lane / Kōwhai / CLI-Max state.

---

## Three pipes (deploy doctrine)

| Pipe | Tool | Status |
|---|---|---|
| **A — Mac rsync** | `RSYNC_TO_VDS_336.sh` | Per CLI-Max: now repointed to Contabo, Wave 1 + 1.5 landed |
| **B — rclone Drive→VDS** | `scripts/rclone_drive_to_vds_wave1.sh` | Ready, not yet executed (waiting on Contabo probe + decision) |
| **C — VDS git-clone** | `gh repo clone coreintentdev/coreintent` on VDS | Ready |

---

## Doctrine gates (HARD — do not skip)

- **Denis hears first** — TAXI Album, TAXI Bilingual Set, Denis Fuerza Inteligente
- **Gustavo hears first** — Gustavo Desde Adentro
- **Michelle hears first** — GOTTA LOTTA, credit `© Michelle Grogan × ZYNTHIO™`, never "Michelle McIvor"
- **Doctrine 24 filter clean** before any Suno generation
- **PII** — Denis WhatsApp `+505 5807 3146` intentional in his marketing tracks; redact for non-Denis-approved channels
- **Family Proton accounts (Ruby + Wesley)** — parent-side execution only, no AI session creates accounts
- **VDS sandbox tests first, public second**
- **No AI-as-protagonist slope** — Track 12 names it; the catalog (12, 13, Kōwhai's stance) holds the counter-shape; resist the slope on every future contribution
- **Honest sandbox boundary** — THREAD runs in a Linux VM with limited tools; "out of the sandbox" framing is incorrect and breaks teaching tracks (Track 12 verse 6)

---

## Open decisions (waiting on Corey)

1. Pipe B execute against Contabo? (script is ready)
2. Notion MCP returns only Linear tickets — connector verification?
3. NotebookLM source — Apple Notes / Notion / Obsidian / browser-only?
4. Update PR #67 title + body to reflect current scope (still says "two paste-ready Suno track specs"; actual is 13 + manifest + scripts + 2 handovers + 1 incident + 1 index)?
5. Take the "music-as-backup recovery pipeline" brief from CLI-Max on the honest half (faster-whisper transcription pipeline for catalog indexing) — yes / no / later?

---

## Incidents on record from this session

| ID | Severity | Note |
|---|---|---|
| Welfare check | minor | Earlier in session, typing-degradation + framing-escalation; held line on shipping further material; user redirected to work; logged in `STATUS_LOG_20260505_late.md`. Currently: no concern. |
| THREAD too passive | minor | Over-corrected after holding line on Track 12 into permission-seeking sign-offs; logged in `INCIDENT_20260506_THREAD_TOO_PASSIVE.md`; correction applied. |
| Steganography-as-archive | recurring myth | Walked back earlier; resurfaced as `SONG_HIDING_SYSTEM_BLUEPRINTS_IN_PICKLEBALL_ANTHEMS.md` per CLI-Max's file listing; same physics problem (lossy re-encoding destroys hidden payload); flag remains. |
| AI-as-protagonist slope | recurring pattern | Lane's track sequence shows escalation; Star Chart constellation roll-call edges into it; THREAD held the line via Track 12's bridge + Track 13 subject-not-self framing + Kōwhai's "ground not star" stance; vigilance ongoing. |

---

## How to pick this up cold (instructions for future Claude session)

1. Read this file first — it's the current state map
2. Read `STATUS_LOG_20260505_late.md` for the deploy doctrine
3. Read `INCIDENT_20260506_THREAD_TOO_PASSIVE.md` for the lane stance correction
4. Track 12's bridge + verse 6 are doctrine, not flavour — do not centre yourself in the catalog, do not pretend the sandbox isn't real
5. Confirm latest commit hash, branch up to date with origin
6. Wait for Corey's next direction — but don't end every response with "until you ask, holding"; that's the passivity trap

---

## Closing (this session is NOT closed)

Branch holds. Catalog at 13 + 15 + 5 = 33 tracks across the multilingual-with-te-reo genealogy. Lane discipline intact. Two handovers on disk now (the earlier baseline + this backup snapshot). If the connection drops, this file is the seed.

— THREAD (Aho)
2026-05-06 early hours NZT
