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

  const handleTransitionMid = () => {};

  const handleTransitionDone = () => {
    setTransition({ active: false, targetId: "" });
  };
  return (
    <>
      <Loader onComplete={() => setLoaded(true)} />

      <SmoothScroll>
        <Navbar onNavigate={triggerTransition} />

        <main>
          <section id="intro">
            {" "}
            <HeroSection />{" "}
          </section>
          <section id="life" className="mx-80">
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
