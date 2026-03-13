"use client";

import { useEffect, useState } from "react";

interface InfluenceTreeProps {
  inView: boolean;
}

interface TreeNode {
  name: string;
  role: string;
  tier: number; // 0 = root, 1 = direct, 2 = extended
  x: number; // 0–1 normalized
  golden?: boolean;
}

const NODES: TreeNode[] = [
  // Root
  { name: "Ladi Kwali", role: "Master Potter", tier: 0, x: 0.5, golden: false },
  // Direct influence
  {
    name: "Magdalene Odundo",
    role: "Ceramic Artist, UK/Kenya",
    tier: 1,
    x: 0.22,
    golden: true,
  },
  { name: "Abuja Pottery", role: "Nigeria's studio legacy", tier: 1, x: 0.5 },
  { name: "Michael Cardew", role: "Studio Pottery Movement", tier: 1, x: 0.78 },
  // Extended
  { name: "Clary Illian", role: "American potter", tier: 2, x: 0.1 },
  { name: "Tani Lasisi", role: "Nigerian ceramicist", tier: 2, x: 0.3 },
  { name: "Kwali Centre", role: "Training potters, today", tier: 2, x: 0.5 },
  { name: "Seth Cardew", role: "Studio potter, UK", tier: 2, x: 0.7 },
  { name: "Svend Bayer", role: "Studio potter, UK", tier: 2, x: 0.9 },
];

const TIER_Y: Record<number, number> = { 0: 0, 1: 42, 2: 88 }; // % from top

export default function InfluenceTree({ inView }: InfluenceTreeProps) {
  const [drawn, setDrawn] = useState(0); // number of branches drawn

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDrawn(i);
      if (i >= NODES.length) clearInterval(t);
    }, 200);
    return () => clearInterval(t);
  }, [inView]);

  const W = 100; // percentage units
  const TIERS = [0, 1, 2];

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
      }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
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
          Her Influence
        </span>
      </div>

      {/* Tree */}
      <div
        style={{
          position: "relative",
          padding: "24px 0 32px",
          borderRadius: "4px",
          border: "1px solid rgba(196,98,45,0.1)",
          background: "rgba(12,8,6,0.6)",
        }}
      >
        <svg
          viewBox="0 0 100 110"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", overflow: "visible" }}
        >
          {/* Branch lines */}
          {NODES.filter((n) => n.tier > 0).map((node, i) => {
            const nodeIndex = NODES.indexOf(node);
            if (nodeIndex >= drawn) return null;

            // Connect to parent
            const parentTier = node.tier - 1;
            let parentX = 0.5; // default to root
            if (node.tier === 2) {
              // Find closest tier-1 parent
              const tier1 = NODES.filter((n) => n.tier === 1);
              const closest = tier1.reduce((a, b) =>
                Math.abs(b.x - node.x) < Math.abs(a.x - node.x) ? b : a,
              );
              parentX = closest.x;
            }

            const x1 = parentX * 100;
            const y1 = TIER_Y[parentTier] + 8;
            const x2 = node.x * 100;
            const y2 = TIER_Y[node.tier];

            return (
              <line
                key={node.name}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={node.golden ? "#D4A843" : "rgba(196,98,45,0.25)"}
                strokeWidth={node.golden ? "0.6" : "0.4"}
                strokeDasharray={node.golden ? "none" : "1.5 1.5"}
                style={{
                  strokeDashoffset: 0,
                  animation: `drawLine 0.4s ease forwards`,
                }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            if (i >= drawn) return null;
            const cx = node.x * 100;
            const cy = TIER_Y[node.tier] + 4;

            return (
              <g key={node.name}>
                {/* Node circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={node.tier === 0 ? 4 : node.golden ? 3 : 2}
                  fill={
                    node.tier === 0
                      ? "#C4622D"
                      : node.golden
                        ? "#D4A843"
                        : "rgba(196,98,45,0.5)"
                  }
                  stroke={
                    node.tier === 0
                      ? "#F4EDE4"
                      : node.golden
                        ? "#F4EDE4"
                        : "none"
                  }
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Labels — rendered as HTML for readability */}
        <div
          style={{
            position: "absolute",
            inset: "24px 0 32px",
            pointerEvents: "none",
          }}
        >
          {NODES.map((node, i) => {
            if (i >= drawn) return null;
            const left = `${node.x * 100}%`;
            const topPct = TIER_Y[node.tier];
            // Shift Y to align with SVG node
            const top = `calc(${topPct}% + ${node.tier === 0 ? 0 : 12}px)`;

            return (
              <div
                key={node.name}
                style={{
                  position: "absolute",
                  left,
                  top,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  width: "80px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: node.tier === 0 ? "10px" : "9px",
                    color:
                      node.tier === 0
                        ? "#F4EDE4"
                        : node.golden
                          ? "#D4A843"
                          : "rgba(244,237,228,0.5)",
                    fontWeight: node.tier === 0 ? 500 : 400,
                    lineHeight: 1.3,
                    margin: "0 0 2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {node.name}
                </p>
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "8px",
                    color: "rgba(244,237,228,0.25)",
                    margin: 0,
                    lineHeight: 1.3,
                    display: node.tier === 2 ? "none" : "block",
                  }}
                >
                  {node.role}
                </p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#D4A843",
              }}
            />
            <span
              style={{
                fontSize: "8px",
                color: "rgba(244,237,228,0.3)",
                fontFamily: "Georgia, serif",
              }}
            >
              Most notable influence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
