/**
 * /api/protect — F18 Security Layer — Digital identity protection.
 *
 * Runs all 3 AIs in parallel to monitor and protect Corey's digital footprint.
 * In demo mode (no API keys), all scans return [DEMO] fallback responses.
 *
 * GET  — full protection scan: X/Twitter impersonation, web-wide brand monitoring, threat analysis
 * POST — check a specific entity, domain, or threat string
 *
 * Rate limit: 5 req/min — AI calls are expensive (see RATE_LIMITS.protect in lib/api.ts)
 */
import { NextRequest } from "next/server";
import { callAIsParallel, callPerplexity, callGrok, callClaudeDeep, validateAiContent, sanitizeForPrompt, GROK_SECURITY_SYSTEM, CLAUDE_RISK_SYSTEM, PERPLEXITY_SECURITY_SYSTEM, type AIResponse } from "@/lib/ai";
import { ok, badRequest, gatewayError, preflight, serverError, validateString, validateEnum, checkRateLimit, tooManyRequests } from "@/lib/api";

type ThreatCheckType = "impersonation" | "domain" | "threat" | "general";

interface ProtectRequest {
  check: string;
  type?: ThreatCheckType;
}

const PROTECTED_ASSETS = {
  names:       ["Corey McIvor", "CoreIntent", "Zynthio", "coreintentai", "coreintentdev"],
  domains:     ["coreintent.dev", "zynthio.ai"],
  socials:     ["@coreintentai", "@coreintentdev"],
  repos:       ["github.com/coreintentdev"],
  customTools: ["The Ripper", "Mac the Zipper", "PDF Plumber", "SongPal"],
} as const;

const VALID_TYPES: readonly ThreatCheckType[] = ["impersonation", "domain", "threat", "general"];

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "protect");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  try {
    const results = await callAIsParallel({
      grok:
        `Scan X/Twitter for accounts impersonating or copying: ${PROTECTED_ASSETS.socials.join(", ")}. ` +
        `Check for unauthorized use of these names: ${PROTECTED_ASSETS.names.join(", ")}. ` +
        `Report any suspicious accounts or copycat activity. Be specific.`,
      perplexity:
        `Search the web for unauthorized use of these brands and names: ${PROTECTED_ASSETS.names.join(", ")}. ` +
        `Check for typosquatting near: ${PROTECTED_ASSETS.domains.join(", ")}. ` +
        `Look for phishing attempts, brand impersonation, or cloned repos at: ${PROTECTED_ASSETS.repos.join(", ")}.`,
      claude:
        `Assess the digital identity protection status for:\n` +
        `Names: ${PROTECTED_ASSETS.names.join(", ")}\n` +
        `Domains: ${PROTECTED_ASSETS.domains.join(", ")}\n` +
        `Socials: ${PROTECTED_ASSETS.socials.join(", ")}\n` +
        `Custom IP: ${PROTECTED_ASSETS.customTools.join(", ")}\n\n` +
        `What are the top 3 risks? What needs immediate action to prevent impersonation or IP theft?`,
      systems: {
        grok:       GROK_SECURITY_SYSTEM,
        perplexity: PERPLEXITY_SECURITY_SYSTEM,
        claude:     CLAUDE_RISK_SYSTEM,
      },
      claudeModel: "claude-opus-4-7",
    });

    return ok({
      protectedAssets: PROTECTED_ASSETS,
      scan: {
        impersonation:    { ...results.grok,       purpose: "Fast X/Twitter scan",             contentValid: validateAiContent(results.grok)       },
        webPresence:      { ...results.perplexity, purpose: "Web-wide brand monitoring",       contentValid: validateAiContent(results.perplexity) },
        threatAssessment: { ...results.claude,     purpose: "Risk analysis & recommendations", contentValid: validateAiContent(results.claude)     },
      },
      allLive:     results.allLive,
      partialLive: results.partialLive,
      allValid:    results.allValid,
      landmines: {
        status:   "armed",
        coverage: PROTECTED_ASSETS.names.length + PROTECTED_ASSETS.domains.length + PROTECTED_ASSETS.socials.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anon";
  const limit = await checkRateLimit(ip, "protect");
  if (limit.limited) return tooManyRequests(limit.retryAfter ?? 60);
  let body: Partial<ProtectRequest>;
  try {
    body = (await req.json()) as Partial<ProtectRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const check = validateString(body.check, 500);
  if (!check) return badRequest("check is required and must be 500 characters or fewer");

  const type = validateEnum(body.type, VALID_TYPES) ?? "general";

  const safeCheck = sanitizeForPrompt(check, 500);

  try {
    type ScanFn = () => Promise<AIResponse>;
    const scanMap: Record<ThreatCheckType, ScanFn> = {
      impersonation: () => callGrok(
        `Is "${safeCheck}" impersonating or copying CoreIntent / Corey McIvor? ` +
        `Analyze the account or entity and rate the threat level (none/low/medium/high/critical).`,
        GROK_SECURITY_SYSTEM
      ),
      domain: () => callPerplexity(
        `Is the domain "${safeCheck}" a typosquat or phishing attempt targeting coreintent.dev or zynthio.ai? ` +
        `Check registration date, content, and stated intent.`,
        PERPLEXITY_SECURITY_SYSTEM
      ),
      threat: () => callClaudeDeep(
        `Assess this as a potential threat to CoreIntent's digital identity: "${safeCheck}". ` +
        `Threat level (low/medium/high/critical)? What immediate action should be taken?`,
        CLAUDE_RISK_SYSTEM
      ),
      general: () => callPerplexity(
        `Does "${safeCheck}" pose any risk to the CoreIntent / Zynthio brand or Corey McIvor's digital identity?`,
        PERPLEXITY_SECURITY_SYSTEM
      ),
    };

    const result = await scanMap[type]();
    if (!validateAiContent(result)) {
      return gatewayError("AI returned an empty response");
    }

    return ok({ check, type, result, timestamp: new Date().toISOString() });
  } catch (e) {
    return serverError(e);
  }
}

export async function OPTIONS() {
  return preflight();
}
