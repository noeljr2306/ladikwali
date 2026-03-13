"use client";

import { useState } from "react";

interface ToolHoverProps {
  progress: number;
}

interface Tool {
  name: string;
  desc: string;
  stage: number; // unlocks at this stage (0–5)
  icon: React.ReactNode;
  action: string; // ghost animation description
}

const TOOLS: Tool[] = [
  {
    name: "Hands",
    desc: "The primary tool. Coils are formed by rolling clay between both palms.",
    stage: 0,
    action: "Rolling...",
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <path
          d="M8,24 Q6,18 8,10 Q9,6 12,6 L12,18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M12,8 Q13,5 16,5 L16,20"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M16,8 Q17,5 20,5 L20,20"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M20,9 Q21,6 24,7 L24,20 Q24,26 16,28 Q8,28 8,24"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Wooden Beater",
    desc: "A flat paddle used to consolidate the walls and even out thickness.",
    stage: 1,
    action: "Tapping...",
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <rect
          x="4"
          y="12"
          width="18"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="22"
          y1="16"
          x2="30"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Smoothing Stone",
    desc: "A rounded river stone or gourd pressed against the walls to erase coil seams.",
    stage: 2,
    action: "Smoothing...",
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <ellipse
          cx="16"
          cy="16"
          rx="10"
          ry="8"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M10,14 Q16,10 22,14"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    name: "Incising Tool",
    desc: "A pointed stick or bone used to etch geometric and animal motifs into leather-hard clay.",
    stage: 3,
    action: "Etching...",
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <line
          x1="6"
          y1="26"
          x2="24"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="24" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6,26 L4,30 L8,28 Z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: "Kaolin Slip",
    desc: "A liquid white clay brushed over the surface before firing, creating a pale ground for the glaze.",
    stage: 4,
    action: "Applying slip...",
    icon: (
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <path
          d="M8,8 Q10,4 12,8 Q14,12 16,8 Q18,4 20,8 Q22,12 24,8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <rect
          x="10"
          y="16"
          width="12"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="16"
          y1="12"
          x2="16"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
];

export default function ToolHover({ progress }: ToolHoverProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const currentStage = Math.floor(progress * 6);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p
        style={{
          fontSize: "9px",
          letterSpacing: "0.38em",
          color: "rgba(196,98,45,0.45)",
          textTransform: "uppercase",
          fontFamily: "Georgia, serif",
          marginBottom: "6px",
        }}
      >
        Her Tools
      </p>

      {TOOLS.map((tool, i) => {
        const unlocked = currentStage >= tool.stage;
        const isHovered = hovered === i;

        return (
          <div
            key={tool.name}
            onMouseEnter={() => unlocked && setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "2px",
              border: `1px solid rgba(196,98,45,${unlocked ? (isHovered ? 0.4 : 0.14) : 0.05})`,
              background: isHovered
                ? "rgba(196,98,45,0.07)"
                : "rgba(12,8,6,0.4)",
              cursor: unlocked ? "pointer" : "default",
              opacity: unlocked ? 1 : 0.25,
              transform: isHovered ? "translateX(4px)" : "translateX(0)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Icon */}
            <div
              style={{
                color: isHovered ? "#C4622D" : "rgba(244,237,228,0.45)",
                flexShrink: 0,
                marginTop: "1px",
                transition: "color 0.3s ease",
              }}
            >
              {tool.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "12px",
                    color: isHovered ? "#F4EDE4" : "rgba(244,237,228,0.65)",
                    letterSpacing: "0.04em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {tool.name}
                </span>
                {/* Ghost action label */}
                {isHovered && (
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#C4622D",
                      letterSpacing: "0.2em",
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      animation: "ghostPulse 1s ease-in-out infinite",
                    }}
                  >
                    {tool.action}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "11px",
                  color: "rgba(244,237,228,0.35)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {tool.desc}
              </p>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes ghostPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
