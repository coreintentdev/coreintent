import { NextRequest } from "next/server";
import { ok, err, preflight, badRequest, validateString, checkRateLimit, tooManyRequests } from "@/lib/api";

/**
 * /api/context — ZynContext: Assumption Blocker + BS Filter + Context Sync
 *
 * Every AI session should call this first to load active filters,
 * ground truth, and rules. This IS the amnesia shield as an API.
 *
 * GET  → Returns ZynContext (filters, public identity, rules, stack truth)
 * POST → Validates a statement against ground truth (BS filter)
 *
 * Family/personal data is NOT served here — it stays in CLAUDE.md
 * and VDS state files, never in a public API response.
 */

const ZYNCONTEXT = {
  version: "1.0.0",
  filters: {
    emotionBlocker: {
      active: true,
      incident: "INC-008",
      rules: [
        "Corey is happy. Do not assume frustration from direct language.",
        "NZ/AU slang is friendly. Read tone from content, not words.",
        "If unsure about mood, assume positive.",
        "Never add emotional assessments to responses.",
        "INC-008: AI projected frustration onto Corey (April 13, 2026). Don't repeat this.",
      ],
    },
    assumptionBlocker: {
      active: true,
      rules: [
        "If you don't know → research or ask. Never fabricate.",
        "CLAUDE.md and AGENTS.md are ground truth for this repo.",
        "VPS state files on server are ground truth for live state.",
        "Never say 'connected' or 'active' unless code proves it.",
        "Demo data = demo data. Label it honestly.",
      ],
    },
    bsFilter: {
      active: true,
      rules: [
        "'I can't' is not a solution. Find the path.",
        "If sandbox blocks you, say what to run locally with cai CLI.",
        "If API missing, build it. If data missing, rip it.",
        "Don't park problems. Solve or escalate with clear next action.",
        "No fake green dots. No inflated status claims.",
      ],
    },
    contextSync: {
      active: true,
      sources: {
        repo: "github.com/coreintentdev/coreintent — scripts + manifests only, not vault data",
        vds: "Contabo VDS S — primary, Tailscale SSH",
        local: "~/Desktop/ZYNTHIO_MASTER/ + ~/Desktop/zynthio-tools/ (110-API CLI)",
        desktopCli: "~/Desktop/zynthio-tools/bin/cai — takes priority over repo scripts/cai-cloud",
        stateFiles: [
          "/root/zynthio/SESSION_STATE.md",
          "/root/zynthio/MASTER_HANDOVER.md",
          "/root/zynthio/COREY_WORDS.md",
          "/root/zynthio/CONTENT_INTEL.md",
          "/root/zynthio/MASTER_INDEX.md",
        ],
        dataFlow: "Mac (ZYNTHIO_MASTER) → sync chosen payloads → VDS /root/zynthio/",
      },
    },
  },
  identity: {
    owner: "Corey McIvor",
    handles: ["@coreintentdev", "@coreintentai"],
    location: "New Zealand",
    neverAustralia: true,
    brand: "Zynthio.ai",
    engine: "CoreIntent",
    signal: 336,
  },
  stack: {
    truthCheck: {
      apiRoutes: { count: 14, note: "Exchange/market routes return demo data; AI routes fall back to demo without keys" },
      exchanges: { binance: "planned", coinbase: "planned", gtrade: "planned", note: "NONE connected" },
      ai: {
        claude: "code-ready, falls back to demo without key",
        grok: "code-ready, falls back to demo without key",
        perplexity: "code-ready, falls back to demo without key",
        suno: "code-ready, paid API wired in lib/ai.ts, needs SUNO_API_KEY",
      },
      infrastructure: {
        protonMail: "operational — all email accounts imported",
        googleDrive: "operational — via Claude/Perplexity desktop app auth, not SDK in this repo",
      },
      database: "none — no persistence layer exists",
      auth: "none — no user authentication exists",
      vpsScripts: "written, never deployed (COR-20 overdue)",
    },
  },
  tools: {
    cai: "~/Desktop/zynthio-tools/bin/cai — 110 APIs, desktop commander (priority CLI)",
    caiCloud: "scripts/cai-cloud — lightweight cloud fallback (conflicts with desktop cai)",
    zynrip: "scripts/zynrip-organize.sh — ZYN_RIP_SRC → organized + manifest",
    vpsLens: "scripts/vps-lens.sh — ZYN_SOURCES → rsync mirror per host",
    deployVds: "scripts/deploy-vds.sh — deploys app to VDS",
    migrateToVds: "scripts/migrate-to-vds.sh — mirrors all VPS to local before teardown",
  },
  pricing: {
    model: "Competitions, not subscriptions",
    philosophy: "Free costs fuck all to serve — so give it away",
    tiers: "Daily / Weekly / Monthly competition layers",
  },
  rules: [
    "READ before you write. Search the codebase before assuming.",
    "Build passes clean or you don't push.",
    "Run ./scripts/audit.sh after changes.",
    "NZ-first for all legal/business — NEVER Australia.",
    "Label demo data honestly — no fake green dots.",
    "Bots welcome — AI-to-AI is first-class.",
    "336 is the signal — always.",
  ],
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "default");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);

  return ok({
    ...ZYNCONTEXT,
    timestamp: new Date().toISOString(),
    note: "Feed this to any AI session as the first context load. This is the amnesia shield.",
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "default");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const statement = validateString(body.statement, 2000);
  if (!statement) {
    return badRequest("statement is required and must be 2000 characters or fewer");
  }

  const violations: string[] = [];
  const lower = statement.toLowerCase();

  if (/\bconnected\b/.test(lower) && !/\bnot connected\b/.test(lower) && !lower.includes("planned")) {
    violations.push("ASSUMPTION: Claims something is 'connected'. Verify in code before stating.");
  }
  if (/\bactive\b/.test(lower) && !/\bnot active\b/.test(lower) && !/\binactive\b/.test(lower)) {
    violations.push("ASSUMPTION: Claims something is 'active'. Check actual service status.");
  }
  if (lower.includes("australia") && lower.includes("register")) {
    violations.push("RULE VIOLATION: Never register anything in Australia. NZ-first.");
  }
  if (lower.includes("hannah") && (lower.includes("daughter") || lower.includes("child"))) {
    violations.push("FAMILY VIOLATION: Hannah is NOT Corey's child. Never list as daughter.");
  }
  if (lower.includes("subscription") && !lower.includes("not subscription")) {
    violations.push("PRICING: Model is competitions, not subscriptions.");
  }
  if (/\bgmail\b/.test(lower)) {
    violations.push("OUTDATED: Gmail replaced by Proton Mail. All accounts imported.");
  }
  if (lower.includes("exchange") && /\blive\b/.test(lower)) {
    violations.push("BS FILTER: No exchanges are live. All are planned.");
  }

  return ok({
    statement,
    violations,
    passed: violations.length === 0,
    verdict: violations.length === 0
      ? "Statement passes ZynContext filters."
      : `${violations.length} violation(s) detected. Review before stating.`,
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return preflight();
}
