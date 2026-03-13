"use client";

import { useMemo } from "react";
import type { Milestone } from "@/types";

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  total: number;
  progress: number; // global 0–1 journey progress
}

// Icon per milestone type
const TYPE_ICONS: Record<Milestone["type"], string> = {
  birth: "◎",
  career: "◈",
  award: "◆",
  exhibition: "◇",
  death: "○",
};

export default function MilestoneCard({
  milestone,
  index,
  total,
  progress,
}: MilestoneCardProps) {
  const cardProgress = index / (total - 1);

  const proximity = useMemo(() => {
    const dist = Math.abs(progress - cardProgress);
    return Math.max(0, 1 - dist * total * 0.6);
  }, [progress, cardProgress, total]);

  const isAbove = index % 2 === 0;
  const accent = lerpHex("#C4622D", "#7DAB8A", cardProgress);

  return (
    <div
      className="relative flex flex-col items-center z-20 transition-transform"
      style={{
        flexShrink: 0,
        marginTop: isAbove ? 0 : "clamp(120px,18vh,180px)",
        marginBottom: isAbove ? "clamp(120px,18vh,180px)" : 0,
        transform: `scale(${0.82 + proximity * 0.18})`,
        transition: "transform 0.3s ease",
      }}
    >
      {/* ── Connector line from card to rope ── */}
      <div
        className="w-[1px] transition-opacity"
        style={{
          height: "clamp(40px,6vh,64px)",
          background: `linear-gradient(to ${isAbove ? "bottom" : "top"}, ${accent}, rgba(196,98,45,0.1))`,
          order: isAbove ? 2 : 0,
          opacity: 0.5 + proximity * 0.5,
        }}
      />

      {/* ── Node dot on rope ── */}
      <div
        className="rounded-full flex-shrink-0 transition-all"
        style={{
          width: proximity > 0.5 ? "10px" : "6px",
          height: proximity > 0.5 ? "10px" : "6px",
          background: accent,
          border: `1px solid ${accent}`,
          boxShadow: proximity > 0.5 ? `0 0 12px ${accent}` : "none",
          order: isAbove ? 3 : 1,
          zIndex: 3,
          transition: "all 0.3s ease",
        }}
      />

      {/* ── Card ── */}
      <div
        className="rounded-[2px] backdrop-blur-sm"
        style={{
          order: isAbove ? 1 : 2,
          width: "clamp(220px,22vw,290px)",
          padding: "clamp(18px,2vw,26px)",
          background: `rgba(12,8,6,${0.55 + proximity * 0.35})`,
          border: `1px solid rgba(${hexToRgb(accent)},${0.15 + proximity * 0.25})`,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Type icon + year */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] transition-colors"
            style={{ color: accent }}
          >
            {TYPE_ICONS[milestone.type]}
          </span>
          <span
            className="font-serif leading-none"
            style={{
              fontSize: "clamp(20px,2.2vw,28px)",
              color: accent,
              letterSpacing: "-0.02em",
              transition: "color 0.3s ease",
            }}
          >
            {milestone.year}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-[Canela] font-normal text-[#F4EDE4] mb-2"
          style={{
            fontSize: "clamp(14px,1.4vw,18px)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          {milestone.title}
        </h3>

        {/* Description */}
        <p
          className="font-serif mb-3"
          style={{
            fontSize: "clamp(11px,0.95vw,13px)",
            color: "rgba(244,237,228,0.45)",
            lineHeight: 1.75,
            marginBottom: "14px",
          }}
        >
          {milestone.description}
        </p>

        {/* Location */}
        {milestone.location && (
          <div
            className="flex items-center gap-1.5 pt-3"
            style={{
              borderTop: `1px solid rgba(${hexToRgb(accent)},0.12)`,
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
              <circle cx="4" cy="4" r="3" stroke={accent} strokeWidth="0.8" />
              <circle cx="4" cy="4" r="1" fill={accent} />
            </svg>
            <span
              className="text-[9px] uppercase font-serif"
              style={{
                letterSpacing: "0.22em",
                color: `rgba(${hexToRgb(accent)},0.6)`,
                transition: "color 0.3s ease",
              }}
            >
              {milestone.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────
function lerpHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

function hexToRgb(hex: string): string {
  if (hex.startsWith("rgb")) return hex.replace(/rgb\(|\)/g, "");
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
