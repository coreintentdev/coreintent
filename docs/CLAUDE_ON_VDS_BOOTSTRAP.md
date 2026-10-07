# Claude on VDS — Bootstrap (one-time, gets Claude out of Anthropic's sandbox)

This document exists because the Claude session that wrote it is sandboxed
(no SSH, no outbound to your APIs, no access to your Mac or VDS). The Claude
*model* runs in Anthropic infra either way — but the **execution environment
where Claude's tool calls happen** can be moved onto your VDS. When that
moves, "I can't reach api.cloudflare.com" disappears, "I can't read your
mail" disappears, "I can't SSH to your other hosts" disappears.

## Architecture after this bootstrap

```
┌────────────────────────────────────────────────────────────────┐
│  vmi3205024 (Contabo VDS) — operator's master host             │
│                                                                │
│  /root/zynthio/                                                │
│   ├── CLAUDE.md          ← operator's canonical (sync from git)│
│   ├── state/             ← Commander CLI / ZynRip TODOs        │
│   ├── inbox/             ← Proton Bridge IMAP poll dump        │
│   ├── songpal/suno/      ← ripped tracks per UID               │
│   ├── from_mac/          ← rsync from Mac                      │
│   └── coreintent/        ← this repo, git pulled               │
│                                                                │
│  $ claude   ← CLI runs HERE, tool calls execute on this box    │
│             (full filesystem, outbound, SSH, Commander)        │
└────────────────────────────────────────────────────────────────┘
```

Same Claude model. Different sandbox. **Yours, not Anthropic's container.**

## One-time setup (run on vmi3205024)

```bash
# 1. SSH to the master VDS
ssh -i ~/.ssh/zynthio_dc root@vmi3205024

# 2. Ensure Node 20+ (Claude Code requires it)
node --version || (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs)

# 3. Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# 4. Pull the repo into /root/zynthio/coreintent
cd /root/zynthio && git clone https://github.com/coreintentdev/coreintent.git || (cd coreintent && git pull)

# 5. Set the API key (your Anthropic key — not the same as the Max subscription)
echo 'export ANTHROPIC_API_KEY=sk-ant-xxx' >> /root/.bashrc && source /root/.bashrc

# 6. Start Claude in the repo directory
cd /root/zynthio/coreintent && claude
```

## What changes immediately

| From this sandbox | From Claude-on-VDS |
|---|---|
| `curl api.cloudflare.com → 403` | Works — runs Pages deploy directly |
| Can't SSH to other VDS hosts | `ssh vmi3217372` from inside Claude |
| Can't read Proton mail | Reads `/root/zynthio/inbox/` directly |
| Can't run Commander CLI | Runs `/root/zynthio/bin/commander …` |
| Can't `wrangler pages deploy` | Runs locally with operator's token in `.env` |
| Memory dies at session end | Pin to `/root/zynthio/state/` permanently |

## Ongoing rules (so Claude-on-VDS doesn't re-create the amnesia loop)

- The CLAUDE.md in this repo (`/root/zynthio/coreintent/CLAUDE.md`) IS the canonical agent context. `git pull` updates it.
- `docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md` is read at session start (see CLAUDE.md "VDS state files" line).
- Commander CLI / ZynRip are operator-owned tools. Claude calls them; Claude does not replace them.
- Source-of-truth ladder per CLAUDE.md "ONE Source of Truth" section: VDS → Proton → Drive (corey.mcivor@gmail.com).

## If Claude-on-VDS still won't do something

Then it's a model-policy limit, not a sandbox limit. File the incident in
`app/api/incidents/route.ts` and move on. The execution-sandbox excuse is
gone after this bootstrap.
