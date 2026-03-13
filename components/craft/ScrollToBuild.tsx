"use client";

import { useMemo } from "react";

interface ScrollToBuildProps {
  progress: number; // 0–1
}

// How many coils visible at each progress threshold
// progress 0→1 maps across 6 build stages
const MAX_COILS = 8;

export default function ScrollToBuild({ progress }: ScrollToBuildProps) {
  const stage = Math.floor(progress * 6); // 0–5

  // Coil count grows with progress
  const coilCount = useMemo(() => Math.round(progress * MAX_COILS), [progress]);

  // Pot width / height grow as coils stack
  const potWidth = 80 + progress * 90; // 80px → 170px
  const potHeight = 20 + progress * 180; // 20px → 200px

  // Neck appears after stage 3
  const neckOpacity = Math.max(0, (progress - 0.5) * 2);

  // Incision marks appear in stage 5
  const incisionOpacity = Math.max(0, (progress - 0.67) / 0.15);

  // Glaze / firing glow in stage 6
  const glowIntensity = Math.max(0, (progress - 0.82) / 0.18);

  // Clay color: raw grey-brown → terracotta → fired celadon
  const clayColor =
    progress < 0.82
      ? lerpHex("#6B3A2A", "#C4622D", Math.min(progress / 0.82, 1))
      : lerpHex("#C4622D", "#7DAB8A", (progress - 0.82) / 0.18);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "clamp(280px, 38vh, 420px)",
        width: "clamp(200px, 22vw, 280px)",
      }}
    >
      {/* ── Kiln glow behind pot ── */}
      {glowIntensity > 0 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: `${potWidth * 2}px`,
            height: `${potHeight}px`,
            background: `radial-gradient(ellipse at bottom, rgba(255,120,30,${glowIntensity * 0.5}) 0%, transparent 70%)`,
            pointerEvents: "none",
            borderRadius: "50%",
            filter: "blur(12px)",
            transition: "all 0.3s ease",
          }}
        />
      )}

      {/* ── Pot SVG ── */}
      <svg
        viewBox={`0 0 200 240`}
        width={200}
        height={240}
        style={{ overflow: "visible", position: "relative", zIndex: 2 }}
      >
        <defs>
          <radialGradient id="potGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor={lighten(clayColor, 0.3)} />
            <stop offset="50%" stopColor={clayColor} />
            <stop offset="100%" stopColor={darken(clayColor, 0.4)} />
          </radialGradient>
          <radialGradient id="potShine" cx="30%" cy="28%" r="35%">
            <stop offset="0%" stopColor="rgba(255,220,180,0.18)" />
            <stop offset="100%" stopColor="rgba(255,220,180,0)" />
          </radialGradient>
          {glowIntensity > 0 && (
            <filter id="glow">
              <feGaussianBlur
                stdDeviation={glowIntensity * 4}
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* ── Shadow ── */}
        <ellipse
          cx="100"
          cy="238"
          rx={potWidth * 0.42}
          ry={6 + progress * 4}
          fill="rgba(0,0,0,0.35)"
          style={{ transition: "all 0.3s ease" }}
        />

        {/* ── Base disc ── */}
        {progress > 0 && (
          <ellipse
            cx="100"
            cy={220}
            rx={potWidth * 0.5}
            ry={10}
            fill={darken(clayColor, 0.3)}
            style={{ transition: "all 0.3s ease" }}
          />
        )}

        {/* ── Coils stacking ── */}
        {Array.from({ length: coilCount }).map((_, i) => {
          const coilProgress = i / MAX_COILS;
          // Coils narrow as they rise (pot silhouette)
          const coilWidth =
            potWidth *
            (i < MAX_COILS * 0.5
              ? 0.5 + coilProgress * 0.5 // widening phase
              : 1 - (coilProgress - 0.5) * 0.6); // narrowing toward neck
          const y = 220 - i * (potHeight / MAX_COILS);

          return (
            <g key={i} style={{ transition: "all 0.25s ease" }}>
              {/* Coil body */}
              <ellipse
                cx="100"
                cy={y}
                rx={coilWidth * 0.5}
                ry={10}
                fill="url(#potGrad)"
              />
              {/* Coil seam line — smoothed out after stage 3 */}
              {progress < 0.5 && (
                <ellipse
                  cx="100"
                  cy={y}
                  rx={coilWidth * 0.5}
                  ry={10}
                  fill="none"
                  stroke={darken(clayColor, 0.25)}
                  strokeWidth="0.8"
                  opacity={0.4 * (1 - (progress - 0.33) / 0.17)}
                />
              )}
            </g>
          );
        })}

        {/* ── Pot body fill (smooth walls after stage 3) ── */}
        {progress > 0.33 && (
          <path
            d={buildPotPath(potWidth, potHeight)}
            fill="url(#potGrad)"
            style={{ transition: "d 0.3s ease, opacity 0.4s ease" }}
            filter={glowIntensity > 0 ? "url(#glow)" : undefined}
          />
        )}

        {/* ── Shine overlay ── */}
        {progress > 0.33 && (
          <path
            d={buildPotPath(potWidth, potHeight)}
            fill="url(#potShine)"
            style={{ transition: "all 0.3s ease" }}
          />
        )}

        {/* ── Neck ── */}
        {progress > 0.5 && (
          <path
            d={`
              M ${100 - potWidth * 0.14} ${220 - potHeight}
              Q ${100 - potWidth * 0.1} ${220 - potHeight - 24}
                ${100 - potWidth * 0.08} ${220 - potHeight - 36}
              L ${100 + potWidth * 0.08} ${220 - potHeight - 36}
              Q ${100 + potWidth * 0.1} ${220 - potHeight - 24}
                ${100 + potWidth * 0.14} ${220 - potHeight}
              Z
            `}
            fill={darken(clayColor, 0.15)}
            opacity={neckOpacity}
            style={{ transition: "all 0.4s ease" }}
          />
        )}

        {/* ── Rim ── */}
        {progress > 0.5 && (
          <ellipse
            cx="100"
            cy={220 - potHeight - 36}
            rx={potWidth * 0.1}
            ry={5}
            fill={lighten(clayColor, 0.15)}
            opacity={neckOpacity}
            style={{ transition: "all 0.4s ease" }}
          />
        )}

        {/* ── Incised motifs ── */}
        {incisionOpacity > 0 && (
          <g
            opacity={incisionOpacity}
            style={{ transition: "opacity 0.5s ease" }}
          >
            {/* Scorpion band */}
            <path
              d={`M ${100 - potWidth * 0.35} ${220 - potHeight * 0.45}
                  Q ${100 - potWidth * 0.15} ${220 - potHeight * 0.5}
                    ${100} ${220 - potHeight * 0.45}
                  Q ${100 + potWidth * 0.15} ${220 - potHeight * 0.4}
                    ${100 + potWidth * 0.35} ${220 - potHeight * 0.45}`}
              fill="none"
              stroke={darken(clayColor, 0.45)}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Geometric band */}
            <path
              d={`M ${100 - potWidth * 0.38} ${220 - potHeight * 0.3}
                  L ${100 + potWidth * 0.38} ${220 - potHeight * 0.3}`}
              fill="none"
              stroke={darken(clayColor, 0.4)}
              strokeWidth="0.8"
              strokeDasharray="4 3"
            />
            {/* Diamond motif */}
            <polygon
              points={`
                ${100},${220 - potHeight * 0.62}
                ${100 + potWidth * 0.1},${220 - potHeight * 0.55}
                ${100},${220 - potHeight * 0.48}
                ${100 - potWidth * 0.1},${220 - potHeight * 0.55}
              `}
              fill="none"
              stroke={darken(clayColor, 0.42)}
              strokeWidth="0.9"
            />
          </g>
        )}
      </svg>

      {/* ── Turntable base ── */}
      <div
        style={{
          width: "clamp(100px, 14vw, 160px)",
          height: "8px",
          background: "#1a0f0a",
          borderRadius: "4px",
          border: "1px solid rgba(196,98,45,0.12)",
          marginTop: "4px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            height: "2px",
            background: "rgba(196,98,45,0.15)",
            borderRadius: "1px",
          }}
        />
      </div>
    </div>
  );
}

// ── Build pot silhouette path ────────────────────────────────
function buildPotPath(w: number, h: number): string {
  const cx = 100;
  const bot = 220;
  const top = bot - h;
  const hw = w * 0.5;
  const mid = bot - h * 0.45;
  return `
    M ${cx - hw * 0.3} ${bot}
    Q ${cx - hw * 1.1} ${mid}
      ${cx - hw * 0.28} ${top}
    L ${cx + hw * 0.28} ${top}
    Q ${cx + hw * 1.1} ${mid}
      ${cx + hw * 0.3} ${bot}
    Z
  `;
}

// ── Color helpers ────────────────────────────────────────────
function lerpHex(a: string, b: string, t: number): string {
  const p = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

function lighten(color: string, amt: number): string {
  if (color.startsWith("rgb")) {
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    return `rgb(${Math.min(255, Math.round(r + 255 * amt))},${Math.min(255, Math.round(g + 255 * amt))},${Math.min(255, Math.round(b + 255 * amt))})`;
  }
  return lerpHex(color, "#FFFFFF", amt);
}

function darken(color: string, amt: number): string {
  if (color.startsWith("rgb")) {
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    return `rgb(${Math.max(0, Math.round(r * (1 - amt)))},${Math.max(0, Math.round(g * (1 - amt)))},${Math.max(0, Math.round(b * (1 - amt)))})`;
  }
  return lerpHex(color, "#000000", amt);
}
