# Handover to Google (Drive scan + deep research)

**Purpose:** Paste or upload this into **Gemini / NotebookLM / AI Pro** with **Google Drive access enabled**, instead of pretending one Cursor chat holds full workspace context (it mathematically cannot).

---

## Prompt to paste into Google (Deep / Pro / notebook)

You are indexing and answering from my **authorised Google Drive** plus any sources I attach. Do **research only** — no fluff, no hypotheticals about what “might” be there. If you cannot find it in Drive or attached docs, say **unknown / not indexed**.

### Incident summary for Google (research-only — no debate replay)

Paste this block if you want Drive-side recall without reopening chat arguments:

- **INC-010–013:** IDE context limits (~94%+), Cursor Composer strain, `ZYN_RIP_SRC` gate in zynthio-tools, huge workspaces.
- **INC-014:** Expectation that Zyn/session text **auto-posts** incidents is **not** implemented — `/api/incidents` is static array + POST stub until automation ships; session files are not ingested automatically.
- **INC-015:** Repo mismatch in local terminal: attempted `git pull origin claude/check-coreintent-builds-JTrDd` inside `~/Desktop/zynthio-tools`; that branch exists in **coreintent** repo, not zynthio-tools. Pull each repo on its own branch.
- **Abuse/moderation UX:** Systems that echo verbatim harmful input back as “feedback” compound harm — prefer category labels without repeating slurs.

Do **not** use this notebook to argue with the user — output **facts, file paths, timelines, gaps** only.

### Ground truth

- **Project:** CoreIntent → **Zynthio.ai** — agentic AI **paper trading** engine (not live exchange-connected until explicitly wired).
- **Owner:** Corey McIvor NZ (@coreintentdev). **NZ-first** legal/business — do not infer Australia registration.
- **Repos / tools:** GitHub **`coreintentdev/coreintent`**; local tooling folder often **`~/Desktop/zynthio-tools`** (includes ZynRip workflows, manifests, scans).
- **Branches (recent):** `claude/check-coreintent-builds-JTrDd` — honest demo API labels, 8-model AI Studio, timeouts; **`cursor-zynrip-incident-ef32`** — cross-platform ZynRip script iterations (merge if desired).
- **Pain:** Huge local/workspace file counts (**100k+** in some Cursor folders) blow IDE context and Composer queue; **ZynRip** must run **on the Mac** to produce **`ZYNTHIO_MASTER/MAP/`** inventories — cloud agents cannot see Desktop.
- **`zynthio-tools` script:** Raw rip step uses **`ZYN_RIP_SRC`** pointing at folder under e.g. `rips/YYYY-...` — export then run organise.
- **Honesty rule:** Demo routes are labelled **`mode: "demo"`** in API JSON when not live; never claim live trading or exchange connectivity without env proof.

### What I need from you (Google)

1. **Scan Drive** for: session saves, handovers, manifests, architecture truth docs, ZynRip maps, `.md` / `.txt` with `HANDOVER`, `SESSION`, `ARCHITECTURE`, `ZYNRIP`, `COREINTENT`, `manifest` in name or body.
2. **Produce:** (a) one-page **timeline** of decisions (pricing = competitions not subscriptions; paper trading; VPS scripts exist but deploy status varies); (b) **file inventory table** — path, one-line purpose, last-known status; (c) **gaps** — what’s missing or contradictory between docs.
3. **Do not** invent domain counts or “everything is connected.” If unclear, **unknown**.

### Success criteria

A single export I can drop back into Cursor or Claude as **verified-from-Drive** context (with gaps explicit), reducing keyword-fishing and repeated arguments.

---

## How to wire Drive in Google

1. **Gemini (gemini.google.com)** → enable **Google Workspace / Drive** connector if your account tier allows.
2. **NotebookLM** → New notebook → **Sources** → Add **Google Drive** folders (start with `zynthio-tools`, `manifests`, handover folders).
3. **Paste** the block above as the first instruction; **attach** `claudsession.txt` or export from Desktop if small enough.

---

## Cursor / IDE reality (short)

- **94%+ context** in Composer = high risk of loss, internal errors, and queue bugs — **not** “full project knowledge.”
- Mitigation: **smaller workspace root**, **ZynRip MAP** into agent turns, **Google** for bulk corpus, **this repo** for code truth.

---

*Generated for CoreIntent — research handover only, no deployment claims.*
