"use client";

import { useEffect, useRef, useState } from "react";
import GlobeMap from "./GlobeMap";
import InfluenceTree from "./InfluenceTree";
import QuoteTablets from "./QuoteTablets";

export default function LegacySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.08 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh", background: "#0C0806" }}
    >
      {/* ── Grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.045,
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* ── Celadon ambient glow — bottom left ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          left: "-5%",
          width: "50vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse at bottom left, rgba(125,171,138,0.07) 0%, transparent 65%)",
          zIndex: 1,
        }}
      />

      <div
        className="relative"
        style={{
          zIndex: 2,
          padding: "clamp(56px,8vh,96px) clamp(80px,10vw,140px)",
        }}
      >
        {/* ── Section label ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "clamp(40px,6vh,64px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(196,98,45,0.5))",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.42em",
              color: "rgba(196,98,45,0.55)",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            06 — The Legacy
          </span>
        </div>

        {/* ── Hero heading ── */}
        <div
          style={{
            marginBottom: "clamp(48px,7vh,80px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
          }}
        >
          <h2
            style={{
              fontFamily: "Canela, Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 5vw, 72px)",
              color: "#F4EDE4",
              lineHeight: 1.0,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            She lives on
            <br />
            <em style={{ color: "#7DAB8A", fontStyle: "italic" }}>
              in every vessel.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(12px,1.1vw,15px)",
              color: "rgba(244,237,228,0.4)",
              lineHeight: 1.8,
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Ladi Kwali&apos;s legacy stretches across five continents, permanent
            museum collections, national currency, and a generation of ceramic
            artists she never knew she taught.
          </p>
        </div>

        {/* ── Row 1: Globe + Influence tree ── */}
        <div
          style={{
            display: "flex",
            gap: "clamp(32px, 4vw, 56px)",
            overflow: "hidden",
            marginBottom: "clamp(48px, 7vh, 80px)",
          }}
        >
          <div
            style={{
              flex: "1 1 0%",
              height: "clamp(400px, 60vh, 550px)",
              minWidth: 0,
            }}
          >
            <GlobeMap inView={inView} />
          </div>
          <div
            style={{
              flex: "1 1 0%",
              height: "clamp(400px, 60vh, 550px)",
              minWidth: 0,
            }}
          >
            <InfluenceTree inView={inView} />
          </div>
        </div>

        {/* ── Row 2: Quote tablets ── */}
        <QuoteTablets inView={inView} />

        {/* ── Final closer ── */}
        <Closer inView={inView} />
      </div>
    </div>
  );
}

// ── Site closer / sign-off ───────────────────────────────────
function Closer({ inView }: { inView: boolean }) {
  return (
    <div
      style={{
        marginTop: "clamp(64px, 10vh, 100px)",
        paddingTop: "clamp(40px, 6vh, 64px)",
        borderTop: "1px solid rgba(196,98,45,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
        opacity: inView ? 1 : 0,
        transition: "opacity 1s ease 1s",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "Canela, Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(18px, 2vw, 26px)",
            color: "rgba(244,237,228,0.6)",
            margin: "0 0 6px",
          }}
        >
          Ladi Kwali
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.28em",
            color: "rgba(196,98,45,0.4)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          c. 1925 — 1984 · Kwali, Nigeria
        </p>
      </div>

      {/* Decorative motif */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        opacity="0.25"
        aria-hidden
      >
        <polygon
          points="24,2 46,13 46,35 24,46 2,35 2,13"
          stroke="#C4622D"
          strokeWidth="0.8"
          fill="none"
        />
        <polygon
          points="24,8 40,17 40,31 24,40 8,31 8,17"
          stroke="#C4622D"
          strokeWidth="0.5"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r="4"
          stroke="#C4622D"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "transparent",
          border: "1px solid rgba(196,98,45,0.25)",
          borderRadius: "2px",
          color: "rgba(244,237,228,0.35)",
          fontSize: "9px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          padding: "10px 20px",
          cursor: "pointer",
          transition: "border-color 0.3s ease, color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(196,98,45,0.6)";
          e.currentTarget.style.color = "#F4EDE4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(196,98,45,0.25)";
          e.currentTarget.style.color = "rgba(244,237,228,0.35)";
        }}
      >
        ↑ Return to top
      </button>
    </div>
  );
}
