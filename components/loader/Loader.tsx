"use client";

import { useEffect, useRef, useState } from "react";
import type { LoaderProps } from "@/types";

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [exit, setExit] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const DURATION = 2800;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;

      const elapsed = timestamp - startRef.current;
      const linear = Math.min(elapsed / DURATION, 1);

      const eased = 1 - Math.pow(1 - linear, 3);
      const pct = Math.floor(eased * 100);

      setProgress(pct);

      if (linear < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);

        setTimeout(() => {
          setExit(true);

          setTimeout(() => {
            setDone(true);
            onComplete();
          }, 900);
        }, 350);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading"
      className={`
        fixed inset-0 z-[9999]
        bg-[#0C0806]
        flex flex-col items-center justify-end
        pb-[clamp(40px,7vh,72px)]
        overflow-hidden
        transition-transform duration-[850ms]
        ${exit ? "-translate-y-full ease-[cubic-bezier(0.76,0,0.24,1)]" : "translate-y-0"}
      `}
    >
      {/* Progress track */}
      <div
        className="
          relative
          w-[clamp(200px,28vw,340px)]
          h-[1px]
          bg-[rgba(196,98,45,0.12)]
          mb-4
        "
      >
        {/* Filled bar */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,#8B2500,#C4622D)]
            transition-[width] duration-[40ms] linear
          "
          style={{ width: `${progress}%` }}
        />

        {/* Glowing dot */}
        {progress > 0 && progress < 100 && (
          <div
            className="
              absolute top-1/2
              w-[4px] h-[4px]
              rounded-full
              bg-[#C4622D]
              shadow-[0_0_8px_2px_rgba(196,98,45,0.65)]
              transition-[left] duration-[40ms] linear
              -translate-x-1/2 -translate-y-1/2
            "
            style={{ left: `${progress}%` }}
          />
        )}
      </div>

      {/* Counter */}
      <span
        className="
          font-[Georgia,serif]
          text-[clamp(11px,1.1vw,13px)]
          tracking-[0.32em]
          text-[rgba(196,98,45,0.55)]
          tabular-nums
          inline-block
          min-w-[3ch]
          text-center
        "
      >
        {String(progress).padStart(2, "0")}
      </span>
    </div>
  );
}
