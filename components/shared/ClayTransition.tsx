"use client";

import { useEffect, useRef, useState } from "react";

interface ClayTransitionProps {
  targetId: string;
  onMidpoint?: () => void;
  onDone?: () => void;
}

export interface ClayTransitionHandle {
  trigger: (targetId: string, onMidpoint?: () => void) => void;
}

export default function ClayTransition({
  targetId,
  onMidpoint,
  onDone
}: ClayTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width;
    const H = canvas.height;

    let phase: "cover" | "hold" | "reveal" = "cover";
    let start: number | null = null;
    const COVER_DUR = 520;
    const HOLD_DUR = 180;
    const REVEAL_DUR = 480;

    let midpointFired = false;

    const CLAYS = ["#3D1800", "#5C2410", "#8B2500", "#1A0E06"];

    const drawSmear = (progress: number, direction: "right" | "left") => {
      ctx.clearRect(0, 0, W, H);

      const edge =
        direction === "right" ? progress * (W + 80) : W - progress * (W + 80);

      ctx.fillStyle = "#2A0E00";
      if (direction === "right") {
        ctx.fillRect(0, 0, edge, H);
      } else {
        ctx.fillRect(edge, 0, W - edge, H);
      }

      const DRIPS = 14;
      ctx.fillStyle = "#3D1800";
      for (let i = 0; i < DRIPS; i++) {
        const y = (i / DRIPS) * H;
        const height = H / DRIPS;
        const jitter =
          Math.sin(i * 2.4 + progress * 8) * 28 + Math.cos(i * 1.3) * 16;
        const ex = direction === "right" ? edge + jitter : edge + jitter;

        ctx.beginPath();
        if (direction === "right") {
          ctx.ellipse(
            ex - 10,
            y + height / 2,
            30 + Math.abs(jitter),
            height * 0.6,
            0,
            0,
            Math.PI * 2,
          );
        } else {
          ctx.ellipse(
            ex + 10,
            y + height / 2,
            30 + Math.abs(jitter),
            height * 0.6,
            0,
            0,
            Math.PI * 2,
          );
        }
        ctx.fill();
      }

      for (let i = 0; i < 8; i++) {
        const sy = (i / 8) * H + 20;
        const len = direction === "right" ? edge * 0.7 : (W - edge) * 0.7;
        const startX = direction === "right" ? 0 : W;

        ctx.strokeStyle = CLAYS[i % CLAYS.length];
        ctx.lineWidth = 2 + Math.random() * 3;
        ctx.globalAlpha = 0.3 + Math.random() * 0.2;
        ctx.beginPath();
        ctx.moveTo(startX, sy);
        ctx.quadraticCurveTo(
          startX + (direction === "right" ? len * 0.5 : -len * 0.5),
          sy + Math.sin(i) * 20,
          startX + (direction === "right" ? len : -len),
          sy + Math.cos(i * 1.5) * 12,
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;

      if (phase === "cover") {
        const t = Math.min(elapsed / COVER_DUR, 1);
        const eased = easeInOutCubic(t);
        drawSmear(eased, "right");

        if (t >= 1) {
          phase = "hold";
          start = ts;
          if (!midpointFired) {
            midpointFired = true;
            onMidpoint?.();

            document
              .getElementById(targetId)
              ?.scrollIntoView({ behavior: "instant" });
          }
        }
      } else if (phase === "hold") {
        const ctx2 = canvasRef.current?.getContext("2d");
        if (ctx2) {
          ctx2.fillStyle = "#2A0E00";
          ctx2.fillRect(0, 0, W, H);
        }
        if (elapsed >= HOLD_DUR) {
          phase = "reveal";
          start = ts;
        }
      } else if (phase === "reveal") {
        const t = Math.min(elapsed / REVEAL_DUR, 1);
        const eased = easeInOutCubic(t);
        drawSmear(eased, "left");

        if (t >= 1) {
          ctx.clearRect(0, 0, W, H);
          setActive(false);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, targetId, onMidpoint]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        pointerEvents: "none",
        width: "100vw",
        height: "100dvh",
      }}
    />
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
