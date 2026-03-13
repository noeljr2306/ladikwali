"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToBuild from "./ScrollToBuild";
import ToolHover from "./ToolHover";
import PatternLab from "./PatternLab";

gsap.registerPlugin(ScrollTrigger);

export default function CraftSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [buildProgress, setBuildProgress] = useState(0); // 0–1
  const [inView, setInView] = useState(false);

  // Drive build progress with scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: false,
        scrub: true,
        onUpdate: (self) => setBuildProgress(self.progress),
        onEnter: () => setInView(true),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{
        // Taller than 100vh — scroll consumed by build animation
        minHeight: "280dvh",
        background: "#0C0806",
      }}
    >
      {/* ── Sticky viewport — stays in view while section scrolls ── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100dvh" }}
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

        {/* ── Kiln glow — intensifies as pot nears completion ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(ellipse 60% 50% at 50% 100%,
            rgba(180,60,10,${buildProgress * 0.22}) 0%,
            transparent 70%)`,
            transition: "background 0.2s ease",
          }}
        />

        {/* ── Section label ── */}
        <div
          style={{
            position: "absolute",
            top: "clamp(32px,5vh,52px)",
            left: "clamp(80px,10vw,140px)",
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease",
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
            04 — The Craft
          </span>
        </div>

        {/* ── Main layout: pot centre, tools right, lab below ── */}
        <div
          className="w-full h-full flex flex-col"
          style={{ zIndex: 2, position: "relative" }}
        >
          {/* Top half — pot + tools */}
          <div
            className="flex items-center justify-center"
            style={{
              flex: "1 1 auto",
              gap: "clamp(40px,6vw,100px)",
              padding: "0 clamp(80px,10vw,140px)",
            }}
          >
            {/* Left — heading + stage label */}
            <div style={{ flex: "0 0 auto", width: "clamp(200px,22vw,300px)" }}>
              <StageLabel progress={buildProgress} inView={inView} />
            </div>

            {/* Centre — the pot being built */}
            <div style={{ flex: "0 0 auto" }}>
              <ScrollToBuild progress={buildProgress} />
            </div>

            {/* Right — tool hover cards */}
            <div style={{ flex: "0 0 auto", width: "clamp(160px,18vw,240px)" }}>
              <ToolHover progress={buildProgress} />
            </div>
          </div>

          {/* Bottom — pattern lab */}
          <div
            style={{
              flex: "0 0 auto",
              padding: "0 clamp(80px,10vw,140px) clamp(32px,5vh,56px)",
              opacity: buildProgress > 0.75 ? 1 : 0,
              transform:
                buildProgress > 0.75 ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <PatternLab />
          </div>
        </div>

        {/* ── Scroll progress bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            zIndex: 5,
            background: "rgba(196,98,45,0.08)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${buildProgress * 100}%`,
              background: "linear-gradient(to right, #8B2500, #C4622D)",
              transition: "width 0.05s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Stage label — updates with build progress ────────────────
const STAGES = [
  {
    range: [0, 0.16],
    label: "01 — The Base",
    desc: "A flat disc of clay. Every pot begins here — pressed by hand onto a smooth surface.",
  },
  {
    range: [0.16, 0.33],
    label: "02 — First Coil",
    desc: "Long ropes of clay are rolled between the palms and laid in circles, one upon another.",
  },
  {
    range: [0.33, 0.5],
    label: "03 — Building Walls",
    desc: "Coils stack and are pinched together. The walls begin to rise, thin and even.",
  },
  {
    range: [0.5, 0.67],
    label: "04 — Smoothing",
    desc: "A wet gourd or stone smooths the inner and outer walls, erasing the coil seams.",
  },
  {
    range: [0.67, 0.82],
    label: "05 — Incising",
    desc: "Scorpions, lizards, and geometric bands are etched into the leather-hard clay with a pointed tool.",
  },
  {
    range: [0.82, 1.0],
    label: "06 — Firing",
    desc: "The pot enters the kiln. Hours later it emerges transformed — hard, resonant, permanent.",
  },
];

function StageLabel({
  progress,
  inView,
}: {
  progress: number;
  inView: boolean;
}) {
  const stage =
    STAGES.find((s) => progress >= s.range[0] && progress < s.range[1]) ??
    STAGES[STAGES.length - 1];

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.8s ease 0.2s",
      }}
    >
      <h2
        style={{
          fontFamily: "Canela, Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(28px, 3.2vw, 44px)",
          color: "#F4EDE4",
          lineHeight: 1.1,
          margin: "0 0 16px",
          letterSpacing: "-0.01em",
        }}
      >
        The
        <br />
        <em style={{ color: "#C4622D", fontStyle: "italic" }}>
          Coil Technique
        </em>
      </h2>

      {/* Stage indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "1px",
            background: "rgba(196,98,45,0.4)",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.38em",
            color: "#C4622D",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            transition: "all 0.4s ease",
          }}
        >
          {stage.label}
        </span>
      </div>

      <p
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(12px, 1.05vw, 14px)",
          color: "rgba(244,237,228,0.45)",
          lineHeight: 1.8,
          margin: 0,
          maxWidth: "280px",
          transition: "opacity 0.4s ease",
        }}
      >
        {stage.desc}
      </p>

      {/* Stage dots */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "24px",
        }}
      >
        {STAGES.map((s, i) => {
          const active = progress >= s.range[0] && progress < s.range[1];
          const done = progress >= s.range[1];
          return (
            <div
              key={i}
              style={{
                width: active ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: done || active ? "#C4622D" : "rgba(196,98,45,0.2)",
                transition: "all 0.4s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
