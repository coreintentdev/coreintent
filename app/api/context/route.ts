import { NextResponse } from "next/server";

/**
 * /api/context — ZynContext: Assumption Blocker + BS Filter + Context Sync
 *
 * Every AI session should call this first to load active filters,
 * ground truth, and rules. This IS the amnesia shield as an API.
 *
 * GET  → Returns full ZynContext (filters, identity, rules, stack truth)
 * POST → Validates a statement against ground truth (BS filter)
 */

const ZYNCONTEXT = {
  version: "1.0.0",
  filters: {
    emotionBlocker: {
      active: true,
      incident: "INC-008",
      rules: [
        "Corey is happy. Do not assume frustration from direct language.",
        "NZ/AU slang is friendly — 'fuck you cunt' = casual greeting.",
        "Read tone from content, not words. If unsure, assume positive.",
        "Never add emotional assessments to responses.",
        "Never say 'He's frustrated' or similar — you don't know his state.",
        "INC-008: Cursor Cloud agent projected frustration onto Corey (April 13, 2026). Don't repeat this.",
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
        vds: "100.121.107.112 (ZYN_VDS_HOST) — consolidation target, Tailscale SSH",
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
    contact: "corey@coreyai.ai",
    location: "New Zealand",
    neverAustralia: true,
    brand: "Zynthio.ai",
    engine: "CoreIntent",
    signal: 336,
    family: {
      wife: "Michelle",
      daughter: "Ruby (~14)",
      son: "Wesley",
      notDaughter: "Hannah — NOT Corey's child. Her mum took her own life. NEVER list as daughter.",
      dad: "Chas",
      mum: "Willy/Wilhelmina",
      brothers: ["Pete (The Pelican)", "Joel", "Peter"],
      bestFriend: "Ben Innes (Perth)",
    },
  },
  stack: {
    truthCheck: {
      apiRoutes: { count: 12, allDemo: true, note: "Return demo data until API keys configured" },
      exchanges: { binance: "planned", coinbase: "planned", gtrade: "planned", note: "NONE connected" },
      ai: {
        claude: "code-ready, falls back to demo without key",
        grok: "code-ready, falls back to demo without key",
        perplexity: "code-ready, falls back to demo without key",
        proton: "operational — all email accounts imported to Proton Mail/Drive",
      },
      database: "none — no persistence layer exists",
      auth: "none — no user authentication exists",
      vpsScripts: "written, never deployed (COR-20 overdue)",
      protonDrive: "operational — replaced Google Drive, all data migrated",
    },
  },
  tools: {
    cai: "~/Desktop/zynthio-tools/bin/cai — 110 APIs, desktop commander (priority CLI)",
    caiCloud: "scripts/cai-cloud — lightweight cloud fallback (conflicts with desktop cai)",
    zynrip: "scripts/zynrip-organize.sh — ZYN_RIP_SRC → organized + manifest",
    vpsLens: "scripts/vps-lens.sh — ZYN_SOURCES → rsync mirror per host",
    deployVds: "scripts/deploy-vds.sh — deploys app to VDS 100.121.107.112",
    vdsConsolidation: "scripts/vds-consolidation-deploy.sh (desktop) — ZYN_LOCAL_PAYLOAD → VDS",
    migrateToVds: "scripts/migrate-to-vds.sh — mirrors all VPS to local before teardown",
    g4Lens: "commander/G4-LENS-COMMANDER-v3.sh — defines cai as G4 alias (conflict: rename one)",
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

export async function GET() {
  return NextResponse.json({
    ...ZYNCONTEXT,
    timestamp: new Date().toISOString(),
    note: "Feed this to any AI session as the first context load. This is the amnesia shield.",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const statement = body.statement?.trim();

    if (!statement) {
      return NextResponse.json({ error: "statement is required" }, { status: 400 });
    }

    const violations: string[] = [];

    const lower = statement.toLowerCase();

    if (lower.includes("connected") && !lower.includes("not connected") && !lower.includes("planned")) {
      violations.push("ASSUMPTION: Claims something is 'connected'. Verify in code before stating.");
    }
    if (lower.includes("active") && !lower.includes("not active")) {
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
    if (lower.includes("google drive") || lower.includes("gmail") || lower.includes("gemini")) {
      violations.push("OUTDATED: Google/Gmail/Gemini replaced by Proton. All accounts imported to Proton Mail/Drive.");
    }
    if (lower.includes("exchange") && lower.includes("live")) {
      violations.push("BS FILTER: No exchanges are live. All are planned.");
    }
    if (lower.includes("database") && (lower.includes("connected") || lower.includes("active"))) {
      violations.push("BS FILTER: No database exists. All persistence is in-memory.");
    }

    return NextResponse.json({
      statement,
      violations,
      passed: violations.length === 0,
      verdict: violations.length === 0
        ? "Statement passes ZynContext filters."
        : `${violations.length} violation(s) detected. Review before stating.`,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
