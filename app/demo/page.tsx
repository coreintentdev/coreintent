"use client";

import { useState, useEffect, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

/* ─── Scroll Reveal ─── */
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

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useScrollReveal();
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

/* ─── Model Agreement Matrix ─── */
function ModelAgreement() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const models = ["Grok", "Claude", "Perplexity"];
  const colors = ["#ef4444", "#a855f7", "#3b82f6"];
  const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "AVAX/USDT"];

  const signals = pairs.map((pair, pi) => {
    const seed = pi * 7 + tick;
    return {
      pair,
      models: models.map((_, mi) => {
        const val = Math.sin(seed * 0.3 + mi * 2.1) * 0.5 + 0.5;
        return val > 0.55 ? "LONG" as const : val < 0.45 ? "SHORT" as const : "HOLD" as const;
      }),
    };
  });

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          marginBottom: "12px",
        }}
      >
        Model Agreement Matrix
        <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
      </h2>
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(3, 1fr) 80px", gap: "8px", alignItems: "center" }}>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)" }} />
          {models.map((m, i) => (
            <div key={m} style={{ textAlign: "center", fontSize: "11px", fontWeight: "bold", color: colors[i] }}>{m}</div>
          ))}
          <div style={{ textAlign: "center", fontSize: "10px", color: "var(--text-secondary)" }}>CONSENSUS</div>

          {signals.map((sig) => {
            const agreement = sig.models.every((m) => m === sig.models[0]);
            const majority = sig.models.filter((m) => m === sig.models[0]).length >= 2
              || sig.models.filter((m) => m === "LONG").length >= 2
              || sig.models.filter((m) => m === "SHORT").length >= 2;
            return (
              <div key={sig.pair} style={{ display: "contents" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-primary)" }}>{sig.pair}</div>
                {sig.models.map((signal, mi) => {
                  const bg = signal === "LONG" ? "#10b98118" : signal === "SHORT" ? "#ef444418" : "#f59e0b18";
                  const color = signal === "LONG" ? "#10b981" : signal === "SHORT" ? "#ef4444" : "#f59e0b";
                  return (
                    <div
                      key={mi}
                      style={{
                        textAlign: "center",
                        padding: "6px 8px",
                        background: bg,
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color,
                        transition: "all 0.5s ease",
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {signal === "LONG" ? "▲" : signal === "SHORT" ? "▼" : "●"} {signal}
                    </div>
                  );
                })}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: agreement ? "#10b981" : majority ? "#f59e0b" : "#ef4444",
                    padding: "6px",
                    background: agreement ? "#10b98112" : majority ? "#f59e0b12" : "#ef444412",
                    borderRadius: "6px",
                    transition: "all 0.5s ease",
                  }}
                >
                  {agreement ? "3/3" : majority ? "2/3" : "SPLIT"}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "12px", fontSize: "10px", color: "var(--text-secondary)", textAlign: "center" }}>
          Models update independently. Green = consensus. Yellow = majority. Red = split decision.
        </div>
      </div>
    </section>
  );
}

/* ─── DEMO DATA — Simulated, not real trading ─── */

const TOKENS = [
  { symbol: "BTC", name: "Bitcoin", basePrice: 67420, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", basePrice: 3285, color: "#627eea" },
  { symbol: "SOL", name: "Solana", basePrice: 142.8, color: "#14f195" },
  { symbol: "AVAX", name: "Avalanche", basePrice: 35.6, color: "#e84142" },
];

const SIGNAL_POOL = [
  { pair: "BTC/USDT", direction: "long" as const, confidence: 0.87, source: "Grok + Claude" },
  { pair: "ETH/USDT", direction: "long" as const, confidence: 0.82, source: "Claude" },
  { pair: "SOL/USDT", direction: "short" as const, confidence: 0.74, source: "Grok" },
  { pair: "AVAX/USDT", direction: "long" as const, confidence: 0.91, source: "All 3 Models" },
  { pair: "BTC/USDT", direction: "long" as const, confidence: 0.79, source: "Perplexity" },
  { pair: "ETH/USDT", direction: "short" as const, confidence: 0.68, source: "Claude" },
];

const CHART_Y = [
  150, 130, 140, 100, 110, 70, 80, 50, 60, 30,
  40, 20, 35, 25, 45, 30, 50, 35, 20, 28,
];

const DEBATES = [
  [
    { model: "Grok", color: "#ef4444", text: "BTC showing bullish divergence on 4H. RSI recovering from oversold. Entry looks clean — 87% confidence." },
    { model: "Claude", color: "#a855f7", text: "Hold on — volume is declining on this bounce. Previous resistance at $68,200 hasn't been tested. Risk/reward is thin." },
    { model: "Perplexity", color: "#3b82f6", text: "Latest Fed minutes suggest no rate cut until Q3. Institutional inflows slowed 12% this week per CoinShares data." },
    { model: "Grok", color: "#ef4444", text: "Fair points. Adjusting confidence from 87% to 72%. Still long-biased but smaller position." },
    { model: "Claude", color: "#a855f7", text: "Agreed — wait for clean break above $68,200 with volume confirmation. Setting alert." },
    { model: "Engine", color: "#10b981", text: "DECISION: HOLD. Consensus incomplete. Alert set at $68,200 breakout with volume > 1.5x avg." },
  ],
  [
    { model: "Grok", color: "#ef4444", text: "SOL breaking out of descending wedge on high volume. NFT activity spiking across Tensor." },
    { model: "Claude", color: "#a855f7", text: "Pattern confirmed. Fibonacci extension targets $158. Risk/reward 3.2:1 at current levels." },
    { model: "Perplexity", color: "#3b82f6", text: "Solana ecosystem TVL up 23% this month. Jupiter DEX volume hit ATH yesterday. Fundamentals support it." },
    { model: "Grok", color: "#ef4444", text: "All three aligned. Confidence: 91%. This is the signal." },
    { model: "Claude", color: "#a855f7", text: "Concur. Position size: 8% of portfolio. Stop loss at $134.50 (-5.8%)." },
    { model: "Engine", color: "#10b981", text: "DECISION: LONG SOL/USDT. Consensus: 91%. Entry: $142.80. Target: $158.00. Stop: $134.50." },
  ],
];

function AIDebate() {
  const [messages, setMessages] = useState<Array<{ model: string; color: string; text: string }>>([]);
  const [debateIdx, setDebateIdx] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const debate = DEBATES[debateIdx % DEBATES.length];
    setMessages([]);
    let idx = 0;

    const addNext = () => {
      if (idx >= debate.length) {
        setTyping(false);
        const timeout = setTimeout(() => setDebateIdx((prev) => prev + 1), 8000);
        return () => clearTimeout(timeout);
      }
      setTyping(true);
      const delay = setTimeout(() => {
        setMessages((prev) => [...prev, debate[idx]]);
        setTyping(false);
        idx++;
        setTimeout(addNext, 800);
      }, 1800);
      return () => clearTimeout(delay);
    };

    const start = setTimeout(addNext, 1000);
    return () => clearTimeout(start);
  }, [debateIdx]);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        style={{
          fontSize: "12px",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          marginBottom: "12px",
        }}
      >
        AI Model Debate
        <span style={{ marginLeft: "8px", fontSize: "10px", color: "var(--accent-green)" }}>LIVE</span>
      </h2>
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "20px",
          minHeight: "280px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginBottom: "16px",
            padding: "8px 12px",
            background: "var(--bg-primary)",
            borderRadius: "6px",
            borderLeft: "3px solid var(--accent-blue)",
          }}
        >
          Three models. One trade decision. Watch them argue.
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className="signal-flash"
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "12px",
              padding: "10px 14px",
              background: m.model === "Engine" ? "#10b98112" : "var(--bg-primary)",
              borderRadius: "8px",
              borderLeft: `3px solid ${m.color}`,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `${m.color}22`,
                border: `1px solid ${m.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                color: m.color,
                flexShrink: 0,
              }}
            >
              {m.model[0]}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: m.color, marginBottom: "2px" }}>
                {m.model}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                {m.text}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ padding: "10px 14px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "10px" }}>AI</span>
            </div>
            <div>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {messages.length === 0 && !typing && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: "12px" }}>
            Debate starting...
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Order Book + Neural Activity ─── */
function OrderBookAndNeural() {
  const [book, setBook] = useState(() => generateBook());
  const [neuralPulse, setNeuralPulse] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setBook(generateBook()), 800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNeuralPulse((p) => (p + 1) % 100), 100);
    return () => clearInterval(iv);
  }, []);

  const spread = (book.asks[0].price - book.bids[0].price).toFixed(2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
      {/* Order Book */}
      <section>
        <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Order Book (Simulated)
          <span className="animate-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginLeft: 8, verticalAlign: "middle" }} />
        </h2>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase" }}>
            <span>Price</span><span>Size</span><span>Total</span>
          </div>
          {book.asks.slice().reverse().map((o, i) => (
            <div key={`a${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(o.total / book.maxTotal) * 100}%`, background: "#ef444412", borderRadius: "2px" }} />
              <span style={{ color: "#ef4444", zIndex: 1 }}>${o.price.toLocaleString()}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.size.toFixed(4)}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.total.toFixed(4)}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: "6px 0", fontSize: "13px", fontWeight: "bold", color: "#10b981", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", margin: "4px 0" }}>
            Spread: ${spread}
          </div>
          {book.bids.map((o, i) => (
            <div key={`b${i}`} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "2px 0", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(o.total / book.maxTotal) * 100}%`, background: "#10b98112", borderRadius: "2px" }} />
              <span style={{ color: "#10b981", zIndex: 1 }}>${o.price.toLocaleString()}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.size.toFixed(4)}</span>
              <span style={{ color: "var(--text-secondary)", zIndex: 1 }}>{o.total.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Neural Activity */}
      <section>
        <h2 style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Neural Activity
        </h2>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "10px", padding: "16px" }}>
          <svg viewBox="0 0 300 200" style={{ width: "100%", height: "auto" }}>
            {[
              { label: "Grok", x: 60, y: 50, color: "#ef4444" },
              { label: "Claude", x: 60, y: 150, color: "#a855f7" },
              { label: "Perplexity", x: 240, y: 50, color: "#3b82f6" },
              { label: "Consensus", x: 240, y: 150, color: "#10b981" },
            ].map((node, ni) => {
              const connections = ni < 3 ? [3] : [];
              return (
                <g key={node.label}>
                  {connections.map((ci) => {
                    const target = [{ x: 60, y: 50 }, { x: 60, y: 150 }, { x: 240, y: 50 }, { x: 240, y: 150 }][ci];
                    const progress = ((neuralPulse + ni * 25) % 50) / 50;
                    const px = node.x + (target.x - node.x) * progress;
                    const py = node.y + (target.y - node.y) * progress;
                    return (
                      <g key={`c${ni}-${ci}`}>
                        <line x1={node.x} y1={node.y} x2={target.x} y2={target.y} stroke={node.color} strokeOpacity={0.2} strokeWidth={1} />
                        <circle cx={px} cy={py} r={3} fill={node.color} opacity={0.8} />
                      </g>
                    );
                  })}
                  <circle cx={node.x} cy={node.y} r={20} fill="none" stroke={node.color} strokeWidth={1.5} opacity={0.5 + Math.sin(neuralPulse * 0.08 + ni) * 0.3} />
                  <circle cx={node.x} cy={node.y} r={8} fill={node.color} opacity={0.3} />
                  <text x={node.x} y={node.y + 36} textAnchor="middle" fill={node.color} fontSize={9} fontFamily="monospace">{node.label}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "8px" }}>
            {["Grok", "Claude", "Perplexity", "Engine"].map((name, i) => {
              const colors = ["#ef4444", "#a855f7", "#3b82f6", "#10b981"];
              const activity = 40 + Math.sin(neuralPulse * 0.06 + i * 1.5) * 30 + Math.random() * 10;
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "9px", color: colors[i], marginBottom: "4px" }}>{name}</div>
                  <div style={{ height: "4px", background: "var(--bg-primary)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${activity}%`, background: colors[i], borderRadius: "2px", transition: "width 0.3s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function generateBook() {
  const mid = 67420 + (Math.random() - 0.5) * 200;
  const asks: Array<{ price: number; size: number; total: number }> = [];
  const bids: Array<{ price: number; size: number; total: number }> = [];
  let askTotal = 0;
  let bidTotal = 0;
  for (let i = 0; i < 8; i++) {
    const askSize = +(Math.random() * 2 + 0.1).toFixed(4);
    askTotal += askSize;
    asks.push({ price: +(mid + (i + 1) * 5 + Math.random() * 3).toFixed(2), size: askSize, total: +askTotal.toFixed(4) });
    const bidSize = +(Math.random() * 2 + 0.1).toFixed(4);
    bidTotal += bidSize;
    bids.push({ price: +(mid - (i + 1) * 5 - Math.random() * 3).toFixed(2), size: bidSize, total: +bidTotal.toFixed(4) });
  }
  const maxTotal = Math.max(askTotal, bidTotal);
  return { asks, bids, maxTotal };
}

/* ─── Market Depth Chart ─── */
function DepthChart() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(iv);
  }, []);

  const mid = 67420;
  const spread = 0.02;
  const levels = 20;

  const bids: Array<{ price: number; cumSize: number }> = [];
  const asks: Array<{ price: number; cumSize: number }> = [];
  let bidCum = 0;
  let askCum = 0;

  for (let i = 0; i < levels; i++) {
    const bidSize = (Math.sin(i * 0.7 + tick * 0.3) * 0.5 + 1) * (2 + Math.random() * 3);
    bidCum += bidSize;
    bids.push({ price: mid - (i + 1) * mid * spread * 0.05, cumSize: bidCum });

    const askSize = (Math.cos(i * 0.6 + tick * 0.25) * 0.5 + 1) * (2 + Math.random() * 3);
    askCum += askSize;
    asks.push({ price: mid + (i + 1) * mid * spread * 0.05, cumSize: askCum });
  }

  const svgW = 600;
  const svgH = 180;
  const pad = 40;
  const maxCum = Math.max(bidCum, askCum);

  const toX = (price: number) => {
    const minP = bids[bids.length - 1].price;
    const maxP = asks[asks.length - 1].price;
    return pad + ((price - minP) / (maxP - minP)) * (svgW - pad * 2);
  };
  const toY = (cum: number) => svgH - pad - (cum / maxCum) * (svgH - pad * 2);

  const bidPoints = bids.map((b) => `${toX(b.price)},${toY(b.cumSize)}`);
  const askPoints = asks.map((a) => `${toX(a.price)},${toY(a.cumSize)}`);

  const bidPath = `M ${toX(mid)},${svgH - pad} L ${bidPoints.join(" L ")}`;
  const askPath = `M ${toX(mid)},${svgH - pad} L ${askPoints.join(" L ")}`;

  const bidFill = `${bidPath} L ${toX(bids[bids.length - 1].price)},${svgH - pad} Z`;
  const askFill = `${askPath} L ${toX(asks[asks.length - 1].price)},${svgH - pad} Z`;

  const buyWall = bids.reduce((max, b, i) => {
    const size = i === 0 ? b.cumSize : b.cumSize - bids[i - 1].cumSize;
    return size > max.size ? { price: b.price, size } : max;
  }, { price: 0, size: 0 });
  const sellWall = asks.reduce((max, a, i) => {
    const size = i === 0 ? a.cumSize : a.cumSize - asks[i - 1].cumSize;
    return size > max.size ? { price: a.price, size } : max;
  }, { price: 0, size: 0 });

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{
        fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)",
        letterSpacing: "0.5px", marginBottom: "12px",
      }}>
        Market Depth (BTC/USDT)
        <span className="animate-pulse" style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: "#10b981", marginLeft: 8, verticalAlign: "middle",
        }} />
      </h2>
      <div className="glow-line" style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
        borderRadius: "10px", padding: "20px",
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((pct) => (
            <line key={pct} x1={pad} y1={svgH - pad - pct * (svgH - pad * 2)}
              x2={svgW - pad} y2={svgH - pad - pct * (svgH - pad * 2)}
              stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
          ))}
          <line x1={toX(mid)} y1={pad} x2={toX(mid)} y2={svgH - pad}
            stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity={0.5} />
          <text x={toX(mid)} y={pad - 4} textAnchor="middle" fill="#f59e0b"
            fontSize="8" fontFamily="monospace">MID ${mid.toLocaleString()}</text>
          <path d={bidFill} fill="url(#bidGrad)" className="depth-fill-pulse" />
          <path d={bidPath} fill="none" stroke="#10b981" strokeWidth="1.5"
            style={{ transition: "d 0.5s ease" }} />
          <path d={askFill} fill="url(#askGrad)" className="depth-fill-pulse" />
          <path d={askPath} fill="none" stroke="#ef4444" strokeWidth="1.5"
            style={{ transition: "d 0.5s ease" }} />
          {buyWall.price > 0 && (
            <g className="depth-wall-marker">
              <circle cx={toX(buyWall.price)} cy={toY(bids.find((b) => b.price === buyWall.price)?.cumSize || 0)}
                r={5} fill="none" stroke="#10b981" strokeWidth={1.5} opacity={0.8} />
              <text x={toX(buyWall.price)} y={toY(bids.find((b) => b.price === buyWall.price)?.cumSize || 0) - 10}
                textAnchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">
                BUY WALL
              </text>
            </g>
          )}
          {sellWall.price > 0 && (
            <g className="depth-wall-marker">
              <circle cx={toX(sellWall.price)} cy={toY(asks.find((a) => a.price === sellWall.price)?.cumSize || 0)}
                r={5} fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.8} />
              <text x={toX(sellWall.price)} y={toY(asks.find((a) => a.price === sellWall.price)?.cumSize || 0) - 10}
                textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="monospace">
                SELL WALL
              </text>
            </g>
          )}
          <text x={pad + 10} y={svgH - pad + 14} fill="#10b981" fontSize="8" fontFamily="monospace">Bids</text>
          <text x={svgW - pad - 30} y={svgH - pad + 14} fill="#ef4444" fontSize="8" fontFamily="monospace">Asks</text>
        </svg>
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: "12px",
          fontSize: "10px", color: "var(--text-secondary)",
        }}>
          <span>
            Buy pressure: <span style={{ color: "#10b981", fontWeight: "bold" }}>
              {bidCum.toFixed(1)} BTC
            </span>
          </span>
          <span>Spread: <span style={{ color: "#f59e0b" }}>${(asks[0].price - bids[0].price).toFixed(2)}</span></span>
          <span>
            Sell pressure: <span style={{ color: "#ef4444", fontWeight: "bold" }}>
              {askCum.toFixed(1)} BTC
            </span>
          </span>
        </div>
        <div style={{
          textAlign: "center", marginTop: "8px", fontSize: "9px",
          color: "var(--text-secondary)", opacity: 0.7,
        }}>
          Simulated depth data — updates every 1.2s
        </div>
      </div>
    </section>
  );
}

/* ─── Live Candlestick Chart ─── */
function LiveCandlestickChart() {
  const [candles, setCandles] = useState<Array<{
    open: number; close: number; high: number; low: number; ts: number;
  }>>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxCandles = 24;

  useEffect(() => {
    let price = 67420;
    const initial: typeof candles = [];
    for (let i = 0; i < 12; i++) {
      const open = price;
      const move = (Math.random() - 0.45) * 400;
      const close = open + move;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      initial.push({ open, close, high, low, ts: Date.now() - (12 - i) * 60000 });
      price = close;
    }
    setCandles(initial);

    const iv = setInterval(() => {
      setCandles(prev => {
        const last = prev[prev.length - 1];
        const lastClose = last ? last.close : 67420;
        const open = lastClose;
        const move = (Math.random() - 0.45) * 350;
        const close = open + move;
        const high = Math.max(open, close) + Math.random() * 180;
        const low = Math.min(open, close) - Math.random() * 180;
        const next = [...prev, { open, close, high, low, ts: Date.now() }];
        return next.slice(-maxCandles);
      });
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  if (candles.length === 0) return null;

  const svgW = 600;
  const svgH = 200;
  const pad = 16;
  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 1;
  const toY = (p: number) => pad + (1 - (p - minP) / range) * (svgH - pad * 2);
  const candleW = Math.max(4, (svgW - pad * 2) / candles.length - 2);

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{
        fontSize: "12px", textTransform: "uppercase", color: "var(--text-secondary)",
        letterSpacing: "0.5px", marginBottom: "12px",
      }}>
        Live Candlestick Chart (BTC/USDT)
        <span className="animate-pulse" style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: "#10b981", marginLeft: 8, verticalAlign: "middle",
        }} />
      </h2>
      <div style={{
        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
        borderRadius: "10px", padding: "20px", position: "relative",
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
          <defs>
            <linearGradient id="candleGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.08} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(pct => {
            const price = minP + range * (1 - pct);
            return (
              <g key={pct}>
                <line x1={pad} y1={svgH * pct} x2={svgW - pad} y2={svgH * pct}
                  stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
                <text x={svgW - pad + 4} y={svgH * pct + 3} fill="#64748b" fontSize="8"
                  fontFamily="monospace">${Math.round(price).toLocaleString()}</text>
              </g>
            );
          })}
          {/* Candles */}
          {candles.map((c, i) => {
            const x = pad + (i / candles.length) * (svgW - pad * 2) + candleW / 2;
            const isGreen = c.close >= c.open;
            const color = isGreen ? "#10b981" : "#ef4444";
            const bodyTop = toY(Math.max(c.open, c.close));
            const bodyBot = toY(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBot - bodyTop);
            const isHovered = hoveredIdx === i;
            const isLatest = i === candles.length - 1;
            return (
              <g key={`${c.ts}-${i}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "crosshair" }}>
                {/* Wick */}
                <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)}
                  stroke={color} strokeWidth={1} opacity={isHovered ? 1 : 0.7} />
                {/* Body */}
                <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH}
                  fill={isGreen ? color : color} stroke={color} strokeWidth={0.5}
                  opacity={isHovered ? 1 : 0.85}
                  rx={1} />
                {/* Glow on latest */}
                {isLatest && (
                  <rect x={x - candleW / 2 - 2} y={bodyTop - 2} width={candleW + 4} height={bodyH + 4}
                    fill="none" stroke={color} strokeWidth={1} opacity={0.4} rx={2}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                )}
                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect x={x - 45} y={toY(c.high) - 52} width={90} height={46}
                      fill="var(--bg-primary)" stroke={color} strokeWidth={0.5} rx={4} opacity={0.95} />
                    <text x={x} y={toY(c.high) - 38} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                      {isGreen ? "▲ BULL" : "▼ BEAR"}
                    </text>
                    <text x={x} y={toY(c.high) - 27} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      O:{Math.round(c.open).toLocaleString()} C:{Math.round(c.close).toLocaleString()}
                    </text>
                    <text x={x} y={toY(c.high) - 17} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      H:{Math.round(c.high).toLocaleString()} L:{Math.round(c.low).toLocaleString()}
                    </text>
                    <text x={x} y={toY(c.high) - 8} textAnchor="middle" fill={color} fontSize="7" fontFamily="monospace">
                      {isGreen ? "+" : ""}{((c.close - c.open) / c.open * 100).toFixed(2)}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {/* Current price line */}
          {candles.length > 0 && (() => {
            const lastClose = candles[candles.length - 1].close;
            const y = toY(lastClose);
            return (
              <g>
                <line x1={pad} y1={y} x2={svgW - pad} y2={y}
                  stroke="#10b981" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.5} />
                <rect x={svgW - pad - 1} y={y - 7} width={50} height={14}
                  fill="#10b981" rx={3} opacity={0.9} />
                <text x={svgW - pad + 24} y={y + 3} textAnchor="middle" fill="#000"
                  fontSize="8" fontFamily="monospace" fontWeight="bold">
                  ${Math.round(lastClose).toLocaleString()}
                </text>
              </g>
            );
          })()}
        </svg>
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: "8px",
          fontSize: "10px", color: "var(--text-secondary)",
        }}>
          <span>Simulated 5-min candles</span>
          <span>{candles.length} candles | Updates every 2.5s</span>
        </div>
      </div>
    </section>
  );
}

export default function DemoPage() {
  const [prices, setPrices] = useState(
    TOKENS.map((t) => ({ ...t, price: t.basePrice, change: 0, flash: "" }))
  );
  const [signals, setSignals] = useState<
    Array<{ pair: string; direction: "long" | "short"; confidence: number; source: string; id: number }>
  >([]);
  const [consensus, setConsensus] = useState({ grok: 78, claude: 85, perplexity: 72 });
  const [chartDrawn, setChartDrawn] = useState(false);
  const [paperBalance, setPaperBalance] = useState(10000);
  const [tradeLog, setTradeLog] = useState<string[]>([]);
  const sigId = useRef(0);
  const chartRef = useRef<HTMLDivElement>(null);

  // Live price ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.48) * p.basePrice * 0.0008;
          const price = +(
            Math.max(p.basePrice * 0.97, Math.min(p.basePrice * 1.03, p.price + delta))
          ).toFixed(2);
          const change = +((((price - p.basePrice) / p.basePrice) * 100).toFixed(2));
          return { ...p, price, change, flash: delta > 0 ? "up" : "down" };
        })
      );
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // Signal feed
  useEffect(() => {
    const add = () => {
      const s = SIGNAL_POOL[sigId.current % SIGNAL_POOL.length];
      sigId.current++;
      setSignals((prev) =>
        [
          {
            ...s,
            confidence: +(
              Math.max(0.5, Math.min(0.98, s.confidence + (Math.random() - 0.5) * 0.08))
            ).toFixed(2),
            id: sigId.current,
          },
          ...prev,
        ].slice(0, 5)
      );
    };
    add();
    const iv = setInterval(add, 5000);
    return () => clearInterval(iv);
  }, []);

  // Consensus fluctuation
  useEffect(() => {
    const iv = setInterval(() => {
      setConsensus((prev) => ({
        grok: +Math.max(40, Math.min(98, prev.grok + (Math.random() - 0.5) * 6)).toFixed(0),
        claude: +Math.max(40, Math.min(98, prev.claude + (Math.random() - 0.5) * 4)).toFixed(0),
        perplexity: +Math.max(40, Math.min(98, prev.perplexity + (Math.random() - 0.5) * 8)).toFixed(0),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // Chart reveal on scroll
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartDrawn(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const overallConsensus = Math.round((consensus.grok + consensus.claude + consensus.perplexity) / 3);

  // Paper trade simulation
  const paperTrade = (pair: string, direction: string) => {
    const gain = direction === "long"
      ? Math.round(Math.random() * 80 - 20)
      : Math.round(Math.random() * 80 - 40);
    setPaperBalance((prev) => prev + gain);
    setTradeLog((prev) =>
      [`${direction.toUpperCase()} ${pair} — P&L: ${gain >= 0 ? "+" : ""}$${gain}`, ...prev].slice(0, 4)
    );
  };

  // SVG chart
  const chartW = 600;
  const chartH = 180;
  const pad = 10;
  const pts = CHART_Y.map(
    (y, i) => `${pad + (i / (CHART_Y.length - 1)) * (chartW - pad * 2)},${y + pad}`
  );
  const linePath = `M ${pts.join(" L ")}`;
  const fillPath = `${linePath} L ${chartW - pad},${chartH} L ${pad},${chartH} Z`;

  const sectionLabel: React.CSSProperties = {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteNav />

      {/* Demo banner */}
      <div
        style={{
          padding: "8px 24px",
          background: "#f59e0b18",
          borderBottom: "1px solid #f59e0b44",
          textAlign: "center",
          fontSize: "12px",
          color: "#f59e0b",
        }}
      >
        <span className="interactive-badge" style={{ background: "transparent", border: "none", color: "#f59e0b", fontSize: "12px", padding: 0 }}>INTERACTIVE DEMO</span> — Simulated data for demonstration. Not real trading.
      </div>

      <main style={{ flex: 1, padding: "0 24px 48px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* ═══ HERO ═══ */}
          <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
            <h1
              className="gradient-text-animated"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "12px",
                background: "linear-gradient(135deg, #e2e8f0, #10b981, #3b82f6, #a855f7)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Experience the Engine
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "520px", margin: "0 auto" }}>
              Watch three AI models work in real-time. Simulated data &mdash; same architecture as production.
            </p>
          </section>

          {/* ═══ LIVE PRICE TICKER ═══ */}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={sectionLabel}>
              Live Price Feed
              <span
                className="animate-pulse"
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#10b981",
                  marginLeft: 8,
                  verticalAlign: "middle",
                }}
              />
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {prices.map((p) => (
                <div
                  key={p.symbol}
                  className="card-hover card-hover-lift"
                  style={{
                    padding: "20px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    borderTop: `3px solid ${p.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", fontSize: "16px", color: p.color }}>{p.symbol}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{p.name}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      transition: "color 0.3s",
                      color: p.flash === "up" ? "#10b981" : p.flash === "down" ? "#ef4444" : "var(--text-primary)",
                    }}
                  >
                    ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginTop: "4px",
                      color: p.change >= 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {p.change >= 0 ? "+" : ""}
                    {p.change.toFixed(2)}%
                    <span style={{ marginLeft: "4px" }}>{p.change >= 0 ? "\u25B2" : "\u25BC"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ AI CONSENSUS ═══ */}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={sectionLabel}>AI Model Consensus</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px",
                gap: "16px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <div>
                {([
                  { name: "Grok", value: consensus.grok, color: "#ef4444" },
                  { name: "Claude", value: consensus.claude, color: "#a855f7" },
                  { name: "Perplexity", value: consensus.perplexity, color: "#3b82f6" },
                ] as const).map((m) => (
                  <div key={m.name} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: m.color }}>{m.name}</span>
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{Math.round(m.value)}%</span>
                    </div>
                    <div style={{ height: "8px", background: "var(--bg-primary)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${m.value}%`,
                          background: m.color,
                          borderRadius: "4px",
                          transition: "width 0.8s ease",
                          boxShadow: `0 0 8px ${m.color}66`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: "1px solid var(--border-color)",
                  paddingLeft: "16px",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase" }}>
                  Overall
                </div>
                <div
                  className="neon-green"
                  style={{ fontSize: "42px", fontWeight: "bold", lineHeight: 1 }}
                >
                  {overallConsensus}%
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    marginTop: "8px",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    background:
                      overallConsensus > 75 ? "#10b98122" : overallConsensus > 60 ? "#f59e0b22" : "#ef444422",
                    color:
                      overallConsensus > 75 ? "#10b981" : overallConsensus > 60 ? "#f59e0b" : "#ef4444",
                  }}
                >
                  {overallConsensus > 75 ? "STRONG" : overallConsensus > 60 ? "MODERATE" : "WEAK"}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ SIGNAL FEED + CHART ═══ */}
          <ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
            {/* Signals */}
            <section>
              <h2 style={sectionLabel}>
                Signal Feed
                <span
                  className="cursor-blink"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 12,
                    background: "var(--accent-green)",
                    marginLeft: 8,
                    verticalAlign: "middle",
                  }}
                />
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {signals.map((s) => (
                  <div
                    key={s.id}
                    className="signal-enter"
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      borderLeft: `3px solid ${s.direction === "long" ? "#10b981" : "#ef4444"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: "13px" }}>{s.pair}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: s.direction === "long" ? "#10b98122" : "#ef444422",
                          color: s.direction === "long" ? "#10b981" : "#ef4444",
                          fontWeight: "bold",
                        }}
                      >
                        {s.direction === "long" ? "\u25B2 LONG" : "\u25BC SHORT"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.source}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: s.confidence >= 0.8 ? "#10b981" : s.confidence >= 0.7 ? "#f59e0b" : "#ef4444",
                        }}
                      >
                        {(s.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <button
                      onClick={() => paperTrade(s.pair, s.direction)}
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        padding: "6px",
                        background: "transparent",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        color: "var(--text-secondary)",
                        fontSize: "10px",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-green)";
                        e.currentTarget.style.color = "var(--accent-green)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      Paper Trade
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Chart + Paper Balance */}
            <section>
              <h2 style={sectionLabel}>Performance Chart (Simulated)</h2>
              <div
                ref={chartRef}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "12px",
                }}
              >
                <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Grid lines */}
                  {[0.25, 0.5, 0.75].map((pct) => (
                    <line
                      key={pct}
                      x1={pad}
                      y1={chartH * pct}
                      x2={chartW - pad}
                      y2={chartH * pct}
                      stroke="var(--border-color)"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {chartDrawn && (
                    <>
                      <path d={fillPath} fill="url(#chartGrad)" className="chart-fill-reveal" />
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        filter="url(#glow)"
                        className="chart-line-draw"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* Paper Balance */}
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                    Paper Balance
                  </span>
                  <span className="neon-green" style={{ fontSize: "22px", fontWeight: "bold" }}>
                    ${paperBalance.toLocaleString()}
                  </span>
                </div>
                {tradeLog.length > 0 && (
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                    {tradeLog.map((log, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "11px",
                          color: log.includes("+") ? "#10b981" : "#ef4444",
                          padding: "2px 0",
                        }}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          </ScrollReveal>

          {/* ═══ LIVE CANDLESTICK CHART ═══ */}
          <ScrollReveal>
          <LiveCandlestickChart />
          </ScrollReveal>

          {/* ═══ MARKET DEPTH CHART ═══ */}
          <ScrollReveal>
          <DepthChart />
          </ScrollReveal>

          {/* ═══ MODEL AGREEMENT MATRIX ═══ */}
          <ScrollReveal>
          <ModelAgreement />
          </ScrollReveal>

          {/* ═══ ORDER BOOK & NEURAL ACTIVITY ═══ */}
          <ScrollReveal>
          <OrderBookAndNeural />
          </ScrollReveal>

          {/* ═══ AI DEBATE ═══ */}
          <ScrollReveal>
          <AIDebate />
          </ScrollReveal>

          {/* ═══ CTA ═══ */}
          <section
            className="card-hover"
            style={{
              textAlign: "center",
              padding: "40px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>Ready to explore?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
              Open the terminal and start commanding the engine.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "var(--accent-green)",
                  color: "#000",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Open Terminal
              </Link>
              <Link
                href="/stack"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                View Full Stack
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
