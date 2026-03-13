"use client";

import { useEffect, useRef, useState } from "react";
import GalleryGrid from "./GalleryGrid";
import PotViewer from "./PotViewer";
import type { GalleryPot } from "@/types";

export const POTS: GalleryPot[] = [
  {
    id: "pot-01",
    title: "Water Vessel with Lizard Motif",
    year: "c. 1960",
    technique: "Coil-built, incised, celadon glaze",
    collection: "Smithsonian Institution, Washington DC",
    dimensions: "38cm × 24cm",
    image: "/images/gallery/pot-01.jpg",
  },
  {
    id: "pot-02",
    title: "Globular Jar with Scorpion Band",
    year: "c. 1958",
    technique: "Coil-built, kaolin slip, wood-fired",
    collection: "Victoria & Albert Museum, London",
    dimensions: "31cm × 28cm",
    image: "/images/gallery/pot-02.jpg",
  },
  {
    id: "pot-03",
    title: "Tall Vessel with Geometric Incision",
    year: "c. 1963",
    technique: "Coil-built, incised, stoneware",
    collection: "York Art Gallery, York",
    dimensions: "52cm × 22cm",
    image: "/images/gallery/pot-03.jpg",
  },
  {
    id: "pot-04",
    title: "Wide-Mouthed Bowl with Fish",
    year: "c. 1965",
    technique: "Coil-built, incised, celadon glaze",
    collection: "Aberystwyth University, Wales",
    dimensions: "18cm × 44cm",
    image: "/images/gallery/pot-04.jpg",
  },
  {
    id: "pot-05",
    title: "Ceremonial Pot with Crocodile",
    year: "c. 1961",
    technique: "Coil-built, incised, iron-red glaze",
    collection: "Berkeley Galleries, London",
    dimensions: "42cm × 30cm",
    image: "/images/gallery/pot-05.jpg",
  },
  {
    id: "pot-06",
    title: "Small Vessel with Diamond Band",
    year: "c. 1970",
    technique: "Coil-built, kaolin slip, wood-fired",
    collection: "Private Collection",
    dimensions: "22cm × 18cm",
    image: "/images/gallery/pot-06.jpg",
  },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selected, setSelected] = useState<GalleryPot | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Trap scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100dvh", background: "#0C0806" }}
    >
      {/* ── Grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.045,
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* ── Ambient top glow ── */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          right: "-5%",
          width: "50vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse at top right, rgba(196,98,45,0.06) 0%, transparent 65%)",
          zIndex: 1,
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative"
        style={{
          zIndex: 2,
          padding: "clamp(56px,8vh,96px) clamp(80px,10vw,140px)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            marginBottom: "clamp(40px,6vh,64px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          {/* Section label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(196,98,45,0.5))",
              }}
            />
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.42em",
                color: "rgba(196,98,45,0.55)",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
              }}
            >
              05 — The Gallery
            </span>
          </div>

          {/* Heading */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <h2
              style={{
                fontFamily: "Canela, Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 56px)",
                color: "#F4EDE4",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Her Works,
              <br />
              <em style={{ color: "#C4622D", fontStyle: "italic" }}>
                Living On
              </em>
            </h2>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(12px, 1.05vw, 14px)",
                color: "rgba(244,237,228,0.38)",
                lineHeight: 1.8,
                maxWidth: "360px",
                margin: 0,
              }}
            >
              Hover to inspect. Click to view in full. Her pots now reside in
              the permanent collections of five continents.
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <GalleryGrid pots={POTS} inView={inView} onSelect={setSelected} />
      </div>

      {/* ── Full-screen pot viewer ── */}
      {selected && (
        <PotViewer pot={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
