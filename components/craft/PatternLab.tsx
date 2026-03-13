"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const CANVAS_W = 520;
const CANVAS_H = 120;
const BRUSH_R = 6;

// Preset sgraffito motif paths (normalized 0–1, scaled to canvas)
const PRESETS = [
  {
    name: "Scorpion Band",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.beginPath();
      for (let x = 20; x < w - 20; x += 60) {
        ctx.moveTo(x, h / 2);
        ctx.quadraticCurveTo(x + 10, h / 2 - 14, x + 20, h / 2);
        ctx.quadraticCurveTo(x + 30, h / 2 + 14, x + 40, h / 2);
        ctx.moveTo(x + 20, h / 2);
        ctx.lineTo(x + 20, h / 2 + 20);
        ctx.moveTo(x + 14, h / 2 + 20);
        ctx.lineTo(x + 26, h / 2 + 20);
      }
      ctx.stroke();
    },
  },
  {
    name: "Geometric Diamonds",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.beginPath();
      for (let x = 30; x < w - 30; x += 50) {
        ctx.moveTo(x, h / 2 - 20);
        ctx.lineTo(x + 20, h / 2);
        ctx.lineTo(x, h / 2 + 20);
        ctx.lineTo(x - 20, h / 2);
        ctx.closePath();
      }
      ctx.stroke();
    },
  },
  {
    name: "River Fish",
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.beginPath();
      for (let x = 20; x < w - 20; x += 70) {
        // Body
        ctx.moveTo(x, h / 2);
        ctx.quadraticCurveTo(x + 20, h / 2 - 16, x + 40, h / 2);
        ctx.quadraticCurveTo(x + 20, h / 2 + 16, x, h / 2);
        // Tail
        ctx.moveTo(x + 40, h / 2);
        ctx.lineTo(x + 55, h / 2 - 12);
        ctx.moveTo(x + 40, h / 2);
        ctx.lineTo(x + 55, h / 2 + 12);
        // Eye
        ctx.moveTo(x + 10, h / 2 - 2);
        ctx.arc(x + 10, h / 2 - 2, 2, 0, Math.PI * 2);
      }
      ctx.stroke();
    },
  },
];

export default function PatternLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null); // sgraffito top layer
  const drawing = useRef(false);
  const [fired, setFired] = useState(false);
  const [glazed, setGlazed] = useState(false);

  // Initialise clay surface
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    // Bottom layer: kaolin white base
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#C4914A";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Clay texture noise
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * CANVAS_W;
      const y = Math.random() * CANVAS_H;
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Top layer: dark clay to scratch through
    const ovCtx = overlay.getContext("2d")!;
    ovCtx.fillStyle = "#3D1800";
    ovCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * CANVAS_W;
      const y = Math.random() * CANVAS_H;
      ovCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ovCtx.fillRect(x, y, 1, 1);
    }
  }, []);

  // Scratch through overlay on draw
  const scratch = useCallback((x: number, y: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = overlayRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    drawing.current = true;
    scratch(getPos(e).x, getPos(e).y);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (drawing.current) scratch(getPos(e).x, getPos(e).y);
  };
  const onMouseUp = () => {
    drawing.current = false;
  };
  const onTouchStart = (e: React.TouchEvent) => {
    drawing.current = true;
    scratch(getPos(e).x, getPos(e).y);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (drawing.current) scratch(getPos(e).x, getPos(e).y);
  };

  // Apply a preset pattern
  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = BRUSH_R * 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    preset.draw(ctx, CANVAS_W, CANVAS_H);
    ctx.globalCompositeOperation = "source-over";
  };

  // Fire — tint the base warm amber then celadon
  const fireIt = () => {
    if (fired) return;
    setFired(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    // Kiln flash
    ctx.fillStyle = "rgba(255,160,60,0.55)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    setTimeout(() => {
      // Cool to celadon glaze
      ctx.fillStyle = "rgba(125,171,138,0.38)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      setGlazed(true);
    }, 700);
  };

  // Clear
  const clear = () => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;
    setFired(false);
    setGlazed(false);
    const ovCtx = overlay.getContext("2d")!;
    ovCtx.globalCompositeOperation = "source-over";
    ovCtx.fillStyle = "#3D1800";
    ovCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#C4914A";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              color: "rgba(196,98,45,0.55)",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            Pattern Laboratory — Draw your own sgraffito
          </span>
        </div>
        <button onClick={clear} style={ghostBtn}>
          Clear
        </button>
      </div>

      {/* Canvas stack */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "3px",
          overflow: "hidden",
          boxShadow: glazed
            ? "0 0 32px rgba(125,171,138,0.25), 0 0 0 1px rgba(125,171,138,0.2)"
            : "0 0 0 1px rgba(196,98,45,0.15)",
          transition: "box-shadow 0.6s ease",
          cursor: "crosshair",
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        }}
      >
        {/* Base clay layer */}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {/* Sgraffito overlay — draw on this */}
        <canvas
          ref={overlayRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
        />
        {/* Glaze shimmer overlay */}
        {glazed && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(125,171,138,0.1) 0%, transparent 60%)",
              pointerEvents: "none",
              animation: "glazeShimmer 3s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.28em",
            color: "rgba(196,98,45,0.4)",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
          }}
        >
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button key={p.name} onClick={() => applyPreset(p)} style={ghostBtn}>
            {p.name}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={fireIt}
          disabled={fired}
          style={{
            ...ghostBtn,
            borderColor: fired
              ? "rgba(125,171,138,0.3)"
              : "rgba(196,98,45,0.4)",
            color: fired ? "#7DAB8A" : "#C4622D",
            opacity: fired ? 0.6 : 1,
          }}
        >
          {fired ? (glazed ? "✦ Glazed" : "Firing...") : "Fire It"}
        </button>
      </div>

      <style>{`
        @keyframes glazeShimmer {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(196,98,45,0.25)",
  borderRadius: "2px",
  color: "rgba(244,237,228,0.45)",
  fontSize: "9px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontFamily: "Georgia, serif",
  padding: "5px 12px",
  cursor: "pointer",
  transition: "border-color 0.25s ease, color 0.25s ease",
};
