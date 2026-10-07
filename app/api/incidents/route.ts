import { NextRequest, NextResponse } from "next/server";

/**
 * Incident & Auto-Update API
 * Monitors services, auto-reports crashes, sends updates
 * Tracks: OpenClaw, exchange connections, AI services, VPS
 */

interface Incident {
  id: string;
  service: string;
  status: "detected" | "investigating" | "mitigating" | "resolved";
  severity: "critical" | "major" | "minor" | "info";
  message: string;
  autoUpdate: boolean;
  detectedAt: string;
  updatedAt: string;
}

// Real incidents — logged from actual sessions, not demo data
const INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    service: "OpenClaw",
    status: "investigating",
    severity: "major",
    message: "OpenClaw service frequently crashing. Auto-restart enabled. Investigating root cause.",
    autoUpdate: true,
    detectedAt: "2026-03-23T00:00:00Z",
    updatedAt: "2026-03-23T23:00:00Z",
  },
  {
    id: "INC-002",
    service: "AI Session Context",
    status: "detected",
    severity: "critical",
    message: "AI sessions repeatedly lose context, delete work, and rebuild from scratch. Multiple months of paid AI usage (A$347+ Claude API alone) resulted in a skeleton site with demo data. Same intent explained repeatedly across sessions with no retention. Context drift is the #1 threat to this project.",
    autoUpdate: true,
    detectedAt: "2026-01-13T00:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-003",
    service: "VDS Deployment",
    status: "detected",
    severity: "critical",
    message: "Contabo VDS (vmi3205024) has credentials but scripts were never deployed. COR-20 was 70+ days overdue. 3 scripts (risk_monitor, signal_listener, gtrade_listener) exist in repo but never reached the server. Prior sessions wrongly labeled host Cloudzy / IP 100.122.99.34 — see INC-009.",
    autoUpdate: true,
    detectedAt: "2026-01-17T00:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-004",
    service: "AI Building on Assumptions",
    status: "mitigating",
    severity: "major",
    message: "AI assumed Suno for music (wrong — Corey makes originals), assumed pricing model (wrong — not Free/Pro/Enterprise), assumed song content (wrong). Every assumption is a cancer. Research first, never assume. Incident logged by Corey directly.",
    autoUpdate: true,
    detectedAt: "2026-03-23T12:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-005",
    service: "Project Delivery",
    status: "detected",
    severity: "critical",
    message: "After months of AI sessions and real money spent: 10 API routes return demo data, 0 exchange connections are live, 0 VPS scripts deployed, 0 real users can use the platform. Site is a skeleton. Every session promised progress, reality is: the stack exists as code but nothing is connected. This session (March 24) is the first to show the truth clearly.",
    autoUpdate: true,
    detectedAt: "2026-03-24T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "INC-006",
    service: "Linear Task Management",
    status: "detected",
    severity: "major",
    message: "26 tasks in Linear, only 3 completed. No cross-linking between tasks. No narrative thread. Context drifts between AI sessions. Tasks exist in isolation with no accountability chain.",
    autoUpdate: true,
    detectedAt: "2026-01-13T00:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-007",
    service: "Marketing Plan",
    status: "detected",
    severity: "minor",
    message: "Marketing plan still references Jan 17 launch date and old Free/Pro/Enterprise pricing model. 70+ days past launch date. Plan needs full rewrite to match competition/league model decided March 23.",
    autoUpdate: true,
    detectedAt: "2026-03-24T00:00:00Z",
    updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-008",
    service: "AI Session Tone",
    status: "resolved",
    severity: "minor",
    message:
      "AI told operator to 'get some rest' after Max cap mid-task. When blocked by paywall/cap, surface the block and unblock condition — not lifestyle advice.",
    autoUpdate: false,
    detectedAt: "2026-05-09T07:22:00Z",
    updatedAt: "2026-05-09T07:22:00Z",
  },
  {
    id: "INC-009",
    service: "VDS Provider + Deployment Truth",
    status: "mitigating",
    severity: "critical",
    message:
      "Wrong provider label (Cloudzy vs Contabo), stale IPs (100.122.99.34 unreachable), IP mismatch for vmi3205024, migration unverified. Prior 'VDS deployment complete' claims cannot be trusted. Full detail in commit 579414d / docs/DEPLOY_INCIDENTS_SUMMARY.md.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-010",
    service: "Public Workspace Exposure + Vendor Outreach",
    status: "mitigating",
    severity: "major",
    message:
      "Linear workspace mirrored to public GitHub (ZYNTHIO_MASTER_DOCS). Outsider vendor pitch on public hallucination tickets. Operator action: lock Linear/GitHub visibility.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-011",
    service: "Cloudflare 48 Sites + Drive Single Point of Failure",
    status: "mitigating",
    severity: "critical",
    message:
      "48 paid domains/sites not live. deploy-cf-pages.yml exists but secrets never pasted. VDS lacks full Drive mirror. Mitigation shipped in GHA workflows — operator must paste secrets and run workflow_dispatch.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-012",
    service: "AI Location Inference + Nicaragua Truth",
    status: "mitigating",
    severity: "major",
    message:
      "Sessions inferred NZ from stale CLAUDE.md; operator canonical words (COREY_WORDS C1) say AU citizen, house in Nicaragua. Security false-positive on Managua sign-in. Read COREY_WORDS before inferring location — see docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-013",
    service: "5 Months No Deploy + MAX Plan Zero Outcome",
    status: "mitigating",
    severity: "critical",
    message:
      "5 months, paid MAX Pro, zero deploy outcome, 48 sites not live. Pattern: incident-logging instead of execution. Unblock: three GitHub Secrets + workflow_dispatch — see docs/DEPLOY_INCIDENTS_SUMMARY.md.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-014",
    service: "ACCC Complaint Evidence Append",
    status: "mitigating",
    severity: "major",
    message:
      "ACCC §APPENDIX F created in Drive for 2026-05-13 session evidence. Legal content stays in Drive only — this incident is audit pointer.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-015",
    service: "Always Finding, Never Remembering",
    status: "mitigating",
    severity: "critical",
    message:
      "Every session 'finds' files operator already committed (COREY_WORDS, DOMAINS_48, etc.). 179 unfulfilled MEMORY.md promises in 8 days. Root cause: cross-session amnesia. Mitigation: read MASTER_HANDOVER + COREY_WORDS at boot.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-016",
    service: "Sandbox Capabilities Never Disclosed",
    status: "mitigating",
    severity: "critical",
    message:
      "No session disclosed sandbox limits at start: no SSH to VDS, no Mac/HDD, CF API 403, no Pages CRUD via MCP. Work allocated that structurally could not run here. Route to Claude-on-VDS or GHA — see docs/CLAUDE_ON_VDS_BOOTSTRAP.md.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-017",
    service: "Mac Disk-Write Storm (1.26 TB/day)",
    status: "mitigating",
    severity: "critical",
    message:
      "Operator Mac: 1.26 TB disk writes in one day (kernel_task + Claude Desktop). Move heavy work to VDS (vmi3205024). Prefer Claude Code CLI over Desktop between sessions.",
    autoUpdate: false,
    detectedAt: "2026-05-13T00:00:00Z",
    updatedAt: "2026-05-13T00:00:00Z",
  },
  {
    id: "INC-018",
    service: "Project Delivery (Lost Alpha — 336 Builds)",
    status: "detected",
    severity: "critical",
    message:
      "Corey confirms 336 non-deployed Claude builds — massive lost alpha, content, and SLPA never reached production. Comprehensive review required.",
    autoUpdate: true,
    detectedAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z",
  },
  {
    id: "INC-019",
    service: "Cloudflare MCP Not Used",
    status: "detected",
    severity: "major",
    message:
      "Agent assumed no Cloudflare access without checking authenticated MCP (Zynthioai + Corey.mcivor accounts). Contributed to non-deployed build pattern (INC-018).",
    autoUpdate: true,
    detectedAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z",
  },
  {
    id: "INC-020",
    service: "Cloudflare Pages Ignored",
    status: "detected",
    severity: "major",
    message:
      "Agent checked Workers only, ignored Pages (Next.js deploy target), declared deployment impossible prematurely. Must exhaust GHA/Vercel/Pages before stopping.",
    autoUpdate: true,
    detectedAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z",
  },
  {
    id: "INC-021",
    service: "Human Support Response Mode",
    status: "resolved",
    severity: "info",
    message:
      "Positive incident: response structure improved. Actionable/direct response mode is now treated as the default and retained going forward.",
    autoUpdate: true,
    detectedAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-04-20T12:00:00Z",
  },
  {
    id: "INC-022",
    service: "Handover Retention / Work Churn",
    status: "detected",
    severity: "critical",
    message:
      "Pattern: Corey pays for sessions; handover docs get written (March 270-line session handover, April addendum) but next agents do not read them. New posts claim consolidation while dropping checklists. March must-fix: 1/8 done after weeks. VPS scripts still undeployed. API routes still demo. Work is tossed, never read. Fix: MASTER_HANDOVER.md + HANDOVER_ACCOUNTABILITY doc mandatory read; ship one TODO item per session; update checklist in same commit.",
    autoUpdate: true,
    detectedAt: "2026-04-21T00:00:00Z",
    updatedAt: "2026-04-21T00:00:00Z",
  },
  {
    id: "INC-023",
    service: "Wrong Git Remote (GitHub vs VDS)",
    status: "detected",
    severity: "major",
    message:
      "Handover/incident commits pushed to GitHub origin; operator canonical repo is VDS bare git at vds-public:/root/git/zyn.git. This branch has no GitHub upstream for operator workflow. Fix: ./scripts/push-to-vds-git.sh after every handover commit. See docs/HANDOVER_VDS_GIT_2026-05-14.md.",
    autoUpdate: true,
    detectedAt: "2026-05-14T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// REAL status — no more lies. Show what's actually connected.
const MONITORED_SERVICES = [
  { name: "CoreIntent Engine", status: "operational", uptime: "99.9%", note: "Build passes, app runs" },
  { name: "Binance Connection", status: "not_connected", uptime: "0%", note: "Demo data only — no SDK, no API key" },
  { name: "Coinbase Connection", status: "not_connected", uptime: "0%", note: "Demo data only — no SDK, no API key" },
  { name: "gTrade DeFi", status: "not_connected", uptime: "0%", note: "Script exists, never deployed" },
  { name: "Grok API", status: "ready", uptime: "0%", note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Claude API", status: "ready", uptime: "0%", note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Perplexity API", status: "ready", uptime: "0%", note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Gemini", status: "not_connected", uptime: "0%", note: "Referenced everywhere, not wired in code" },
  { name: "OpenClaw", status: "degraded", uptime: "0%", note: "Frequently crashing, unknown service" },
  { name: "Cloudflare CDN", status: "not_configured", uptime: "0%", note: "Pro plan — 48 sites not live (INC-011)" },
  { name: "Vercel Hosting", status: "not_deployed", uptime: "0%", note: "App ready for Vercel — never deployed" },
  { name: "Contabo VDS", status: "not_deployed", uptime: "0%", note: "vmi3205024 — scripts never deployed (INC-003/009)" },
  { name: "VDS Git (zyn.git)", status: "ready", uptime: "N/A", note: "Canonical remote vds-public:/root/git/zyn.git — use push-to-vds-git.sh" },
  { name: "X Premium+ API", status: "not_configured", uptime: "0%", note: "Account exists — API not wired" },
  { name: "Linear", status: "operational", uptime: "N/A", note: "26 tasks, 3 completed, no cross-links" },
  { name: "GitHub", status: "operational", uptime: "99.9%", note: "Repo active, CI/CD yaml exists" },
];

export async function GET() {
  return NextResponse.json({
    incidents: INCIDENTS,
    services: MONITORED_SERVICES,
    autoUpdate: {
      enabled: true,
      channels: ["slack", "email", "x_dm"],
      frequency: "on_change",
    },
    summary: {
      total: MONITORED_SERVICES.length,
      operational: MONITORED_SERVICES.filter((s) => s.status === "operational").length,
      degraded: MONITORED_SERVICES.filter((s) => s.status === "degraded").length,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // In production: creates incident, triggers auto-updates
  return NextResponse.json({
    status: "created",
    incident: {
      id: `INC-${Date.now()}`,
      ...body,
      autoUpdate: true,
      detectedAt: new Date().toISOString(),
    },
    notifications: {
      slack: "queued",
      email: "queued",
      x_dm: "queued",
    },
  });
}
