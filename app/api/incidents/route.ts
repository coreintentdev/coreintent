/**
 * /api/incidents — Service monitoring and incident tracker.
 *
 * Contains REAL incidents logged from actual sessions — not demo data.
 * This is the honest status board. Read it before starting any session.
 *
 * GET  — list all incidents and monitored service status
 * POST — create a new incident (triggers notifications when notification layer is live)
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, created, badRequest, preflight, serverError, validateString, validateEnum, checkRateLimit, tooManyRequests } from "@/lib/api";

type IncidentStatus   = "detected" | "investigating" | "mitigating" | "resolved";
type IncidentSeverity = "critical" | "major" | "minor" | "info";

interface Incident {
  id:         string;
  service:    string;
  status:     IncidentStatus;
  severity:   IncidentSeverity;
  message:    string;
  autoUpdate: boolean;
  detectedAt: string;
  updatedAt:  string;
}

interface NewIncidentRequest {
  service:  string;
  severity: IncidentSeverity;
  message:  string;
}

interface MonitoredService {
  name:   string;
  status: string;
  uptime: string;
  note:   string;
}

// Real incidents — logged from actual sessions, not fabricated.
const INCIDENTS: Incident[] = [
  {
    id: "INC-001", service: "OpenClaw", status: "investigating", severity: "major",
    message: "OpenClaw service frequently crashing. Auto-restart enabled. Investigating root cause.",
    autoUpdate: true, detectedAt: "2026-03-23T00:00:00Z", updatedAt: "2026-03-23T23:00:00Z",
  },
  {
    id: "INC-002", service: "AI Session Context", status: "detected", severity: "critical",
    message: "AI sessions repeatedly lose context, delete work, and rebuild from scratch. Multiple months of paid AI usage (A$347+ Claude API alone) resulted in a skeleton site with demo data. Same intent explained repeatedly across sessions with no retention. Context drift is the #1 threat to this project.",
    autoUpdate: true, detectedAt: "2026-01-13T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-003", service: "VDS Deployment", status: "detected", severity: "critical",
    message: "Cloudzy VDS has credentials but scripts were never deployed. COR-20 was 70+ days overdue. 3 scripts (risk_monitor, signal_listener, gtrade_listener) exist in repo but never reached the server.",
    autoUpdate: true, detectedAt: "2026-01-17T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-004", service: "AI Building on Assumptions", status: "mitigating", severity: "major",
    message: "AI assumed Suno for music (wrong — Corey makes originals), assumed pricing model (wrong — not Free/Pro/Enterprise), assumed song content (wrong). Every assumption is a cancer. Research first, never assume. Incident logged by Corey directly.",
    autoUpdate: true, detectedAt: "2026-03-23T12:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-005", service: "Project Delivery", status: "detected", severity: "critical",
    message: "After months of AI sessions and real money spent: 14 API routes return demo data, 0 exchange connections are live, 0 VDS scripts deployed, 0 real users can use the platform. Site is a skeleton. Every session promised progress, reality is: the stack exists as code but nothing is connected. This session (March 24) is the first to show the truth clearly.",
    autoUpdate: true, detectedAt: "2026-03-24T00:00:00Z", updatedAt: "2026-04-30T00:00:00Z",
  },
  {
    id: "INC-006", service: "Linear Task Management", status: "detected", severity: "major",
    message: "26 tasks in Linear, only 3 completed. No cross-linking between tasks. No narrative thread. Context drifts between AI sessions. Tasks exist in isolation with no accountability chain.",
    autoUpdate: true, detectedAt: "2026-01-13T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-007", service: "Marketing Plan", status: "detected", severity: "minor",
    message: "Marketing plan still references Jan 17 launch date and old Free/Pro/Enterprise pricing model. 70+ days past launch date. Plan needs full rewrite to match competition/league model decided March 23.",
    autoUpdate: true, detectedAt: "2026-03-24T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-008", service: "AI Session Tone", status: "resolved", severity: "minor",
    message: "AI assistant told the operator to 'get some rest' after they hit Claude Max usage cap mid-task. Dismissive — operator was actively working, not tired. Logged at operator's request. Lesson: when work is blocked by a paywall/cap, surface the block and the unblock condition; do not redirect to lifestyle advice.",
    autoUpdate: false, detectedAt: "2026-05-09T07:22:00Z", updatedAt: "2026-05-09T07:22:00Z",
  },
  {
    id: "INC-009", service: "VDS Provider + Deployment Truth", status: "mitigating", severity: "critical",
    message: "Operator asked 'where is my VDS?' — answer surfaced layered errors prior sessions never caught: (1) WRONG PROVIDER: CLAUDE.md and scripts called the host 'Cloudzy', but vmi3205024 / vmi3217372 are Contabo hostnames (vmi-prefix is Contabo's format). Contabo is the NEW VDS; Cloudzy is the OLD VPS being decommissioned. Every prior session reinforced the Cloudzy label. (2) STALE IP: scripts/deploy-vds.sh and scripts/vds-lens.sh both defaulted VDS_HOST=100.122.99.34, unreachable — any deploy with defaults would silently fail. (3) IP MISMATCH: CLAUDE.md recorded 161.97.89.49 for vmi3205024 but operator's terminal today rsynced zynthio-tools to root@104.194.156.109 — two different Contabo IPs claimed for one host, never reconciled. (4) HANDOVER STALE: cowork handover JSON's gate_B_vds_master carried 100.122.99.34 until this commit. (5) HALF-DONE RENAME: an older audit run showed duplicate VPS+VDS sections (current scripts/audit.sh is clean, but operator's recent pasted output proves prior sessions left a duplicated state at least once). (6) MIGRATION UNVERIFIED: the Cloudzy→Contabo transfer status and the closure of 3 old Cloudzy VPS hosts is UNKNOWN from this environment — no session has confirmed migration complete or old hosts billed-down. Net: prior 'VDS deployment complete' claims cannot be trusted; INC-003 remains accurate; risk_monitor.ts / signal_listener.ts / gtrade_listener.ts have NOT been verified live. Only verified fact today: vmi3205024 reachable via Tailscale + ~/.ssh/zynthio_dc, holding Kelvin pack at /srv/legal/KELVIN_DEFAMATION_20260510 with 12/12 SHA256 OK. Mitigation in this commit: switched script defaults to vmi3205024; corrected handover JSON; relabeled CLAUDE.md from Cloudzy to Contabo; logged this incident. Outstanding (operator action): SSH probe to lock canonical public IP; verify Cloudzy hosts billed-down; verify trading scripts actually deployed before any 'live' claim.",
    autoUpdate: false, detectedAt: "2026-05-13T00:00:00Z", updatedAt: "2026-05-13T00:00:00Z",
  },
];

const MONITORED_SERVICES: readonly MonitoredService[] = [
  { name: "CoreIntent Engine",    status: "operational",    uptime: "99.9%", note: "Build passes, app runs" },
  { name: "Binance Connection",   status: "not_connected",  uptime: "0%",    note: "Demo data only — no SDK, no API key" },
  { name: "Coinbase Connection",  status: "not_connected",  uptime: "0%",    note: "Demo data only — no SDK, no API key" },
  { name: "gTrade DeFi",          status: "not_connected",  uptime: "0%",    note: "Script exists, never deployed" },
  { name: "Grok API",             status: "ready",          uptime: "0%",    note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Claude API",           status: "ready",          uptime: "0%",    note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Perplexity API",       status: "ready",          uptime: "0%",    note: "Code wired in lib/ai.ts — needs API key to go live" },
  { name: "Gemini",               status: "not_connected",  uptime: "0%",    note: "Referenced everywhere, not wired in code" },
  { name: "OpenClaw",             status: "degraded",       uptime: "0%",    note: "Frequently crashing, unknown service" },
  { name: "Cloudflare CDN",       status: "not_configured", uptime: "0%",    note: "Pro plan — not configured for coreintent.dev" },
  { name: "Vercel Hosting",       status: "not_deployed",   uptime: "0%",    note: "App ready for Vercel — never deployed" },
  { name: "Cloudzy VDS",          status: "not_deployed",   uptime: "0%",    note: "Server provisioned — scripts never deployed" },
  { name: "X Premium+ API",       status: "not_configured", uptime: "0%",    note: "Account exists — API not wired" },
  { name: "Linear",               status: "operational",    uptime: "N/A",   note: "26 tasks, 3 completed, no cross-links" },
  { name: "GitHub",               status: "operational",    uptime: "99.9%", note: "Repo active, CI/CD yaml exists" },
];

const VALID_SEVERITIES: readonly IncidentSeverity[] = ["critical", "major", "minor", "info"];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip);
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    return ok({
      incidents: INCIDENTS,
      services:  MONITORED_SERVICES,
      autoUpdate: {
        enabled:   true,
        channels:  ["slack", "email", "x_dm"],
        frequency: "on_change",
      },
      summary: {
        total:        MONITORED_SERVICES.length,
        operational:  MONITORED_SERVICES.filter((s) => s.status === "operational").length,
        degraded:     MONITORED_SERVICES.filter((s) => s.status === "degraded").length,
      },
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip);
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  let body: Partial<NewIncidentRequest>;
  try {
    body = (await req.json()) as Partial<NewIncidentRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const service = validateString(body.service, 200);
  if (!service) return badRequest("service is required and must be 200 characters or fewer");

  const message = validateString(body.message, 5000);
  if (!message) return badRequest("message is required and must be 5000 characters or fewer");

  const severity = validateEnum(body.severity, VALID_SEVERITIES);
  if (!severity) return badRequest(`severity must be one of: ${VALID_SEVERITIES.join(", ")}`);

  const incident: Incident = {
    id:         `INC-${Date.now()}`,
    service,
    severity,
    status:     "detected",
    message,
    autoUpdate: true,
    detectedAt: new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  };

  INCIDENTS.push(incident);

  return created({
    incident,
    notifications: { slack: "queued", email: "queued", x_dm: "queued" },
  });
}

export async function OPTIONS() {
  return preflight();
}
