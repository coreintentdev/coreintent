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

// Current known incidents (demo data)
const INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    service: "OpenClaw",
    status: "investigating",
    severity: "major",
    message: "OpenClaw service frequently crashing. Auto-restart enabled. Investigating root cause.",
    autoUpdate: true,
    detectedAt: "2026-03-23T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

const MONITORED_SERVICES = [
  { name: "CoreIntent Engine", status: "operational", uptime: "99.9%" },
  { name: "Binance Connection", status: "operational", uptime: "99.8%" },
  { name: "Coinbase Connection", status: "operational", uptime: "99.5%" },
  { name: "Grok API", status: "operational", uptime: "99.9%" },
  { name: "Claude API", status: "operational", uptime: "99.7%" },
  { name: "Perplexity API", status: "operational", uptime: "99.6%" },
  { name: "OpenClaw", status: "degraded", uptime: "87.2%" },
  { name: "Cloudflare CDN", status: "operational", uptime: "100%" },
  { name: "Vercel Hosting", status: "operational", uptime: "99.99%" },
  { name: "Cloudzy VPS", status: "operational", uptime: "99.5%" },
  { name: "X Premium+ API", status: "operational", uptime: "99.3%" },
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
