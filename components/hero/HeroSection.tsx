"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden h-dvh min-h-150 bg-[#B5522B]">
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-1 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.75%27_numOctaves=%274%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')] bg-size-[45px]"
      />

      {/* Typography block */}
      <div
        className={`
          relative z-2 text-left
          px-[clamp(32px,8vw,120px)]
          leading-[0.92]
          transition-all duration-1000 delay-200
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
        `}
      >
        {/* Row 1 */}
        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span className="italic-text">The</span>
          <span className="bold-text">LIFE</span>
        </div>

        {/* Row 2 */}
        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span className="italic-text">&amp;</span>
          <span className="bold-text">WORK</span>
        </div>

        {/* Row 3 */}
        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span className="italic-text">of</span>
          <span className="bold-text">LADI</span>
        </div>

        {/* Row 4 */}
        <div className="pl-[clamp(52px,9vw,110px)]">
          <span className="bold-text">KWALI</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden
        className={`
          absolute bottom-[clamp(28px,5vh,48px)] left-1/2
          -translate-x-1/2
          z-3
          flex flex-col items-center gap-2
          transition-opacity duration-1000 delay-1200
          ${mounted ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="w-1 h-12 bg-[linear-gradient(to_bottom,rgba(244,237,228,0.6),transparent)] animate-scrollPulse" />
      </div>
    </div>
  );
}
