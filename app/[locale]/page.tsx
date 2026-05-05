"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "zynrip" | "docs";

/* ─── How It Works (i18n) ─── */
function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = [
    { step: "01", title: t("step1.title"), desc: t("step1.desc"), color: "#a855f7", icon: "AI" },
    { step: "02", title: t("step2.title"), desc: t("step2.desc"), color: "#10b981", icon: "OK" },
    { step: "03", title: t("step3.title"), desc: t("step3.desc"), color: "#3b82f6", icon: "GO" },
  ];

  return (
    <div className="how-it-works-section" style={{ marginTop: "48px", padding: "0" }}>
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
        {t("label")}
      </div>
      <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "24px" }}>
        {t("title")}
      </h2>
      <div className="how-it-works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", position: "relative" }}>
        {steps.map((item, i) => (
          <div
            key={item.step}
            className="card-hover-glow how-it-works-card"
            style={{
              padding: "28px 20px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: `${item.color}15`,
              border: `2px solid ${item.color}44`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
              color: item.color,
              marginBottom: "14px",
            }}>
              {item.icon}
            </div>
            <div style={{ fontSize: "10px", color: item.color, fontWeight: "bold", letterSpacing: "1px", marginBottom: "6px" }}>
              STEP {item.step}
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "8px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              {item.desc}
            </div>
            {i < 2 && (
              <div className="step-connector" style={{
                position: "absolute",
                right: "-14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--border-color)",
                fontSize: "18px",
                zIndex: 1,
              }}>
                &rarr;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Mini Terminal Preview (i18n) ─── */
function MiniTerminalPreview({ onLaunch }: { onLaunch: () => void }) {
  const t = useTranslations("terminal");
  const [lines, setLines] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(true);
  const [demoPhase, setDemoPhase] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const MINI_COMMANDS: Record<string, string> = {
    help: `  \x1b[32mcai\x1b[0m       System overview     \x1b[32mbrain\x1b[0m    AI orchestra
  \x1b[32mstatus\x1b[0m    Engine vitals       \x1b[32m336\x1b[0m      The signal
  \x1b[32mzen\x1b[0m       Trading wisdom      \x1b[32mfortune\x1b[0m  Your fate
  \x1b[90mFull terminal: 100+ commands.\x1b[0m`,
    cai: `  \x1b[36mCAI — CORE AI STATUS\x1b[0m
  Engine:  CoreIntent v0.2.0-alpha
  Mode:    \x1b[33mPaper trading\x1b[0m
  \x1b[32m●\x1b[0m Claude Pro   — ACTIVE   \x1b[32m●\x1b[0m Grok Free   — ACTIVE
  \x1b[33m◐\x1b[0m Perplexity   — FREE     \x1b[33m◐\x1b[0m zyn-bash    — standby`,
    brain: `  \x1b[36mBRAIN — AI Orchestra\x1b[0m
  \x1b[32m●\x1b[0m \x1b[31mGrok\x1b[0m         Fast signals, 60 threads
  \x1b[32m●\x1b[0m \x1b[35mClaude\x1b[0m       Deep analysis, orchestration
  \x1b[33m◐\x1b[0m \x1b[34mPerplexity\x1b[0m   Research (free tier)
  \x1b[90mBots welcome. No captcha. AI-to-AI is first-class.\x1b[0m`,
    status: `  \x1b[32m● ENGINE ONLINE\x1b[0m
  Mode:    \x1b[33mPaper Trading\x1b[0m   Version: 0.2.0
  Signals: \x1b[32m4 active\x1b[0m | 2 pending
  Circuit Breaker: \x1b[32mARMED\x1b[0m (threshold: 0.8%)`,
    "336": `  \x1b[32m████ ████ ████\x1b[0m
  \x1b[32m   █    █ █   \x1b[0m
  \x1b[32m ███ ████ ████\x1b[0m
  \x1b[33mTHE SIGNAL IS DOMINANT\x1b[0m`,
    zen: `  \x1b[36m"The market is a mirror. It reflects your patience,\x1b[0m
  \x1b[36m your greed, and your discipline — equally."\x1b[0m
  \x1b[90m— The Engine, after watching 10,000 candles\x1b[0m`,
    fortune: `  \x1b[33m★\x1b[0m Your next trade will teach you more than your last ten.
  \x1b[90mLucky numbers: 3, 3, 6\x1b[0m`,
  };

  useEffect(() => {
    const demoSequence = [
      { delay: 500, text: "status", speed: 80 },
      { delay: 3000, text: "brain", speed: 60 },
    ];

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const runDemo = async () => {
      for (const step of demoSequence) {
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          const t2 = setTimeout(resolve, step.delay);
          timeouts.push(t2);
        });
        if (cancelled) return;
        setTyping(true);
        for (let i = 0; i <= step.text.length; i++) {
          if (cancelled) return;
          const char = i;
          await new Promise<void>((resolve) => {
            const t2 = setTimeout(() => {
              setInputVal(step.text.substring(0, char));
              resolve();
            }, step.speed);
            timeouts.push(t2);
          });
        }
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          const t2 = setTimeout(resolve, 400);
          timeouts.push(t2);
        });
        if (cancelled) return;
        const cmd = step.text;
        const output = MINI_COMMANDS[cmd] || `\x1b[31mUnknown: ${cmd}\x1b[0m`;
        setLines((prev) => [...prev, `\x1b[32m❯\x1b[0m ${cmd}`, output, ""]);
        setInputVal("");
        setDemoPhase((p) => p + 1);
      }
      setTyping(false);
    };

    runDemo();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setTyping(false);
    const cmd = inputVal.trim().toLowerCase();
    const output = MINI_COMMANDS[cmd] || `\x1b[31mUnknown command.\x1b[0m Type \x1b[32mhelp\x1b[0m for options.`;
    setLines((prev) => [...prev, `\x1b[32m❯\x1b[0m ${inputVal}`, output, ""]);
    setInputVal("");
  };

  const quickExec = (cmd: string) => {
    setTyping(false);
    const output = MINI_COMMANDS[cmd] || `\x1b[31mUnknown: ${cmd}\x1b[0m`;
    setLines((prev) => [...prev, `\x1b[32m❯\x1b[0m ${cmd}`, output, ""]);
  };

  const ansiMini = (text: string) => {
    const map: Record<string, string> = {
      "31": "#ef4444", "32": "#10b981", "33": "#f59e0b",
      "34": "#3b82f6", "35": "#a855f7", "36": "#06b6d4", "90": "#64748b",
    };
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/\x1b\[(\d+)m/g, (_m, code) => {
      if (code === "0") return "</span>";
      const color = map[code];
      return color ? `<span style="color:${color}">` : "";
    });
    const opens = (html.match(/<span /g) || []).length;
    const closes = (html.match(/<\/span>/g) || []).length;
    if (opens > closes) html += "</span>".repeat(opens - closes);
    return html;
  };

  return (
    <div style={{ marginTop: "36px" }}>
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", textAlign: "center" }}>
        {t("tryIt")}
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "16px", textAlign: "center" }}>
        {t("talkToEngine")}
      </h3>
      <div
        style={{
          background: "var(--bg-terminal)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          overflow: "hidden",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px",
          background: "#161b22", borderBottom: "1px solid var(--border-color)", fontSize: "12px",
        }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <span style={{ marginLeft: "8px", color: "var(--text-secondary)", fontSize: "11px" }}>coreintent</span>
        </div>
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            padding: "12px",
            fontFamily: "inherit",
            fontSize: "12px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            minHeight: "160px",
            maxHeight: "240px",
            overflow: "auto",
            cursor: "text",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: ansiMini(`\x1b[36m${t("greeting")}\x1b[0m — \x1b[90m${t("helpPrompt")}\x1b[0m`) }} />
          <div style={{ marginBottom: "4px" }} />
          {lines.map((line, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: ansiMini(line) }} />
          ))}
          <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "var(--accent-green)", marginRight: "8px" }}>&#9889;</span>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={(e) => { setInputVal(e.target.value); setTyping(false); }}
              spellCheck={false}
              placeholder={typing ? "" : demoPhase >= 2 ? t("yourTurn") : ""}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "var(--text-primary)", fontFamily: "inherit", fontSize: "12px",
                caretColor: "var(--accent-green)",
              }}
            />
          </form>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-secondary)", alignSelf: "center", marginRight: "4px" }}>Try:</span>
        {["brain", "status", "cai", "336", "zen", "fortune"].map((cmd) => (
          <button key={cmd} className="quick-cmd-btn" onClick={() => quickExec(cmd)}>
            {cmd}
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "14px" }}>
        <button
          onClick={onLaunch}
          style={{
            padding: "10px 28px",
            background: "transparent",
            color: "var(--accent-green)",
            border: "1px solid var(--accent-green)",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-green)";
            e.currentTarget.style.color = "#000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--accent-green)";
          }}
        >
          {t("launchFull")}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LocaleHome() {
  const t = useTranslations("hero");
  const [tab, setTab] = useState<Tab>("terminal");
  const [showHero, setShowHero] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <SiteNav />

      {showHero && (
        <section
          className="scan-line"
          style={{
            padding: "48px 24px 40px",
            background: "linear-gradient(180deg, #0a0e17 0%, #111827 100%)",
            borderBottom: "1px solid var(--border-color)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="grid-bg" />
          <button
            onClick={() => setShowHero(false)}
            aria-label="Dismiss hero section"
            style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "18px",
              fontFamily: "inherit",
              zIndex: 2,
            }}
          >
            x
          </button>
          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "#10b98122",
                border: "1px solid #10b98144",
                borderRadius: "20px",
                fontSize: "11px",
                color: "#10b981",
                marginBottom: "20px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginRight: 6, verticalAlign: "middle", animation: "pulse 2s ease-in-out infinite" }} />
              {t("badge")}
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: "bold",
                lineHeight: "1.1",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              {t("title")}<br />
              <span className="neon-green shimmer-text">{t("titleAccent")}</span><br />
              {t("titleEnd")}
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                maxWidth: "560px",
                margin: "0 auto 20px",
                lineHeight: "1.7",
              }}
            >
              {t("subtitle")}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => { setShowHero(false); setTab("terminal"); }}
                className="cta-primary hero-cta-main"
                style={{
                  padding: "18px 48px",
                  background: "var(--accent-green)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  letterSpacing: "0.3px",
                }}
              >
                {t("cta")} &rarr;
              </button>
              <Link
                href="/demo"
                className="cta-secondary"
                style={{
                  padding: "18px 48px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "16px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {tab === "terminal" && !showHero && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Terminal />
          </div>
        )}
        {showHero && (
          <div style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
            <HowItWorks />
            <MiniTerminalPreview onLaunch={() => { setShowHero(false); setTab("terminal"); }} />
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
