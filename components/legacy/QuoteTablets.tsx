"use client";

import { useEffect, useRef, useState } from "react";

interface QuoteTabletsProps {
  inView: boolean;
}

interface Quote {
  text: string;
  author: string;
  role: string;
}

const QUOTES: Quote[] = [
  {
    text: "She produced pots of outstanding quality. There was no doubt at all about that.",
    author: "Michael Cardew",
    role: "Studio potter & her mentor",
  },
  {
    text: "Ladi Kwali's work represents an important moment in the history of world ceramics — when two great traditions met and became something entirely new.",
    author: "Garth Clark",
    role: "Ceramic historian",
  },
  {
    text: "She had an understanding of form that was completely instinctive. She never measured anything. She never needed to.",
    author: "Kenneth Murray",
    role: "Arts administrator, Nigeria",
  },
];

export default function QuoteTablets({ inView }: QuoteTabletsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [textRevealed, setTextRevealed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeQuote = QUOTES[activeIndex];

  // Chisel-carve effect: reveal text character by character
  useEffect(() => {
    if (!inView) return;
    setTextRevealed(0);
    setIsAnimating(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setTextRevealed(i);
      if (i >= activeQuote.text.length) {
        clearInterval(intervalRef.current!);
        setIsAnimating(false);
      }
    }, 22);
    return () => clearInterval(intervalRef.current!);
  }, [inView, activeIndex, activeQuote.text.length]);

  const switchQuote = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    clearInterval(intervalRef.current!);
    setActiveIndex(index);
  };

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
      }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "clamp(24px,4vh,36px)",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(196,98,45,0.5))",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.38em",
            color: "rgba(196,98,45,0.5)",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
          }}
        >
          What They Said
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(24px,3vw,48px)",
          alignItems: "start",
        }}
      >
        {/* ── Tablet ── */}
        <div
          style={{
            position: "relative",
            padding: "clamp(28px,3vw,44px)",
            background: "#100A06",
            border: "1px solid rgba(196,98,45,0.18)",
            borderRadius: "3px",
            minHeight: "180px",
            overflow: "hidden",
          }}
        >
          {/* Clay texture lines */}
          {[20, 40, 60, 80].map((pct) => (
            <div
              key={pct}
              aria-hidden
              style={{
                position: "absolute",
                top: `${pct}%`,
                left: 0,
                right: 0,
                height: "1px",
                background: "rgba(196,98,45,0.04)",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Opening mark */}
          <div
            style={{
              fontFamily: "Canela, Georgia, serif",
              fontSize: "clamp(48px,5vw,72px)",
              color: "rgba(196,98,45,0.12)",
              lineHeight: 0.6,
              marginBottom: "16px",
              userSelect: "none",
            }}
            aria-hidden
          >
            &quot;
          </div>

          {/* Quote text — chisel reveal */}
          <blockquote
            style={{
              fontFamily: "Canela, Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(16px,1.7vw,22px)",
              color: "#F4EDE4",
              lineHeight: 1.55,
              margin: "0 0 24px",
              letterSpacing: "0.01em",
              position: "relative",
            }}
          >
            {/* Revealed text */}
            {activeQuote.text.slice(0, textRevealed)}
            {/* Blinking chisel cursor */}
            {isAnimating && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.1em",
                  background: "#C4622D",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "blink 0.5s step-end infinite",
                }}
              />
            )}
          </blockquote>

          {/* Attribution */}
          <div
            style={{
              opacity: textRevealed >= activeQuote.text.length ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "1px",
                  background: "rgba(196,98,45,0.4)",
                }}
              />
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "11px",
                  color: "#C4622D",
                  letterSpacing: "0.06em",
                }}
              >
                {activeQuote.author}
              </span>
            </div>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "10px",
                color: "rgba(244,237,228,0.3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0 0 0 32px",
              }}
            >
              {activeQuote.role}
            </p>
          </div>

          {/* Incised corner ornament */}
          <svg
            style={{ position: "absolute", bottom: "16px", right: "16px" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <polygon
              points="12,2 22,12 12,22 2,12"
              stroke="rgba(196,98,45,0.15)"
              strokeWidth="0.8"
            />
            <polygon
              points="12,6 18,12 12,18 6,12"
              stroke="rgba(196,98,45,0.1)"
              strokeWidth="0.6"
            />
          </svg>
        </div>

        {/* ── Quote selector ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "4px",
          }}
        >
          {QUOTES.map((q, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                onClick={() => switchQuote(i)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: isAnimating ? "not-allowed" : "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  opacity: isAnimating && !isActive ? 0.4 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Indicator */}
                <div
                  style={{
                    width: isActive ? "20px" : "6px",
                    height: "2px",
                    borderRadius: "1px",
                    background: isActive ? "#C4622D" : "rgba(196,98,45,0.25)",
                    flexShrink: 0,
                    transition: "all 0.4s ease",
                  }}
                />
                {/* Author name */}
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "10px",
                    color: isActive ? "#F4EDE4" : "rgba(244,237,228,0.3)",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s ease",
                  }}
                >
                  {q.author}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
