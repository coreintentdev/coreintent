# Security Hardening Checklist — Operator-Action Items

Source of truth for personal + project security tasks. Lives in the repo
so no future AI session has to "ask Corey" or hunt through chat. Update
via PR. Status column: `[ ]` open / `[x]` done / `[~]` in progress.

## 0. Location privacy (added 2026-05-13)

Where you physically are at any given moment is operationally sensitive
and **not for chat, public docs, or any commit message**. Earlier sessions
wrote an affirmative country declaration into CLAUDE.md and the handover
JSON. The current rule in CLAUDE.md is "never register in Australia" (a
single-country prohibition, no affirmative location). Don't restore an
affirmative country statement to any AI-context file. Marketing/product
copy in `app/*` (e.g. "Built in NZ" hero text) is an operator branding
decision — see INC-012 for the list, decide which to redact.

- [x] Redact explicit country from `CLAUDE.md` line 6
- [x] Redact explicit country from `docs/HANDOVER_COWORK_20260510.json`
- [ ] Audit Linear issues for free-text location ("in Perth", "from NZ", etc.) — open titles + descriptions
- [ ] Audit Drive shared files for location in headers/footers
- [ ] Audit Gmail signature blocks for location

## 1. Account takeover defense (do NOW)

| Service | Action | Status |
|---|---|---|
| Apple ID | Click "It wasn't me" on the recovery email | [ ] |
| Apple ID | Change password — unique, 20+ chars | [ ] |
| Apple ID | Sign-Out All Devices (Settings → Sign-In & Security → Devices) | [ ] |
| Apple ID | Generate Recovery Key (Settings → Sign-In & Security → Recovery Key) | [ ] |
| Apple ID | Turn on Advanced Data Protection if eligible | [ ] |
| Dropbox | Force sign-out all sessions, rotate password | [ ] |
| xAI | Rotate password + check API keys for unauthorized issuance | [ ] |
| Cloudflare | Rotate API tokens leaked per COR-185 (two tokens + account ID) | [ ] |
| Cloudflare | Force-revoke all API tokens, reissue with scoped permissions | [ ] |
| Gmail | Account → Security → review devices, sign out unknown | [ ] |
| Linear | Settings → Privacy → workspace **Private** | [ ] |
| GitHub | `coreintentdev/ZYNTHIO_MASTER_DOCS` → Settings → **Private** | [ ] |

## 2. Credential hygiene (this week)

- [ ] Run every account email through https://haveibeenpwned.com — note which breaches
- [ ] Install a password manager if not in use (1Password, Bitwarden) and migrate accounts
- [ ] Enable 2FA on EVERY service that supports it. Order of priority: Apple, Gmail, Cloudflare, GitHub, Dropbox, Linear, Notion, xAI, Anthropic
- [ ] Hardware key (YubiKey or equivalent) for Apple + Gmail at minimum
- [ ] Rotate any password that appears in a known breach
- [ ] Audit `~/.ssh/` for unused / old keys, revoke `authorized_keys` on every VDS for keys you no longer use
- [ ] Audit Cloudflare API tokens — delete any token you don't recognize

## 3. Public exposure surfaces (the Igor lesson)

Igor only found COR-110 / COR-130 because they were publicly mirrored. Plug it.

- [ ] Linear workspace → Private (operator-UI, agent cannot)
- [ ] Disable Linear → GitHub sync entirely, OR move sync target to a private repo
- [ ] `coreintentdev/ZYNTHIO_MASTER_DOCS` → Private (operator-UI, agent cannot)
- [ ] Audit other GitHub repos under `coreintentdev` for visibility
- [ ] Audit any `pages.dev` deploys for accidentally-published internal content
- [ ] Audit Google Drive shared-with-link files — revoke anything that doesn't need to be public
- [ ] Audit Notion shared pages

## 4. Public-info hygiene going forward

When filing new incidents or issues, never publish:

- Your physical location (city, country, when traveling)
- Specific server IPs (use hostnames or Tailscale names)
- API tokens, even partial — even "starts with sk-..."
- Credit card last-4 (combined with other info, it identifies the card)
- Family members' real names in public-visible titles
- Health, legal, or financial details — keep these in private docs only

Use redacted issue titles: not "Claude hallucinated my Anthropic API key on
prod VDS 5.189.143.170" — instead "Hallucinated secret on infra host". The
details stay in the issue body; the title is what scrapers and Igors index.

## 5. Backup & continuity

Drive is single point of failure. VDS doesn't yet hold a full mirror.

- [ ] Run `scripts/mirror-drive-to-vds.sh` once (operator on Mac)
- [ ] Schedule a weekly run via Mac launchd or VDS cron
- [ ] Add an offsite secondary mirror (Backblaze B2 or AWS S3) for legal evidence files only
- [ ] Verify the 12-file Kelvin pack `_SHA256_MASTER.sha256` re-validates monthly
- [ ] Document the recovery procedure if Drive account is locked or terminated

## 6. Legal counterparty hygiene

- [ ] Don works in Spanish. Only English files are authoritative until human translator signs off. State this in writing to Kelvin.
- [ ] WhatsApp evidence pack stays SHA256-locked on VDS; no edits.
- [ ] Testimonial / signed statement: not until matter escalates past cease-and-desist.
- [ ] Do not engage Igor or other vendor outreach via DM. Public response only, or no response.

## 7. Tripwires (agent-monitorable)

What an AI session CAN watch for you on a schedule:

- [ ] GitHub Action that alerts if a new public repo appears under `coreintentdev`
- [ ] Drive query (weekly) listing all files set to "Anyone with link"
- [ ] Gmail filter that auto-labels any "new sign-in" or "account recovery" notice for fast review
- [ ] Linear webhook → Slack alert when a comment from `author=null` (external) appears on any issue
- [ ] Cloudflare API: weekly diff of zones, DNS records, and Pages projects vs last week
- [ ] `haveibeenpwned` API: weekly check of your email addresses

(Each of these is a small GitHub Actions workflow or VDS cron + webhook.
Write tickets per row when you want them built.)

## 8. Known incidents linked to this checklist

- INC-009 — VDS provider + deployment truth
- INC-010 — Public workspace exposure + vendor outreach
- INC-011 — CF 48 sites + Drive single point of failure
- COR-185 — Cloudflare API tokens leaked to chat
- COR-186 — 7 Google API keys in audit corpus

## 9. Review cadence

- [ ] Weekly: review this file, mark progress
- [ ] Monthly: re-run https://haveibeenpwned.com on all email addresses
- [ ] Quarterly: rotate high-value API tokens (Cloudflare, Anthropic, xAI) regardless of incident
- [ ] On any "new sign-in" notice from an unfamiliar location: pause, do not click links in the email, log in via the service's own URL to verify
