"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface FeedEvent {
  id: number;
  source: string;
  color: string;
  message: string;
  time: string;
  fading: boolean;
}

const EVENT_TEMPLATES = [
  { source: "Grok", color: "#ef4444", messages: [
    "RSI divergence detected on BTC/USDT",
    "Sentiment spike: 340 mentions in 5m",
    "Breakout pattern forming on ETH/USDT",
    "X feed anomaly: SOL volume surge",
    "Momentum shift detected on AVAX",
    "Social signal: whale alert BTC",
    "Trend reversal signal on ETH",
    "Volume anomaly on SOL/USDT",
  ]},
  { source: "Claude", color: "#a855f7", messages: [
    "Risk model updated: R:R 2.4:1",
    "Analyzing on-chain data...",
    "Confidence adjusted to 79%",
    "Position sizing: 2.1% of portfolio",
    "Correlation check: low BTC dependency",
    "Drawdown risk: within tolerance",
    "Strategy backtest: +12.3% 30d",
    "Portfolio heat: 34% allocated",
  ]},
  { source: "Perplexity", color: "#3b82f6", messages: [
    "No negative catalysts found",
    "Checking regulatory news...",
    "Research confidence: 82%",
    "Fed meeting in 48h — monitoring",
    "Whale movement: 2,400 BTC to cold storage",
    "ETH staking yields stable at 3.8%",
    "No exchange outage reports",
    "Market structure: healthy order books",
  ]},
  { source: "Engine", color: "#10b981", messages: [
    "Consensus reached: 3/3 LONG BTC",
    "Paper trade executed: LONG BTC +0.4%",
    "Signal quality: 4.2/5",
    "Circuit breaker: all clear",
    "Daily P&L: +1.23%",
    "Portfolio rebalance queued",
    "RiskGuard: no anomalies",
    "Leaderboard updated",
  ]},
];

function getNZTime(): string {
  return new Date().toLocaleTimeString("en-NZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Pacific/Auckland",
  });
}

let eventCounter = 0;

function generateEvent(): FeedEvent {
  const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
  const message = template.messages[Math.floor(Math.random() * template.messages.length)];
  return {
    id: ++eventCounter,
    source: template.source,
    color: template.color,
    message,
    time: getNZTime(),
    fading: false,
  };
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const addEvent = useCallback(() => {
    const evt = generateEvent();
    setEvents((prev) => {
      const next = [evt, ...prev].slice(0, 6);
      return next;
    });

    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, fading: true } : e))
      );
    }, 7000);

    setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== evt.id));
    }, 7500);
  }, []);

  useEffect(() => {
    const initial = generateEvent();
    setEvents([initial]);

    timerRef.current = setInterval(() => {
      addEvent();
    }, 3500 + Math.random() * 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [addEvent]);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        aria-label="Show activity feed"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 100,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          color: "var(--accent-green)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="animate-pulse">{"●"}</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 100,
        width: minimized ? "auto" : "min(320px, 85vw)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: minimized ? "8px" : "8px 8px 0 0",
          fontSize: "10px",
          color: "var(--text-secondary)",
          cursor: "pointer",
        }}
        onClick={() => setMinimized((m) => !m)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            className="energy-pulse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
            }}
          />
          <span style={{ textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "bold" }}>
            Live Feed
          </span>
        </span>
        <span style={{ display: "flex", gap: "6px" }}>
          <span>{minimized ? "▲" : "▼"}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
            }}
            aria-label="Hide activity feed"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "11px",
              padding: 0,
            }}
          >
            x
          </button>
        </span>
      </div>

      {/* Events list */}
      {!minimized && (
        <div
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
            maxHeight: "240px",
          }}
        >
          {events.length === 0 && (
            <div style={{ padding: "16px", textAlign: "center", fontSize: "11px", color: "var(--text-secondary)" }}>
              Listening for signals...
            </div>
          )}
          {events.map((evt) => (
            <div
              key={evt.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                padding: "8px 10px",
                borderBottom: "1px solid var(--border-color)",
                animation: evt.fading
                  ? "feedItemOut 0.5s ease forwards"
                  : "feedItemIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                fontSize: "11px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: evt.color,
                  marginTop: "4px",
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${evt.color}44`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1px" }}>
                  <span style={{ fontWeight: "bold", color: evt.color, fontSize: "10px" }}>
                    {evt.source}
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "9px", opacity: 0.6 }}>
                    {evt.time}
                  </span>
                </div>
                <div style={{ color: "var(--text-secondary)", lineHeight: "1.3" }}>
                  {evt.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
