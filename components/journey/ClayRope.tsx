"use client";

import { useMemo } from "react";

interface ClayRopeProps {
  count: number; // number of milestones
  progress: number; // 0–1 scroll progress
}

export default function ClayRope({ count, progress }: ClayRopeProps) {
  const CARD_WIDTH = 290;
  const CARD_GAP = 88;
  const PADDING = 140;

  // Total rope width matches the scroll track
  const totalWidth = useMemo(
    () => PADDING * 2 + count * CARD_WIDTH + (count - 1) * CARD_GAP,
    [count],
  );

  // How far along the rope is revealed (0 → full width)
  const revealedWidth = progress * totalWidth;

  // Build a wavy SVG path for the rope
  const pathD = useMemo(() => {
    const segments = count * 4;
    const segW = totalWidth / segments;
    const amp = 6; // wave amplitude px
    let d = `M 0 0`;
    for (let i = 0; i <= segments; i++) {
      const x = i * segW;
      const sign = i % 2 === 0 ? 1 : -1;
      const y = sign * amp;
      if (i === 0) {
        d += ` L ${x} ${y}`;
      } else {
        const cpx = x - segW / 2;
        d += ` Q ${cpx} ${sign * -amp} ${x} ${y}`;
      }
    }
    return d;
  }, [totalWidth, count]);

  const ropeLen = totalWidth * 1.05; // approx path length

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: totalWidth,
        height: "40px",
        overflow: "visible",
        zIndex: 1,
        pointerEvents: "none",
      }}
      viewBox={`0 -20 ${totalWidth} 40`}
      preserveAspectRatio="none"
    >
      {/* ── Track (unrevealed) ── */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(196,98,45,0.1)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* ── Revealed rope — fills with scroll ── */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#ropeGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: ropeLen,
          strokeDashoffset: ropeLen - revealedWidth * 1.05,
          transition: "stroke-dashoffset 0.08s linear",
        }}
      />

      {/* ── Glowing tip at progress point ── */}
      <circle
        cx={revealedWidth}
        cy={0}
        r={4}
        fill="#C4622D"
        style={{
          filter: "drop-shadow(0 0 6px rgba(196,98,45,0.8))",
          opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <defs>
        {/* Rope color gradient: terracotta → celadon */}
        <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B2500" />
          <stop offset="45%" stopColor="#C4622D" />
          <stop offset="100%" stopColor="#7DAB8A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
