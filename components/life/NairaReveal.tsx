"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NairaRevealProps {
  inView: boolean;
}

export default function NairaReveal({ inView }: NairaRevealProps) {
  const [flipped, setFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    if (!inView || hasFlipped) return;

    const t = setTimeout(() => {
      setFlipped(true);
      setHasFlipped(true);

      setTimeout(() => setFlipped(false), 1800);
    }, 1000);

    return () => clearTimeout(t);
  }, [inView, hasFlipped]);

  return (
    <div
      className={`flex flex-col items-center gap-7 transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: "0.35s" }}
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-1 bg-linear-to-r from-transparent to-[rgba(196,98,45,0.5)]" />

        <span className="text-[9px] tracking-[0.38em] text-[rgba(196,98,45,0.5)] uppercase font-[Georgia,serif]">
          Nigeria&apos;s ₦20 Note
        </span>
      </div>

      {/* 3D flip card */}
      <div
        className="cursor-pointer w-[clamp(260px,32vw,420px)] aspect-[1.6/1]"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
        title="Click to flip"
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.85s cubic-bezier(0.76,0,0.24,1)",
          }}
        >
          {/* Front */}
          <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#1a3a1a] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(196,98,45,0.12)] backface-hidden">
            <Image
              src="/images/front-note.jpg"
              alt="Front of the Nigerian ₦20 note featuring Ladi Kwali"
              fill
              sizes="(max-width: 768px) 80vw, 420px"
              className="object-cover rounded-lg"
            />

            <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%)] pointer-events-none" />
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden bg-[#1a3a1a] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(196,98,45,0.12)]"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Image
              src="/images/back-note.jpg"
              alt="Back of the Nigerian ₦20 note"
              fill
              sizes="(max-width: 768px) 80vw, 420px"
              className="object-cover rounded-lg"
            />

            <div className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        aria-hidden
        className="w-[70%] h-1 mt-4"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,67,0.5), transparent)",
        }}
      />

      <div className="text-center max-w-85">
        <p className="font-[Canela,Georgia,serif] text-[clamp(16px,1.6vw,20px)] text-[#F4EDE4] italic leading-[1.4] mb-2.5">
          The only woman on Nigerian currency.
        </p>

        <p className="font-[Georgia,serif] text-[clamp(11px,1vw,13px)] text-[rgba(244,237,228,0.38)] leading-[1.75] tracking-[0.02em]">
          Ladi Kwali&apos;s portrait — shown at her wheel — appears on the face of
          Nigeria&apos;s ₦20 note, a recognition of her singular contribution to the
          nation&apos;s cultural identity.
        </p>

        <p className="mt-3.5 text-[9px] tracking-[0.3em] text-[rgba(196,98,45,0.4)] uppercase font-[Georgia,serif]">
          Click note to flip
        </p>
      </div>
    </div>
  );
}
