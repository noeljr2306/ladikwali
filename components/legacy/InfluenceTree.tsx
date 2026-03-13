"use client";

import { useEffect, useState } from "react";

interface InfluenceTreeProps {
  inView: boolean;
}

interface TreeNode {
  name: string;
  role: string;
  tier: number;
  x: number;
  golden?: boolean;
}

// Data
const NODES: TreeNode[] = [
  { name: "Ladi Kwali", role: "Master Potter", tier: 0, x: 0.5 },
  {
    name: "Magdalene Odundo",
    role: "Ceramic Artist, UK/Kenya",
    tier: 1,
    x: 0.22,
    golden: true,
  },
  { name: "Abuja Pottery", role: "Nigeria's studio legacy", tier: 1, x: 0.5 },
  { name: "Michael Cardew", role: "Studio Pottery Movement", tier: 1, x: 0.78 },
  { name: "Clary Illian", role: "American potter", tier: 2, x: 0.1 },
  { name: "Tani Lasisi", role: "Nigerian ceramicist", tier: 2, x: 0.3 },
  { name: "Kwali Centre", role: "Training potters, today", tier: 2, x: 0.5 },
  { name: "Seth Cardew", role: "Studio potter, UK", tier: 2, x: 0.7 },
  { name: "Svend Bayer", role: "Studio potter, UK", tier: 2, x: 0.9 },
];

// Map tier to y-position (percentage of SVG height)
const TIER_Y: Record<number, number> = { 0: 10, 1: 50, 2: 90 };

export default function InfluenceTree({ inView }: InfluenceTreeProps) {
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDrawn(i);
      if (i >= NODES.length) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div
      className={`relative h-full transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 justify-center">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-terracotta/40" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-terracotta/60 font-sohne">
          The Lineage of Clay
        </span>
      </div>

      {/* SVG Tree */}
      <div className="relative flex justify-center w-full">
        <svg
          viewBox="0 0 100 120"
          className="w-full max-w-xl h-[550px] overflow-visible"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Paths */}
          {NODES.filter((n) => n.tier > 0).map((node) => {
            const nodeIndex = NODES.indexOf(node);
            if (nodeIndex >= drawn) return null;

            const parent =
              node.tier === 1
                ? NODES[0]
                : NODES.filter((n) => n.tier === 1).reduce((a, b) =>
                    Math.abs(b.x - node.x) < Math.abs(a.x - node.x) ? b : a,
                  );

            const x1 = parent.x * 100;
            const y1 = TIER_Y[parent.tier];
            const x2 = node.x * 100;
            const y2 = TIER_Y[node.tier];

            const pathData = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;

            return (
              <path
                key={`path-${node.name}`}
                d={pathData}
                fill="none"
                stroke={
                  node.golden ? "var(--color-naira)" : "var(--color-terracotta)"
                }
                strokeWidth={node.golden ? "0.4" : "0.2"}
                strokeOpacity={node.golden ? 0.8 : 0.3}
                strokeDasharray={node.golden ? undefined : "100"}
                strokeDashoffset={inView ? 0 : 100}
                style={{
                  transition: "stroke-dashoffset 1.5s ease",
                }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            if (i >= drawn) return null;
            return (
              <circle
                key={`circle-${node.name}`}
                cx={node.x * 100}
                cy={TIER_Y[node.tier]}
                r={node.tier === 0 ? 1.5 : 0.8}
                fill={
                  node.golden ? "var(--color-naira)" : "var(--color-kaolin)"
                }
                filter={
                  node.golden || node.tier === 0 ? "url(#glow)" : undefined
                }
              />
            );
          })}

          {/* Labels */}
          {NODES.map((node, i) => {
            if (i >= drawn) return null;
            const cx = node.x * 100;
            const cy = TIER_Y[node.tier];
            return (
              <g key={`label-${node.name}`}>
                <text
                  x={cx}
                  y={node.tier === 0 ? cy - 4 : cy + 6}
                  textAnchor="middle"
                  fill={
                    node.golden ? "var(--color-naira)" : "var(--color-kaolin)"
                  }
                  fontSize={node.tier === 0 ? "4" : "2.8"}
                  fontFamily="Canela, Georgia, serif"
                  dominantBaseline={node.tier === 0 ? "auto" : "hanging"}
                >
                  {node.name}
                </text>
                {node.tier < 2 && (
                  <text
                    x={cx}
                    y={node.tier === 0 ? cy - 1 : cy + 10}
                    textAnchor="middle"
                    fill="rgba(244,237,228,0.3)"
                    fontSize="2"
                    fontFamily="var(--font-sans)"
                    dominantBaseline="hanging"
                  >
                    {node.role}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 items-center bg-kiln/40 px-4 py-2 rounded-full border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-naira shadow-[0_0_5px_var(--color-naira)]" />
          <span className="text-[8px] font-sohne uppercase tracking-tighter text-kaolin/40">
            Notable Influence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-[1px] bg-terracotta/40 border-t border-dashed" />
          <span className="text-[8px] font-sohne uppercase tracking-tighter text-kaolin/40">
            Legacy Line
          </span>
        </div>
      </div>
    </div>
  );
}
