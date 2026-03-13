"use client";

import { useEffect, useRef } from "react";

// Clay fragment — irregular polygon
interface Fragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  opacity: number;
  color: string;
}

const COLORS = [
  "#C4622D",
  "#8B2500",
  "#D4845A",
  "#F4EDE4",
  "#3D1800",
  "#A0400F",
];

const FRAGMENT_COUNT = 28;

export default function ShatterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Spawn fragments from centre
    const cx = W / 2;
    const cy = H / 2;

    const fragments: Fragment[] = Array.from({ length: FRAGMENT_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        size: 8 + Math.random() * 22,
        opacity: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    let startTime: number | null = null;
    const DURATION = 420; // ms

    const drawFragment = (f: Fragment) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);
      ctx.globalAlpha = f.opacity;
      ctx.fillStyle = f.color;
      // Irregular polygon
      ctx.beginPath();
      const sides = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const r = f.size * (0.6 + Math.random() * 0.4);
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, W, H);

      fragments.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.25; // gravity
        f.rotation += f.rotSpeed;
        f.opacity = 1 - t;
        drawFragment(f);
      });

      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  );
}
