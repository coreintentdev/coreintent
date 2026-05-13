# Handover — for the next agent / next person / future Corey

Operator decision 2026-05-13: pause Claude as project-manager. Use it
later for scoped coding tasks only. This document is the cold-pickup
file — read this first, no other context required.

## Project in one line

CoreIntent (under Zynthio.ai parent brand): agentic AI trading engine,
competition-based platform (not subscriptions), multi-AI orchestration
(Grok / Claude / Perplexity), built on Next.js 15 + TypeScript strict.

## Where everything actually lives

| Surface | What | Status |
|---|---|---|
| Git repo | `coreintentdev/coreintent` | Active; this file is in `docs/` |
| Working branch | `claude/fix-vds-token-tvSRH` | Open, CI passing, ready for PR |
| VDS (Contabo) | `vmi3205024` (Tailscale) — canonical master | Reachable; Kelvin legal pack verified 12/12 SHA256 OK |
| VDS legacy | `5.189.143.170` — 92% disk, commander unit not running | **Migrate off + close** |
| Drive | `corey.mcivor@gmail.com` — 40+ top-level folders | Single point of failure, mirror script ready |
| Linear | workspace `coreintentai`, team Coreintentai | **Currently PUBLIC — lock to Private** |
| GitHub mirror | `coreintentdev/ZYNTHIO_MASTER_DOCS` | **Currently PUBLIC — make Private** |
| Cloudflare | account `a61bf8a23a8488f6e4257e7127c70b76` | 27 zones live, 4 Workers, 48 Pages projects pending |
| Gmail draft for Kelvin | id `r-4263747605642888706` | Ready to send, awaits Drive share link |

## What this session shipped (commits on `claude/fix-vds-token-tvSRH`)

1. `.github/workflows/deploy-vds.yml` — push triggers SSH deploy to vmi3205024
2. `.github/workflows/deploy-cf-pages.yml` — workflow_dispatch creates 48 Pages projects
3. `scripts/mirror-drive-to-vds.sh` — one-shot rclone Drive → VDS mirror
4. `docs/DOMAINS_48.md` — pinned 48-domain roster (was only in Drive)
5. `docs/SECURITY_HARDENING_CHECKLIST.md` — operator checklist, location privacy rule
6. `docs/HANDOVER_TO_NEXT_2026-05-13.md` — this file
7. Incidents added: INC-009 (VDS provider truth), INC-010 (public exposure + Igor), INC-011 (48 sites + Drive SPOF), INC-012 (AI location inference), INC-013 (5-month no-deploy summary)
8. Provider correction: Cloudzy → Contabo (vmi-prefix is Contabo)
9. VDS IP defaults fixed: `100.122.99.34` (unreachable) → `vmi3205024` (Tailscale)
10. Operator-location strings stripped from AI-context files (kept in marketing copy — operator's call)

## The 3 secrets that unblock 5 months of deploys

Add to GitHub repo Settings → Secrets and variables → Actions:

| Secret name | Value source |
|---|---|
| `VDS_SSH_KEY` | `cat ~/.ssh/zynthio_dc` on operator Mac |
| `CLOUDFLARE_API_TOKEN` | New token, https://dash.cloudflare.com/profile/api-tokens, scope: Account:Read + Pages:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | `a61bf8a23a8488f6e4257e7127c70b76` |

Then GitHub Actions → "Deploy Cloudflare Pages Skeletons" → Run workflow.
Same for "Deploy VDS". Done.

## Top-of-queue operator actions (no agent can do these)

| # | Action | Why |
|---|---|---|
| 1 | Apple email → "It wasn't me" on recovery request | Account takeover prevention (Old Bridge NJ recovery attempt 2026-05-12) |
| 2 | Apple ID password rotation + Recovery Key + 2FA hardware key | Same threat model |
| 3 | Linear Settings → Workspace → Private | Stops scrapers like Igor finding hallucination tickets |
| 4 | GitHub `coreintentdev/ZYNTHIO_MASTER_DOCS` → Settings → Make Private | Same |
| 5 | Update payment card on Stripe / Atlassian / Notion (3 declined 2026-05-12) | Subscriptions lapsing |
| 6 | Rotate Cloudflare API tokens (COR-185 — 2 tokens + account ID leaked to chat) | Active credential leak |
| 7 | Paste 3 GitHub secrets above + run both workflows | Closes 5 months of no-deploy |
| 8 | Run `scripts/mirror-drive-to-vds.sh` on Mac | Removes Drive single-point-of-failure |

## What is broken and why (so the next person doesn't re-litigate)

| Thing | Cause | Fix path |
|---|---|---|
| 48 sites not live | `deploy-cf-skeletons.sh` works but was never run with both env vars set | GHA workflow ready, 3 secrets away |
| VDS scripts not deployed | INC-003: same root cause, ran from Claude sandbox that has no SSH | GHA workflow ready, 1 secret away |
| Drive→VDS mirror | rclone `gdrive:` remote was a CloudStorage mount, not API | Script flags this; operator picks API remote (gdrive-zyn or similar) |
| Linear publicly visible | Workspace setting + GitHub sync to public repo | Operator UI clicks only |
| Public hallucination tickets indexed (Igor pitch) | Linear→GitHub sync mirrors to public repo | Same |
| Operator location leaked to AI sessions | CLAUDE.md said "Based in: NZ"; sessions read it as fact | Redacted this session |

## What this session did NOT do

- SSH to any VDS (sandbox has no SSH egress)
- Click any operator-side UI (Linear privacy, GitHub repo visibility, Apple recovery deny)
- Send anything to Slack
- Send the Kelvin email (draft ready)
- Rotate any leaked credential
- Geo-locate any IP independently (relied on Dropbox / Apple email metadata)
- Confirm Cloudzy → Contabo migration is complete (operator's records)

## Recommendation per operator's own decision

1. **Stop using Claude as project-manager.** Use it for scoped coding tasks where the context fits one session.
2. **Source of truth = Git repo + Linear.** Not AI memory.
3. **Deploys = CI, not chat.** The GHA workflows in this commit are the durable form.
4. **Pay a human translator** for any Spanish legal text. AI translation has hallucination risk that does not belong on a defamation file.
5. **Lock surfaces first**, then resume building. Privacy fix is cheaper than the next Igor.

## Contact

Project owner: Corey McIvor (`@coreintentdev` / `@coreintentai`).
Contact: `corey@coreyai.ai` only.
Jurisdiction rule: never register anything in Australia. All other jurisdiction decisions are operator-only.
Physical location: redacted from AI-context files per INC-012.
