"use client";

import { useState } from "react";
import Loader from "@/components/loader/Loader";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import LifeSection from "@/components/life/LifeSection";
import JourneySection from "@/components/journey/JourneySection";
import CraftSection from "@/components/craft/CraftSection";
import GallerySection from "@/components/gallery/GallerySection";
import LegacySection from "@/components/legacy/LegacySection";
import SmoothScroll from "@/components/shared/SmoothScroll";
import ClayTransition from "@/components/shared/ClayTransition";
import type { SectionId } from "@/types";

export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);

  const [transition, setTransition] = useState<{
    active: boolean;
    targetId: string;
  }>({ active: false, targetId: "" });

  const triggerTransition = (targetId: SectionId) => {
    setTransition({ active: true, targetId });
  };

  const handleTransitionMid = () => {
    // Scroll happens inside ClayTransition at midpoint
  };

  const handleTransitionDone = () => {
    setTransition({ active: false, targetId: "" });
  };
  return (
    <>
      {/* Loader — fixed overlay, slides up on complete */}
      <Loader onComplete={() => setLoaded(true)} />

      {/* Site mounts beneath loader immediately,
          becomes visible when loader slides away  */}
      <SmoothScroll>
        <Navbar onNavigate={triggerTransition} />

        <main>
          <section id="intro">
            {" "}
            <HeroSection />{" "}
          </section>
          <section id="life">
            {" "}
            <LifeSection />{" "}
          </section>
          <section id="journey">
            {" "}
            <JourneySection />{" "}
          </section>
          <section id="craft">
            {" "}
            <CraftSection />{" "}
          </section>
          <section id="gallery">
            {" "}
            <GallerySection />{" "}
          </section>
          <section id="legacy">
            {" "}
            <LegacySection />{" "}
          </section>
        </main>
      </SmoothScroll>
      {transition.active && (
        <ClayTransition
          targetId={transition.targetId}
          onMidpoint={handleTransitionMid}
          onDone={handleTransitionDone}
        />
      )}
    </>
  );
}
