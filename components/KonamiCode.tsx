"use client";

import { useEffect, useState, useCallback } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function generateColumns(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const chars = Array.from(
      { length: 10 + Math.floor(Math.random() * 20) },
      () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    ).join("\n");
    return {
      id: i,
      left: `${(i / count) * 100}%`,
      chars,
      speed: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    };
  });
}

export default function KonamiCode() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [columns, setColumns] = useState<ReturnType<typeof generateColumns>>([]);

  const trigger = useCallback(() => {
    const cols = generateColumns(Math.min(40, Math.floor(window.innerWidth / 20)));
    setColumns(cols);
    setActive(true);
    setTimeout(() => setActive(false), 6000);
  }, []);

  useEffect(() => {
    let seq = 0;
    let resetTimer: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[seq]) {
        seq++;
        clearTimeout(resetTimer);
        setProgress(seq);
        resetTimer = setTimeout(() => {
          seq = 0;
          setProgress(0);
        }, 2000);

        if (seq === KONAMI.length) {
          seq = 0;
          setProgress(0);
          trigger();
        }
      } else {
        seq = 0;
        setProgress(0);
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      clearTimeout(resetTimer);
    };
  }, [trigger]);

  return (
    <>
      {/* Progress indicator during sequence input */}
      {progress > 0 && !active && (
        <div
          style={{
            position: "fixed",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            display: "flex",
            gap: "4px",
            padding: "6px 12px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
          }}
        >
          {KONAMI.map((_, i) => (
            <div
              key={i}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: i < progress ? "#10b981" : "var(--border-color)",
                transition: "background 0.15s ease",
                boxShadow: i < progress ? "0 0 6px #10b981" : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Matrix rain */}
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            pointerEvents: "none",
            overflow: "hidden",
            background: "rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Flash message */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(24px, 5vw, 48px)",
              fontWeight: "bold",
              color: "#10b981",
              textShadow: "0 0 30px #10b981, 0 0 60px #10b981",
              zIndex: 10001,
              animation: "fadeInUp 0.5s ease forwards",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            336
            <div style={{ fontSize: "clamp(12px, 2vw, 18px)", opacity: 0.7, marginTop: "8px" }}>
              THE SIGNAL
            </div>
          </div>

          {columns.map((col) => (
            <div
              key={col.id}
              className="matrix-column"
              style={{
                left: col.left,
                "--drop-speed": `${col.speed}s`,
                "--drop-delay": `${col.delay}s`,
              } as React.CSSProperties}
            >
              {col.chars}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
