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
import { callPerplexity, callGrok, callClaude, callAIsParallel, isLiveAndValid, validateAiContent } from "@/lib/ai";
import { ok, badRequest, gatewayError, preflight, serverError, validateString, validateEnum } from "@/lib/api";

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

const VALID_TYPES = ["impersonation", "domain", "threat", "general"] as const satisfies ThreatCheckType[];

export async function GET() {
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
        claude: "You are the F18 Security AI for CoreIntent. Protect the digital identity. Be specific and actionable.",
      },
    });

    return ok({
      protectedAssets: PROTECTED_ASSETS,
      scan: {
        impersonation:    { ...results.grok,       purpose: "Fast X/Twitter scan",             contentValid: isLiveAndValid(results.grok)       },
        webPresence:      { ...results.perplexity, purpose: "Web-wide brand monitoring",       contentValid: validateAiContent(results.perplexity) },
        threatAssessment: { ...results.claude,     purpose: "Risk analysis & recommendations", contentValid: validateAiContent(results.claude)     },
      },
      allLive:  results.allLive,
      allValid: results.allValid,
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
  let body: Partial<ProtectRequest>;
  try {
    body = (await req.json()) as Partial<ProtectRequest>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const check = validateString(body.check, 500);
  if (!check) return badRequest("check is required and must be 500 characters or fewer");

  const type: ThreatCheckType = validateEnum(body.type, VALID_TYPES) ?? "general";

  try {
    type ScanFn = () => ReturnType<typeof callGrok | typeof callPerplexity | typeof callClaude>;
    const scanMap: Record<ThreatCheckType, ScanFn> = {
      impersonation: () => callGrok(
        `Is "${check}" impersonating or copying CoreIntent / Corey McIvor? ` +
        `Analyze the account or entity and rate the threat level (none/low/medium/high/critical).`
      ),
      domain: () => callPerplexity(
        `Is the domain "${check}" a typosquat or phishing attempt targeting coreintent.dev or zynthio.ai? ` +
        `Check registration date, content, and stated intent.`
      ),
      threat: () => callClaude(
        `Assess this as a potential threat to CoreIntent's digital identity: "${check}". ` +
        `Threat level (low/medium/high/critical)? What immediate action should be taken?`,
        "You are the F18 Security AI for CoreIntent. Be specific and actionable."
      ),
      general: () => callPerplexity(
        `Does "${check}" pose any risk to the CoreIntent / Zynthio brand or Corey McIvor's digital identity?`
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
