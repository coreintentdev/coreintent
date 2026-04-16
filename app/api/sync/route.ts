/**
 * /api/sync — Web/desktop task routing and capability synchronisation.
 *
 * Routes tasks to the right execution channel: web browser vs desktop Claude Code.
 * Uses confidence scoring and KYC questions for ambiguous or low-confidence requests.
 *
 * Routing vocabulary:
 *   zynhandball — task needs to move to a different channel
 *   zynKYC      — not enough context to route safely; return clarifying questions
 *   direct      — task stays in the current channel
 *
 * GET  — show routing policy and channel capabilities
 * POST — classify a task and return a routing decision
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.default in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, err, preflight } from "@/lib/api";

type Channel = "web" | "desktop";

interface SyncRequest {
  task?:            string;
  source?:          Channel;
  confidence?:      number;
  contextComplete?: boolean;
  hints?: {
    needsLocalFiles?:       boolean;
    needsProcessControl?:   boolean;
    needsBrowserSession?:   boolean;
    needsSystemAutomation?: boolean;
  };
}

interface KycDecision {
  decision:        "zynKYC";
  reason:          string;
  confidence:      number;
  contextComplete: boolean;
  source:          Channel;
  task:            string;
  questions:       string[];
}

interface RouteDecision {
  decision:        "zynhandball" | "direct";
  reason:          string;
  source:          Channel;
  target:          Channel;
  task:            string;
  confidence:      number;
  contextComplete: boolean;
  handoff:         { from: Channel; to: Channel; mode: string; status: string } | null;
}

const CAPABILITIES: Record<Channel, string[]> = {
  web:     ["dashboard_interaction", "browser_session", "lightweight_commands", "shared_terminal_view"],
  desktop: ["local_filesystem", "process_control", "automation_scripts", "high_context_workflows"],
};

const DEFAULT_CONFIDENCE         = 0.8;
const MIN_CONFIDENCE_FOR_AUTOROUTE = 0.7;

function classifyTarget(input: SyncRequest): Channel {
  const task  = (input.task ?? "").toLowerCase();
  const hints = input.hints ?? {};

  if (
    hints.needsLocalFiles || hints.needsProcessControl || hints.needsSystemAutomation ||
    task.includes("file") || task.includes("deploy") || task.includes("script") || task.includes("automation")
  ) return "desktop";

  if (
    hints.needsBrowserSession ||
    task.includes("dashboard") || task.includes("ui") || task.includes("browser")
  ) return "web";

  return "web"; // default: web for quick visibility
}

function buildKycQuestions(input: SyncRequest): string[] {
  const task = input.task ?? "this task";
  return [
    `What is the exact outcome required for "${task}"?`,
    "Does this require local filesystem/process access, or browser-only interaction?",
    "Is there any compliance/identity gate required before execution?",
    "What is the acceptable risk level if assumptions are wrong?",
  ];
}

export async function GET() {
  return ok({
    mode:    "master_sync_policy",
    summary: "Single source of truth for web/desktop task routing.",
    rules: {
      handoffName:               "zynhandball",
      uncertainFlow:             "zynKYC",
      minConfidenceForAutoRoute: MIN_CONFIDENCE_FOR_AUTOROUTE,
      defaultRoute:              "web",
    },
    channels: CAPABILITIES,
    examples: [
      { task: "check dashboard latency",                       decision: "web",     action: "execute_in_place" },
      { task: "run deploy script and inspect local artifacts", decision: "desktop", action: "zynhandball"      },
      { task: "ambiguous request with missing details",        decision: "hold",    action: "zynKYC"           },
    ],
  });
}

export async function POST(req: NextRequest) {
  let body: SyncRequest;
  try {
    body = (await req.json()) as SyncRequest;
  } catch {
    return err("Invalid JSON body", 400);
  }

  if (body.task !== undefined && (typeof body.task !== "string" || body.task.length > 500)) {
    return err("task must be a string of 500 characters or fewer", 400);
  }

  const source:          Channel = body.source === "desktop" ? "desktop" : "web";
  const rawConf                  = typeof body.confidence === "number" ? body.confidence : DEFAULT_CONFIDENCE;
  const confidence               = Math.min(1, Math.max(0, rawConf));
  const contextComplete          = body.contextComplete !== false;
  const target                   = classifyTarget(body);
  const needsKyc                 = confidence < MIN_CONFIDENCE_FOR_AUTOROUTE || !contextComplete;
  const handoffRequired          = !needsKyc && source !== target;

  if (needsKyc) {
    const data: KycDecision = {
      decision:        "zynKYC",
      reason:          "Confidence/context is insufficient for safe auto-routing.",
      confidence,
      contextComplete,
      source,
      task:            body.task ?? "",
      questions:       buildKycQuestions(body),
    };
    return ok(data);
  }

  const data: RouteDecision = {
    decision: handoffRequired ? "zynhandball" : "direct",
    reason:   handoffRequired
      ? `Task is better executed on ${target}; initiating channel handoff.`
      : `Task matches ${target}; continue in current channel.`,
    source,
    target,
    task:           body.task ?? "",
    confidence,
    contextComplete,
    handoff: handoffRequired
      ? { from: source, to: target, mode: "capability_based_routing", status: "ready" }
      : null,
  };
  return ok(data);
}

export async function OPTIONS() {
  return preflight();
}
