import { NextRequest, NextResponse } from "next/server";

type Channel = "web" | "desktop";

interface SyncRequest {
  task?: string;
  source?: Channel;
  confidence?: number;
  contextComplete?: boolean;
  hints?: {
    needsLocalFiles?: boolean;
    needsProcessControl?: boolean;
    needsBrowserSession?: boolean;
    needsSystemAutomation?: boolean;
  };
}

const CAPABILITIES: Record<Channel, string[]> = {
  web: [
    "dashboard_interaction",
    "browser_session",
    "lightweight_commands",
    "shared_terminal_view",
  ],
  desktop: [
    "local_filesystem",
    "process_control",
    "automation_scripts",
    "high_context_workflows",
  ],
};

const DEFAULT_CONFIDENCE = 0.8;
const MIN_CONFIDENCE_FOR_AUTOROUTE = 0.7;

function classifyTarget(input: SyncRequest): Channel {
  const task = (input.task || "").toLowerCase();
  const hints = input.hints || {};

  if (
    hints.needsLocalFiles ||
    hints.needsProcessControl ||
    hints.needsSystemAutomation ||
    task.includes("file") ||
    task.includes("deploy") ||
    task.includes("script") ||
    task.includes("automation")
  ) {
    return "desktop";
  }

  if (
    hints.needsBrowserSession ||
    task.includes("dashboard") ||
    task.includes("ui") ||
    task.includes("browser")
  ) {
    return "web";
  }

  // Default route favors web for quick visibility unless task implies deeper ops.
  return "web";
}

function buildKycQuestions(input: SyncRequest): string[] {
  const task = input.task || "this task";
  return [
    `What is the exact outcome required for "${task}"?`,
    "Does this require local filesystem/process access, or browser-only interaction?",
    "Is there any compliance/identity gate required before execution?",
    "What is the acceptable risk level if assumptions are wrong?",
  ];
}

export async function GET() {
  return NextResponse.json({
    mode: "master_sync_policy",
    summary: "Single source of truth for web/desktop task routing.",
    rules: {
      handoffName: "zynhandball",
      uncertainFlow: "zynKYC",
      minConfidenceForAutoRoute: MIN_CONFIDENCE_FOR_AUTOROUTE,
      defaultRoute: "web",
    },
    channels: CAPABILITIES,
    examples: [
      {
        task: "check dashboard latency",
        decision: "web",
        action: "execute_in_place",
      },
      {
        task: "run deploy script and inspect local artifacts",
        decision: "desktop",
        action: "zynhandball",
      },
      {
        task: "ambiguous request with missing details",
        decision: "hold",
        action: "zynKYC",
      },
    ],
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SyncRequest;
  const source: Channel = body.source === "desktop" ? "desktop" : "web";
  const confidence = typeof body.confidence === "number" ? body.confidence : DEFAULT_CONFIDENCE;
  const contextComplete = body.contextComplete !== false;
  const target = classifyTarget(body);
  const needsKyc = confidence < MIN_CONFIDENCE_FOR_AUTOROUTE || !contextComplete;
  const handoffRequired = !needsKyc && source !== target;

  if (needsKyc) {
    return NextResponse.json({
      decision: "zynKYC",
      reason: "Confidence/context is insufficient for safe auto-routing.",
      confidence,
      contextComplete,
      source,
      task: body.task || "",
      questions: buildKycQuestions(body),
    });
  }

  return NextResponse.json({
    decision: handoffRequired ? "zynhandball" : "direct",
    reason: handoffRequired
      ? `Task is better executed on ${target}; initiating channel handoff.`
      : `Task matches ${target}; continue in current channel.`,
    source,
    target,
    task: body.task || "",
    confidence,
    contextComplete,
    handoff: handoffRequired
      ? {
          from: source,
          to: target,
          mode: "capability_based_routing",
          status: "ready",
        }
      : null,
  });
}
