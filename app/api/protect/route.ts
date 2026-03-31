import { NextRequest, NextResponse } from "next/server";
import { callPerplexity, callGrok, callClaude } from "@/lib/ai";

/**
 * /api/protect — F18 Security Layer
 * Monitors and protects digital identity using the AI orchestra.
 *
 * GET  = run full protection scan
 * POST = check specific threat or domain
 *
 * Uses:
 * - Grok: fast scan for impersonation on X/Twitter
 * - Perplexity: web-wide search for unauthorized use of name/brand
 * - Claude: threat analysis and recommendation
 */

const PROTECTED_ASSETS = {
  names: ["Corey McIvor", "CoreIntent", "Zynthio", "coreintentai", "coreintentdev"],
  domains: ["coreintent.dev", "zynthio.ai"],
  socials: ["@coreintentai", "@coreintentdev"],
  repos: ["github.com/coreintentdev"],
  customTools: ["The Ripper", "Mac the Zipper", "PDF Plumber", "SongPal"],
};

export async function GET() {
  // F18 patrol — all 3 AIs scan in parallel
  const [impersonationScan, webScan, threatAnalysis] = await Promise.all([
    callGrok(
      `Scan X/Twitter for any accounts impersonating or copying: ${PROTECTED_ASSETS.socials.join(", ")}. ` +
      `Also check for unauthorized use of the names: ${PROTECTED_ASSETS.names.join(", ")}. ` +
      `Report any suspicious accounts or activity.`
    ),
    callPerplexity(
      `Search the web for unauthorized use of these brands and names: ${PROTECTED_ASSETS.names.join(", ")}. ` +
      `Check domains similar to: ${PROTECTED_ASSETS.domains.join(", ")}. ` +
      `Look for typosquatting, phishing, or brand impersonation. ` +
      `Also check if anyone has cloned repos from: ${PROTECTED_ASSETS.repos.join(", ")}.`
    ),
    callClaude(
      `Analyze the digital identity protection status for:\n` +
      `- Protected names: ${PROTECTED_ASSETS.names.join(", ")}\n` +
      `- Domains: ${PROTECTED_ASSETS.domains.join(", ")}\n` +
      `- Social accounts: ${PROTECTED_ASSETS.socials.join(", ")}\n` +
      `- Custom IP: ${PROTECTED_ASSETS.customTools.join(", ")}\n\n` +
      `Assess: What are the biggest risks? What should be trademarked? ` +
      `What needs immediate action to prevent impersonation or IP theft?`,
      "You are the F18 Security AI for CoreIntent. Protect the digital identity. Be specific and actionable."
    ),
  ]);

  return NextResponse.json({
    protectedAssets: PROTECTED_ASSETS,
    scan: {
      impersonation: { ai: "grok", ...impersonationScan, purpose: "Fast X/Twitter scan" },
      webPresence: { ai: "perplexity", ...webScan, purpose: "Web-wide brand monitoring" },
      threatAssessment: { ai: "claude", ...threatAnalysis, purpose: "Risk analysis & recommendations" },
    },
    allLive: impersonationScan.live && webScan.live && threatAnalysis.live,
    landmines: {
      status: "armed",
      coverage: PROTECTED_ASSETS.names.length + PROTECTED_ASSETS.domains.length + PROTECTED_ASSETS.socials.length,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const { check, type = "general" } = await req.json();

  if (!check) {
    return NextResponse.json({ error: "check is required" }, { status: 400 });
  }

  const scanMap: Record<string, () => Promise<unknown>> = {
    impersonation: () => callGrok(`Is "${check}" impersonating or copying CoreIntent / Corey McIvor? Analyze this account or entity.`),
    domain: () => callPerplexity(`Is the domain "${check}" legitimate or a typosquat/phishing attempt targeting coreintent.dev or zynthio.ai?`),
    threat: () => callClaude(`Assess this as a potential threat to CoreIntent's digital identity: "${check}". What action should be taken?`),
    general: () => callPerplexity(`Check if "${check}" poses any risk to the CoreIntent / Zynthio brand or Corey McIvor's digital identity.`),
  };

  const fn = scanMap[type] || scanMap.general;
  const result = await fn();

  return NextResponse.json({ check, type, result, timestamp: new Date().toISOString() });
}
