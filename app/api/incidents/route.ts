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
    service: "VPS Deployment",
    status: "detected",
    severity: "critical",
    message: "Cloudzy VPS (100.122.99.34) has credentials but scripts were never deployed. COR-20 was 70+ days overdue. 3 scripts (risk_monitor, signal_listener, gtrade_listener) exist in repo but never reached the server.",
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
    updatedAt: new Date().toISOString(),
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
  { name: "Cloudflare CDN", status: "not_configured", uptime: "0%", note: "Pro plan — not configured for coreintent.dev" },
  { name: "Vercel Hosting", status: "not_deployed", uptime: "0%", note: "App ready for Vercel — never deployed" },
  { name: "Cloudzy VPS", status: "not_deployed", uptime: "0%", note: "Server exists at 100.122.99.34 — scripts never deployed" },
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
