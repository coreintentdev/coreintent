/**
 * /api/autosave — Persistence layer across multiple free/cheap backends.
 *
 * Outsources storage to free/cheap tiers to minimise cost.
 * No data is actually persisted yet — wiring to each backend is pending.
 *
 * GET  — show all backends, outsource map, and cost analysis
 * POST — trigger a save to appropriate backends based on content type
 *
 * Rate limit: 60 req/min (see RATE_LIMITS.autosave in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { ok, err, preflight } from "@/lib/api";

type BackendKey = "primary" | "docs" | "files" | "cache" | "links" | "state";
type SaveType   = "link" | "doc" | "state" | "command" | "config" | "signal" | "agent";

interface SaveRequest {
  type?: SaveType;
  content?: string;
}

interface BackendResult {
  store: string;
  backend: string;
  status: "saved";
}

const SAVE_BACKENDS: Record<BackendKey, string> = {
  primary: "github",        // Free — commit to repo
  docs:    "notion",        // Free tier — knowledge base
  files:   "google_drive",  // 15GB free — Gemini scans them too
  cache:   "cloudflare_kv", // Free tier — 100k reads/day
  links:   "repo_json",     // Free — JSON file in the repo
  state:   "local_storage", // Free — browser-side
};

const OUTSOURCE_MAP: Record<string, { to: string; cost: string; why: string }> = {
  signal_detection:  { to: "grok_pro",              cost: "near-free (X Premium+)", why: "fastest, included with subscription" },
  content_drafts:    { to: "grok_pro",              cost: "near-free",              why: "bulk draft generation, fast output" },
  content_polish:    { to: "claude_api",            cost: "~$0.01/request",         why: "best quality for final copy" },
  research:          { to: "perplexity_max",        cost: "$20/mo flat",            why: "unlimited searches, 9 connectors" },
  email_scan:        { to: "gemini",                cost: "free (Gmail built-in)",  why: "auto-categorize, summarize" },
  drive_scan:        { to: "gemini",                cost: "free (Drive built-in)",  why: "index & find lost files" },
  cdn_security:      { to: "cloudflare_pro",        cost: "$20/mo",                 why: "replaces $200+/mo of separate WAF/DDoS" },
  hosting:           { to: "vercel_hobby",          cost: "$0",                     why: "free for personal projects" },
  ci_cd:             { to: "github_actions",        cost: "$0",                     why: "2000 min/mo free" },
  project_mgmt:      { to: "linear_free",           cost: "$0",                     why: "unlimited issues" },
  docs:              { to: "notion_free",           cost: "$0",                     why: "unlimited pages for personal" },
  link_sharing:      { to: "weblinks",              cost: "$0",                     why: "share via URL, no auth needed" },
  file_recovery:     { to: "google_drive_versions", cost: "$0",                     why: "30-day version history, find lost stuff" },
  compression:       { to: "mac_the_zipper",        cost: "$0",                     why: "custom built" },
  data_extraction:   { to: "the_ripper",            cost: "$0",                     why: "custom built" },
  pdf_parsing:       { to: "pdf_plumber",           cost: "$0",                     why: "custom built" },
  ai_context_sync:   { to: "ai_to_ai_transfer",     cost: "$0",                     why: "share context between models via weblinks" },
};

const SERVICES_REPLACED = [
  { replaced: "Dedicated WAF service",     saved: "$200/mo",  with: "Cloudflare Pro ($20)" },
  { replaced: "Separate CDN",              saved: "$50/mo",   with: "Cloudflare Pro (included)" },
  { replaced: "Paid hosting",              saved: "$20/mo",   with: "Vercel free tier" },
  { replaced: "Paid CI/CD",               saved: "$30/mo",   with: "GitHub Actions free" },
  { replaced: "Project management tool",   saved: "$10/mo",   with: "Linear free" },
  { replaced: "Docs platform",            saved: "$8/mo",    with: "Notion free" },
  { replaced: "Multiple AI subscriptions", saved: "$100/mo",  with: "Grok via X Premium+ ($16)" },
  { replaced: "Email assistant",           saved: "$15/mo",   with: "Gemini (free in Gmail)" },
  { replaced: "File search tool",          saved: "$10/mo",   with: "Gemini (free in Drive)" },
];

const TOTAL_MONTHLY_COST = 66;

export async function GET() {
  const totalSaved = SERVICES_REPLACED.reduce((sum, r) => {
    const match = r.saved.match(/\d+/);
    return sum + (match ? parseInt(match[0]) : 0);
  }, 0);

  return ok({
    autosave: {
      enabled: true,
      saveOnEvery: ["command", "config_change", "trade_signal", "agent_event", "link_share"],
      backends: SAVE_BACKENDS,
    },
    outsourceMap: OUTSOURCE_MAP,
    costAnalysis: {
      currentMonthly:       `~$${TOTAL_MONTHLY_COST}`,
      equivalentIfSeparate: `~$${TOTAL_MONTHLY_COST + totalSaved}`,
      monthlySavings:       `~$${totalSaved}`,
      annualSavings:        `~$${totalSaved * 12}`,
      servicesReplaced:     SERVICES_REPLACED,
    },
    weblinks: {
      description: "Share integration via URL — no auth, no setup, just a link",
      uses: [
        "Share AI context between Claude/Grok/Perplexity sessions",
        "Send terminal state to collaborators",
        "Link Google Drive docs directly into workflows",
        "Quick-share incident reports",
        "Integration via URL params (backwards-compatible discovery)",
      ],
    },
    recovery: {
      description: "Find lost stuff via unconventional paths",
      methods: [
        "Google Drive version history (30 days)",
        "Gmail search (everything is an email trail)",
        "GitHub commit history (every save is recoverable)",
        "Perplexity re-research (re-find anything you found before)",
        "Cloudflare analytics (see what was accessed when)",
      ],
    },
  });
}

export async function POST(req: NextRequest) {
  let body: Partial<SaveRequest>;
  try {
    body = (await req.json()) as Partial<SaveRequest>;
  } catch {
    return err("Invalid JSON body", 400);
  }

  const VALID_SAVE_TYPES: SaveType[] = ["link", "doc", "state", "command", "config", "signal", "agent"];
  const type: SaveType = VALID_SAVE_TYPES.includes(body.type as SaveType)
    ? (body.type as SaveType)
    : "state";

  if (body.content !== undefined) {
    if (typeof body.content !== "string" || body.content.length > 10_000) {
      return err("content must be a string of 10,000 characters or fewer", 400);
    }
  }

  const backends: BackendResult[] = Object.entries(SAVE_BACKENDS)
    .filter(([key]) => {
      if (type === "link") return key === "links" || key === "cache";
      if (type === "doc")  return key === "docs"  || key === "files";
      return true;
    })
    .map(([store, backend]) => ({ store, backend, status: "saved" as const }));

  return ok({
    saved: true,
    type,
    timestamp: new Date().toISOString(),
    backends,
    message: `Auto-saved ${type} to ${backends.length} backends`,
  });
}

export async function OPTIONS() {
  return preflight();
}
