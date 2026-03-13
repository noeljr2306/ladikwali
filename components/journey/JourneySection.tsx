"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MilestoneCard from "./MilestoneCard";
import ClayRope from "./ClayRope";
import type { Milestone } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export const MILESTONES: Milestone[] = [
  {
    year: 1925,
    title: "Born in Kwali",
    description:
      "Born in the Gwari village of Kwali, she learns the ancient coiling technique from her aunt, shaping clay vessels by hand for water, food, and ceremony.",
    location: "Kwali, Nigeria",
    type: "birth",
  },
  {
    year: 1950,
    title: "Discovered by Cardew",
    description:
      "British studio potter Michael Cardew encounters her extraordinary pots in the Emir of Abuja's collection — and immediately recognises a rare genius.",
    location: "Abuja, Nigeria",
    type: "career",
  },
  {
    year: 1954,
    title: "Abuja Pottery Centre",
    description:
      "She joins the Abuja Pottery Training Centre as its first female member. Her coil-built, incised vessels begin fusing Gwari tradition with studio ceramics.",
    location: "Abuja, Nigeria",
    type: "career",
  },
  {
    year: 1960,
    title: "Independence Exhibition",
    description:
      "Her work is displayed at Nigeria's Independence celebration, marking her emergence as a symbol of the nation's cultural identity.",
    location: "Lagos, Nigeria",
    type: "exhibition",
  },
  {
    year: 1961,
    title: "Britain & Europe",
    description:
      "She demonstrates at the Royal College of Art, Wenford Bridge, and Farnham — captivating the British studio pottery world with her technique.",
    location: "London, UK",
    type: "exhibition",
  },
  {
    year: 1962,
    title: "MBE Awarded",
    description:
      "Queen Elizabeth II awards her the Member of the Order of the British Empire — the first Nigerian potter to receive the honour.",
    location: "London, UK",
    type: "award",
  },
  {
    year: 1963,
    title: "Rome & Germany",
    description:
      "Sponsored by Rosenthal, she demonstrates in Rome and across Germany, bringing her coiling method to an astonished European audience.",
    location: "Rome, Italy",
    type: "exhibition",
  },
  {
    year: 1965,
    title: "Smithsonian Silver Prize",
    description:
      "Wins the Silver Prize at the Smithsonian Institution's 10th International Ceramic Exhibition — global recognition of her mastery.",
    location: "Washington DC, USA",
    type: "award",
  },
  {
    year: 1977,
    title: "Honorary Doctorate",
    description:
      "Ahmadu Bello University awards her an Honorary Doctorate — the academic world formally acknowledging what the art world had long known.",
    location: "Zaria, Nigeria",
    type: "award",
  },
  {
    year: 1980,
    title: "NNOM — Nigeria's Highest Honour",
    description:
      "Receives the Nigerian National Order of Merit, the highest honour the Nigerian state can bestow on a citizen for academic and intellectual achievement.",
    location: "Nigeria",
    type: "award",
  },
  {
    year: 1984,
    title: "A Legacy Immortalised",
    description:
      "She passes in Minna, Niger State. The Abuja Pottery is renamed in her honour. Her face is later placed on the ₦20 note — the only woman on Nigerian currency.",
    location: "Minna, Nigeria",
    type: "death",
  },
];

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${totalScroll}`,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const bg = interpolateColor(["#2A0E00", "#1A1209", "#0A1A10"], progress);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden h-dvh"
      style={{ background: bg, transition: "background 0.1s ease" }}
    >
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.045] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Section label */}
      <div className="absolute z-[4] flex items-center gap-[14px] top-[clamp(32px,5vh,52px)] left-[clamp(80px,10vw,140px)]">
        <div className="w-[28px] h-[1px] bg-gradient-to-r from-transparent to-[rgba(196,98,45,0.5)]" />

        <span className="text-[9px] tracking-[0.42em] text-[rgba(196,98,45,0.55)] uppercase font-[Georgia,serif]">
          03 — The Journey
        </span>
      </div>

      {/* Heading */}
      <div className="absolute z-[4] top-[clamp(60px,10vh,88px)] left-[clamp(80px,10vw,140px)]">
        <h2 className="font-[Canela,Georgia,serif] font-normal text-[clamp(28px,3.5vw,48px)] text-[#F4EDE4] leading-[1.1] m-0">
          From Kwali
          <br />
          <em
            className="italic transition-colors duration-300"
            style={{ color: colorFromProgress(progress) }}
          >
            to the World
          </em>
        </h2>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-[5] bg-[rgba(196,98,45,0.08)]">
        <div
          className="h-full transition-[width] duration-[50ms] linear"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(to right, #8B2500, ${colorFromProgress(
              progress,
            )})`,
          }}
        />
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-center h-full gap-[clamp(48px,6vw,88px)] pl-[clamp(80px,10vw,140px)] pr-[clamp(80px,10vw,140px)] will-change-transform relative z-[2]"
      >
        <ClayRope count={MILESTONES.length} progress={progress} />

        {MILESTONES.map((m, i) => (
          <MilestoneCard
            key={m.year}
            milestone={m}
            index={i}
            total={MILESTONES.length}
            progress={progress}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute z-[4] flex items-center gap-[10px] bottom-[clamp(28px,4vh,44px)] left-1/2 -translate-x-1/2 transition-opacity duration-600"
        style={{ opacity: progress < 0.04 ? 1 : 0 }}
      >
        <div className="w-[24px] h-[1px] bg-[rgba(196,98,45,0.4)]" />

        <span className="text-[9px] tracking-[0.35em] text-[rgba(196,98,45,0.4)] uppercase font-[Georgia,serif]">
          Scroll to journey
        </span>

        <div className="w-[24px] h-[1px] bg-[rgba(196,98,45,0.4)]" />
      </div>
    </div>
  );
}
function interpolateColor(colors: string[], t: number): string {
  const segments = colors.length - 1;
  const scaled = t * segments;
  const i = Math.min(Math.floor(scaled), segments - 1);
  const local = scaled - i;
  return lerpHex(colors[i], colors[i + 1], local);
}

function lerpHex(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);

  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);

  return `rgb(${r},${g},${bl})`;
}

// Accent color shifts terracotta → celadon with progress
function colorFromProgress(t: number): string {
  return lerpHex("#C4622D", "#7DAB8A", t);
}
