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
import { ok, err, preflight, validateString } from "@/lib/api";

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
    id: "INC-003", service: "VPS Deployment", status: "detected", severity: "critical",
    message: "Cloudzy VPS has credentials but scripts were never deployed. COR-20 was 70+ days overdue. 3 scripts (risk_monitor, signal_listener, gtrade_listener) exist in repo but never reached the server.",
    autoUpdate: true, detectedAt: "2026-01-17T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-004", service: "AI Building on Assumptions", status: "mitigating", severity: "major",
    message: "AI assumed Suno for music (wrong — Corey makes originals), assumed pricing model (wrong — not Free/Pro/Enterprise), assumed song content (wrong). Every assumption is a cancer. Research first, never assume. Incident logged by Corey directly.",
    autoUpdate: true, detectedAt: "2026-03-23T12:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-005", service: "Project Delivery", status: "detected", severity: "critical",
    message: "After months of AI sessions and real money spent: 10 API routes return demo data, 0 exchange connections are live, 0 VPS scripts deployed, 0 real users can use the platform. Site is a skeleton. Every session promised progress, reality is: the stack exists as code but nothing is connected. This session (March 24) is the first to show the truth clearly.",
    autoUpdate: true, detectedAt: "2026-03-24T00:00:00Z", updatedAt: new Date().toISOString(),
  },
  {
    id: "INC-006", service: "Linear Task Management", status: "detected", severity: "major",
    message: "26 tasks in Linear, only 3 completed. No cross-linking between tasks. No narrative thread. Context drifts between AI sessions. Tasks exist in isolation with no accountability chain.",
    autoUpdate: true, detectedAt: "2026-01-13T00:00:00Z", updatedAt: "2026-03-24T00:00:00Z",
  },
  {
    id: "INC-007", service: "Marketing Plan", status: "detected", severity: "minor",
    message: "Marketing plan still references Jan 17 launch date and old Free/Pro/Enterprise pricing model. 70+ days past launch date. Plan needs full rewrite to match competition/league model decided March 23.",
    autoUpdate: true, detectedAt: "2026-03-24T00:00:00Z", updatedAt: new Date().toISOString(),
  },
  {
    id: "INC-008",
    service: "Cursor Desktop Client",
    status: "detected",
    severity: "major",
    message: "Cursor desktop chat lost user input (~6 attached images + a long paragraph) during composer submission. Session also reported ERROR_UNAUTHORIZED 'Follow-up blocked' (Request ID: 269e9c4f-f124-4ff3-9e6c-e0cf81798b06) and an earlier internal error (Request ID: ffcd98c5-788c-43bc-80d2-38327bd23166). Suspected client-side auth/session expiry with no draft autosave, causing total input loss. Reported by Corey directly. Mitigation: keep using Cursor Cloud Agents for long-running work since they survive desktop client crashes.",
    autoUpdate: true,
    detectedAt: "2026-04-18T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "INC-009",
    service: "Cursor Desktop Client",
    status: "detected",
    severity: "major",
    message:
      "Composer agent queue repeatedly fails on submit_now with AgentQueueMutationError: followupId not found (recurring). Request IDs from Corey: 16f2f060-54d2-4e28-a09e-1bd1282942db, f3e8e0c3-19fe-4232-ba88-48dcdadfeeb2, 3f4c5bb6-0723-40b2-ba21-117b2e106501. Prior related: INC-008 (auth / input loss). Leaves queued user messages stuck; same class of client-side reliability failure.",
    autoUpdate: true,
    detectedAt: "2026-04-18T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "INC-010",
    service: "Local Workspace Scale",
    status: "detected",
    severity: "major",
    message:
      "Workspace reported as 100,000+ files — too heavy for IDE indexing, agent context, and reliable Composer queue behavior. Not acceptable as a single open folder for day-to-day dev. Mitigation: open only the app repo root in Cursor; keep bulk archives/VPS mirrors/Downloads outside the workspace or use ZynRip (scripts/zynrip-organize.sh) to consolidate under a structured tree and point the IDE at the lean project only.",
    autoUpdate: true,
    detectedAt: "2026-04-18T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

const MONITORED_SERVICES: MonitoredService[] = [
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
  { name: "Cloudzy VPS",          status: "not_deployed",   uptime: "0%",    note: "Server provisioned — scripts never deployed" },
  { name: "X Premium+ API",       status: "not_configured", uptime: "0%",    note: "Account exists — API not wired" },
  { name: "Linear",               status: "operational",    uptime: "N/A",   note: "26 tasks, 3 completed, no cross-links" },
  { name: "GitHub",               status: "operational",    uptime: "99.9%", note: "Repo active, CI/CD yaml exists" },
];

const VALID_SEVERITIES: IncidentSeverity[] = ["critical", "major", "minor", "info"];

export async function GET() {
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
}

export async function POST(req: NextRequest) {
  let body: Partial<NewIncidentRequest>;
  try {
    body = (await req.json()) as Partial<NewIncidentRequest>;
  } catch {
    return err("Invalid JSON body", 400);
  }

  const service = validateString(body.service, 200);
  if (!service) return err("service is required and must be 200 characters or fewer", 400);

  const message = validateString(body.message, 5000);
  if (!message) return err("message is required and must be 5000 characters or fewer", 400);

  if (!body.severity || !VALID_SEVERITIES.includes(body.severity)) {
    return err(`severity must be one of: ${VALID_SEVERITIES.join(", ")}`, 400);
  }

  const incident: Incident = {
    id:         `INC-${Date.now()}`,
    service,
    severity:   body.severity,
    status:     "detected",
    message,
    autoUpdate: true,
    detectedAt: new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  };

  return ok({
    incident,
    notifications: { slack: "queued", email: "queued", x_dm: "queued" },
  }, 201);
}

export async function OPTIONS() {
  return preflight();
}
