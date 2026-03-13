"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = wordsRef.current;
    const scrollEl = scrollRef.current;

    // Set initial hidden state
    gsap.set(words, { opacity: 0, y: -60, clipPath: "inset(0 0 100% 0)" });
    gsap.set(scrollEl, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.8 }); // adjust delay to match your loader

    words.forEach((word, i) => {
      tl.to(
        word,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.55,
          ease: "power3.out",
        },
        i * 0.13, // stagger offset
      );
    });

    tl.to(
      scrollEl,
      { opacity: 1, duration: 0.8, ease: "power2.inOut" },
      "+=0.3",
    );
  }, []);

  const addWord = (el: HTMLSpanElement | null) => {
    if (el && !wordsRef.current.includes(el)) wordsRef.current.push(el);
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden h-dvh min-h-150 bg-[#230d04]">
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-1 bg-[url('data:image/svg+xml,...')] bg-size-[45px]"
      />

      {/* Typography block */}
      <div className="relative z-2 text-left px-[clamp(32px,8vw,120px)] leading-[0.92]">
        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span
            ref={addWord}
            className="italic-text"
            style={{ display: "inline-block" }}
          >
            The
          </span>
          <span
            ref={addWord}
            className="bold-text"
            style={{ display: "inline-block" }}
          >
            LIFE
          </span>
        </div>

        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span
            ref={addWord}
            className="italic-text"
            style={{ display: "inline-block" }}
          >
            &amp;
          </span>
          <span
            ref={addWord}
            className="bold-text"
            style={{ display: "inline-block" }}
          >
            WORK
          </span>
        </div>

        <div className="flex items-baseline gap-[clamp(8px,1.5vw,18px)]">
          <span
            ref={addWord}
            className="italic-text"
            style={{ display: "inline-block" }}
          >
            of
          </span>
          <span
            ref={addWord}
            className="bold-text"
            style={{ display: "inline-block" }}
          >
            LADI
          </span>
        </div>

        <div className="pl-[clamp(52px,9vw,110px)]">
          <span
            ref={addWord}
            className="bold-text"
            style={{ display: "inline-block" }}
          >
            KWALI
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        aria-hidden
        className="absolute bottom-[clamp(28px,5vh,48px)] left-1/2 -translate-x-1/2 z-3 flex flex-col items-center gap-2"
      >
        <div className="w-1 h-12 bg-[linear-gradient(to_bottom,rgba(244,237,228,0.6),transparent)] animate-scrollPulse" />
      </div>
    </div>
  );
}
