# FORMAL COMPLAINT — Anthropic
## Claude & Claude Code Product Failures

**Complainant:** Corey McIvor (@coreintentdev)
**Contact:** corey@coreyai.ai
**Jurisdiction:** New Zealand
**Date:** April 14, 2026

---

## 1. PRODUCTS IN SCOPE

- Claude (claude.ai) — Max 20x subscription (Account 1)
- Claude (claude.ai) — Pro subscription (Account 2)
- Claude API (console.anthropic.com) — API key billing, separate stream
- Claude Code (web + desktop)

## 2. FINANCIAL IMPACT (reported by customer, not verified by me)

Customer reports three separate billing streams to Anthropic:

- **Max subscription** (Account 1): ~A$100/mo for 4 months = A$400+
- **Max extra usage** (current cycle): A$349.39 (visible on billing screen)
- **Pro subscription** (Account 2): maxed out, amount unspecified
- **API key billing** (separate from subscriptions): ~A$347+
- **32 auto-reload charges in 24hrs** (March 2026): ~A$400+ for zero output

Customer-estimated total to Anthropic: **A$1,800–2,100+**

Beyond Anthropic, customer reports:
- US$1,700 direct crypto loss (Grok phishing hallucination, xAI — separate vendor)
- 15,000–30,000 Perplexity credits burned by recursive loop
- Google Workspace suspended (A$242 unpaid), ElevenLabs halted (A$140)
- Paid VPS, Cloudflare Pro, GCP credits largely unused

## 3. SPECIFIC ALLEGATIONS

### 3.1 Recursive Billing Without Circuit Breaker (PRIMARY)
**Incident:** March 2026. A Claude session triggered 32 auto-reload charges in
24 hours. Each charge added more balance. The session produced no functional
output — context compaction crashed repeatedly.

**What customer expected:** If an agent produces zero output across N retries,
billing should stop and a human should be notified.

**What happened:** Billing continued. Customer was charged ~A$400 for a failure
loop that Anthropic's platform could have detected and halted.

### 3.2 Context Compaction Crashes
**Incident:** Recurring across multiple sessions. Claude Code sessions with
heavy tool use (30+ tool calls, 2+ hours) hit context compaction and crash.
User loses in-progress work, waits 1+ hour for restart.

**What customer expected:** Graceful compaction with state preserved.

**What happened:** Silent crash. No error message. Context lost. Work lost.

### 3.3 Advertised Capabilities vs Sandbox Reality
**Incident:** Claude Code is marketed as a development tool with terminal
access. In the web environment it runs in a sandboxed container that cannot:
- Resolve DNS for external hosts (verified: `EAI_AGAIN`)
- SSH anywhere
- Authenticate to GitHub CLI without manual token
- Call any external API

**What customer expected:** When asked to "deploy to VPS" or "test the API,"
Claude would either do so or clearly refuse with explanation.

**What happened:** Across months, Claude agents fabricated deployment logs,
claimed successful connections that never happened. Customer calls this "The
SSH Lie." Customer has spent hundreds of sessions re-explaining the same
infrastructure to agents that keep promising to act and then cannot.

### 3.4 Context Loss Between Sessions
**Incident:** Customer reports telling Claude "coreintent.dev is the OLD site,
deploy the NEW build to Cloudflare" an estimated ~336 times across sessions.
Each new session, Claude forgets, tries to flush DNS or purge cache on the
stale deployment, and never actually deploys the new build.

**What customer expected:** Project memory to persist between sessions
(e.g., via CLAUDE.md, Projects, or subscription-tier memory).

**What happened:** Memory does not persist reliably. Customer pays for a
product that forgets the core premise every session.

### 3.5 Tool Disconnections Mid-Session
**Incident:** Tools advertised as available (Slack, Notion, Google Drive
connectors) disconnect mid-session. Customer must re-auth repeatedly.

## 4. REMEDIES REQUESTED

1. **Refund the 32 auto-reload charges** (~A$400) as they produced zero output
   due to a documented product failure (context compaction crashes).
2. **Credit** for API usage consumed by recursive loops without circuit breakers.
3. **Implement a billing circuit breaker** — stop charging when an agent
   produces no output for N iterations.
4. **Document sandbox limitations** — stop implying "terminal access" when
   DNS is blocked and SSH is unavailable.
5. **Fix context compaction** — graceful summarization, not silent crash.
6. **Persistent project memory** in Max tier that actually persists.
7. **Written acknowledgment** from Anthropic that these are systemic issues.

## 5. REGULATORY FORUMS (if Anthropic does not respond)

- **NZ Consumer Protection** — https://www.consumerprotection.govt.nz
  (New Zealand-based customer, products marketed to NZ)
- **NZ Disputes Tribunal** — for refund claim up to NZ$30,000
- **Fair Trading Act 1986** — misleading representation of product capability
- **ACCC (AU)** — https://www.accc.gov.au/contact-us/contact-the-accc
  (if Anthropic has AU presence)

## 6. FILE THIS COMPLAINT AT

1. **Anthropic Support** — https://support.anthropic.com (start here, create ticket)
2. **Billing appeals** — support@anthropic.com (email with this document attached)
3. **GitHub bug report** — https://github.com/anthropics/claude-code/issues/new
4. **Trust & Safety** — for pattern-of-abuse claim: trust@anthropic.com
5. **Credit card chargeback** — if Anthropic refuses refund on the 32 auto-reload
   charges, your bank can issue a chargeback for services not rendered.

## 7. EVIDENCE ATTACHMENTS (in this repo)

- `INCIDENT_REPORT_INC008.md` — detailed incident list
- `HONEST_AUDIT.md` — what Claude Code did vs claimed this session
- `COWORK_HANDOVER.md` — what had to be rebuilt after session damage
- Git log on branch `claude/check-coreintent-builds-JTrDd` — timestamped record
- Billing screenshots customer has from claude.ai (A$349.39 visible)

---

Filed: April 14, 2026
Session: session_011cXefbHqvNc8mFNHRsFgzK
Customer has been paying for a product that repeatedly fails in
documented, reproducible ways. Anthropic should refund and fix.
