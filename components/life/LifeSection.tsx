"use client";

import { useEffect, useRef, useState } from "react";
import BiographyText from "./BiographyText";
import NairaReveal from "./NairaReveal";

export default function LifeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden min-h-[100dvh] bg-[#0C0806] flex flex-col justify-center"
    >
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-[1] 
        bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.75%27_numOctaves=%274%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')] 
        bg-[length:180px]"
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute pointer-events-none top-[-10%] left-[-5%] 
        w-[50vw] h-[60vh] z-[1]
        bg-[radial-gradient(ellipse_at_top_left,rgba(196,98,45,0.07)_0%,transparent_65%)]"
      />

      {/* Section label */}
      <div
        className={`
        absolute
        top-[clamp(32px,5vh,56px)]
        left-[clamp(80px,10vw,140px)]
        z-[3]
        flex items-center gap-[14px]
        transition-all duration-[800ms] delay-[100ms]
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]"}
        `}
      >
        <div className="w-[28px] h-[1px] bg-[linear-gradient(to_right,transparent,rgba(196,98,45,0.5))]" />

        <span className="text-[9px] tracking-[0.42em] text-[rgba(196,98,45,0.55)] uppercase font-[Georgia,serif]">
          02 — Life &amp; Work
        </span>
      </div>

      {/* Content grid */}
      <div
        className="relative z-[2] grid grid-cols-2 items-center
        gap-[clamp(40px,6vw,100px)]
        px-[clamp(80px,10vw,140px)]
        py-[clamp(80px,12vh,120px)]"
      >
        <BiographyText inView={inView} />
        <NairaReveal inView={inView} />
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-[1px]
        bg-[linear-gradient(to_right,transparent,rgba(196,98,45,0.15),transparent)]"
      />
    </div>
  );
}
