"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // scroll travel time — heavier = more clay-like
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9, // slightly reduced — feels weighted
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose lenis on window so GSAP ScrollTrigger can sync with it
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
