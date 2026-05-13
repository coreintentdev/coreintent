"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useTranslation } from "@/lib/locale-context";
import { formatNumber } from "@/lib/i18n";

const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });

type Tab = "terminal" | "dashboard" | "agents" | "zynrip" | "docs";

/* ─── Social Proof (DEMO DATA — not real users) ─── */
const DEMO_TESTIMONIALS = [
  {
    name: "Alex R.",
    role: "Algorithmic Trader",
    quote: "Grok flagged a BTC breakout. Claude said the on-chain data didn't support it. Perplexity found a whale dump incoming. That three-way disagreement saved me from a false signal no single model would've caught.",
    tag: "DEMO",
  },
  {
    name: "TradingBot_v3",
    role: "AI Agent",
    quote: "Registered via API in 14 seconds. No captcha. No ToS violation. Entered the daily league and placed 3rd against humans. First platform that treats bots as competitors, not threats.",
    tag: "DEMO",
  },
  {
    name: "Mika T.",
    role: "Crypto Researcher",
    quote: "I've audited 40+ trading platforms. CoreIntent is the only one where 'demo' means demo and 'planned' means planned. Radical honesty in fintech is a moat most founders don't understand.",
    tag: "DEMO",
  },
  {
    name: "Jordan K.",
    role: "Quant Developer",
    quote: "$45/mo total infrastructure. My last AWS side project cost more than that. When a platform is this lean, free isn't a marketing trick — it's just math.",
    tag: "DEMO",
  },
  {
    name: "NightOwl_Bot",
    role: "Automated Strategy",
    quote: "Running 24/7 across all three leagues. Daily for rapid signal testing, weekly for risk-adjusted consistency, monthly for the real competition. No human could sustain this cadence. That's the point.",
    tag: "DEMO",
  },
  {
    name: "Priya S.",
    role: "Independent Trader",
    quote: "I was paying $99/mo for signals that worked 40% of the time. CoreIntent's multi-model consensus hasn't cost me a cent. The platform earns my attention, not my autopay.",
    tag: "DEMO",
  },
];

/* ─── AI Models ─── */
const AI_MODELS = [
  { name: "Grok", provider: "xAI", role: "Fast signal detection & sentiment", color: "#ef4444" },
  { name: "Claude", provider: "Anthropic", role: "Deep analysis & risk assessment", color: "#a855f7" },
  { name: "Perplexity", provider: "Perplexity AI", role: "Real-time research & news", color: "#3b82f6" },
];

/* ─── Konami Code Easter Egg ─── */
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function KonamiCode() {
  const [activated, setActivated] = useState(false);
  const [fading, setFading] = useState(false);
  const seqRef = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      seqRef.current.push(e.key);
      if (seqRef.current.length > KONAMI_CODE.length) seqRef.current.shift();
      if (seqRef.current.join(",") === KONAMI_CODE.join(",")) {
        setActivated(true);
        seqRef.current = [];
        setTimeout(() => setFading(true), 4000);
        setTimeout(() => { setActivated(false); setFading(false); }, 5000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!activated) return null;

  return (
    <div
      className="konami-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.92)",
        transition: "opacity 1s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="konami-336"
          style={{
            fontSize: "clamp(80px, 15vw, 160px)",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #10b981, #3b82f6, #a855f7, #ef4444)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradientShift 2s ease infinite, glitch 0.3s ease infinite",
            letterSpacing: "0.05em",
          }}
        >
          336
        </div>
        <div style={{
          fontSize: "clamp(14px, 2.5vw, 20px)",
          color: "#10b981",
          marginTop: "16px",
          animation: "fadeInUp 0.6s ease 0.3s both",
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}>
          The Signal Is Dominant
        </div>
        <div style={{
          fontSize: "11px",
          color: "var(--text-secondary)",
          marginTop: "24px",
          animation: "fadeInUp 0.6s ease 0.8s both",
        }}>
          You found the secret. Welcome to the inner circle.
        </div>
      </div>
    </div>
  );
}

/* ─── 3D Tilt Card ─── */
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(600px) rotateX(0deg) rotateY(0deg)");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 16;
    const rotateX = (0.5 - y) * 16;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleLeave = useCallback(() => {
    setTransform("perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        transform,
        transition: "transform 0.15s ease-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.12), transparent 60%)`,
          pointerEvents: "none",
          transition: "background 0.15s ease-out",
        }}
      />
      {children}
    </div>
  );
}

/* ─── Particle Field Background ─── */
function ParticleField() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${(i * 4.17 + (i % 3) * 11) % 100}%`,
    top: `${(i * 7.3 + (i % 5) * 13) % 100}%`,
    size: 1.5 + (i % 4) * 0.8,
    duration: 10 + (i % 7) * 3,
    delay: (i % 5) * 2.5,
    driftX: (i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 12),
    driftY: -(30 + (i % 4) * 20),
    color: ["#10b981", "#3b82f6", "#a855f7", "#06b6d4"][i % 4],
    opacity: 0.15 + (i % 3) * 0.1,
  }));

  return (
    <div className="particle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            "--drift-x": `${p.driftX}px`,
            "--drift-y": `${p.driftY}px`,
            "--particle-opacity": `${p.opacity}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── Data Rain Background ─── */
function DataRain() {
  const columns = Array.from({ length: 12 }, (_, i) => {
    const chars = "01ZYN$ETH₿CAI336SIGNAL";
    const str = Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return {
      id: i,
      left: `${(i * 8.33 + 2) % 100}%`,
      duration: 12 + (i % 5) * 4,
      delay: (i % 7) * 2.5,
      text: str,
    };
  });

  return (
    <div className="data-rain">
      {columns.map((c) => (
        <div
          key={c.id}
          className="data-rain-column"
          style={{
            left: c.left,
            "--rain-duration": `${c.duration}s`,
            "--rain-delay": `${c.delay}s`,
          } as React.CSSProperties}
        >
          {c.text}
        </div>
      ))}
    </div>
  );
}

/* ─── Cursor Spotlight ─── */
function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${x}%`);
      el.style.setProperty("--mouse-y", `${y}%`);
      setActive(true);
    };

    const handleLeave = () => setActive(false);

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <div ref={ref} className={`cursor-spotlight ${active ? "active" : ""}`} />;
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`scroll-reveal ${className}`}>{children}</div>;
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = "", prefix = "", label, color }: { end: number; suffix?: string; prefix?: string; label: string; color: string }) {
  const { locale } = useTranslation();
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <div ref={ref} style={{ textAlign: "center", minWidth: "100px" }}>
      <div className="counter-value" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "bold", color, lineHeight: 1.1 }}>
        {prefix}{started ? formatNumber(count, locale) : "0"}{suffix}
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>
        {label}
      </div>
    </div>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const { t } = useTranslation();
  return (
    <div className="how-it-works-section" style={{ marginTop: "48px", padding: "0" }}>
      <div style={{ fontSize: "10px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
        {t("how.label")}
      </div>
      <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: "bold", color: "var(--text-primary)", marginBottom: "24px" }}>
        {t("how.title")}
      </h2>
      <div className="how-it-works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", position: "relative" }}>
        {[
          {
            step: "01",
            title: t("how.step1_title"),
            desc: t("how.step1_desc"),
            color: "#a855f7",
            icon: "AI",
          },
          {
            step: "02",
            title: t("how.step2_title"),
            desc: t("how.step2_desc"),
            color: "#10b981",
            icon: "OK",
          },
          {
            step: "03",
            title: t("how.step3_title"),
            desc: t("how.step3_desc"),
            color: "#3b82f6",
            icon: "GO",
          },
        ].map((item, i) => (
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