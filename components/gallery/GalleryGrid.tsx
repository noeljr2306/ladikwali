"use client";

import Image from "next/image";
import { useState } from "react";
import MagnifyingGlass from "./MagnifyingGlass";
import ShatterEffect from "./ShatterEffect";
import type { GalleryPot } from "@/types";

interface GalleryGridProps {
  pots: GalleryPot[];
  inView: boolean;
  onSelect: (pot: GalleryPot) => void;
}

// Asymmetric heights for each card — makes the grid feel editorial
const HEIGHTS = ["320px", "260px", "380px", "290px", "340px", "270px"];

// Slight random rotations — like prints pinned to a wall
const ROTATIONS = [
  "-0.4deg",
  "0.5deg",
  "-0.6deg",
  "0.3deg",
  "-0.3deg",
  "0.6deg",
];

export default function GalleryGrid({
  pots,
  inView,
  onSelect,
}: GalleryGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [shatterId, setShatterId] = useState<string | null>(null);

  const handleClick = (pot: GalleryPot) => {
    setShatterId(pot.id);
    // Slight delay so shatter can begin before viewer opens
    setTimeout(() => {
      setShatterId(null);
      onSelect(pot);
    }, 420);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "clamp(16px, 2vw, 28px)",
      }}
    >
      {pots.map((pot, i) => {
        const isHovered = hoveredId === pot.id;
        const isShattering = shatterId === pot.id;

        return (
          <div
            key={pot.id}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? `rotate(${ROTATIONS[i]}) translateY(0)`
                : `rotate(${ROTATIONS[i]}) translateY(24px)`,
              transition: `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`,
            }}
          >
            <div
              onMouseEnter={() => setHoveredId(pot.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(pot)}
              style={{
                position: "relative",
                height: HEIGHTS[i],
                borderRadius: "3px",
                overflow: "hidden",
                cursor: "pointer",
                border: `1px solid rgba(196,98,45,${isHovered ? 0.35 : 0.1})`,
                transform: isHovered
                  ? "scale(1.02) translateY(-3px)"
                  : "scale(1) translateY(0)",
                transition:
                  "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                boxShadow: isHovered
                  ? "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,98,45,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {/* ── Pot image ── */}
              <Image
                src={pot.image}
                alt={pot.title}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                style={{
                  objectFit: "cover",
                  filter: `sepia(0.2) contrast(1.06) brightness(${isHovered ? 0.95 : 0.82})`,
                  transition: "filter 0.4s ease",
                }}
              />

              {/* ── Gradient overlay — darkens bottom for legibility ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(12,8,6,0.88) 0%, rgba(12,8,6,0.1) 50%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* ── Magnifying glass ── */}
              {isHovered && <MagnifyingGlass imageSrc={pot.image} />}

              {/* ── Shatter overlay ── */}
              {isShattering && <ShatterEffect />}

              {/* ── Card info — revealed on hover ── */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "clamp(14px,2vw,20px)",
                  transform: isHovered ? "translateY(0)" : "translateY(8px)",
                  opacity: isHovered ? 1 : 0.7,
                  transition: "transform 0.4s ease, opacity 0.4s ease",
                }}
              >
                {/* Year */}
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    color: "rgba(196,98,45,0.7)",
                    textTransform: "uppercase",
                    fontFamily: "Georgia, serif",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  {pot.year}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Canela, Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(13px, 1.3vw, 16px)",
                    color: "#F4EDE4",
                    lineHeight: 1.2,
                    margin: "0 0 6px",
                  }}
                >
                  {pot.title}
                </h3>

                {/* Collection */}
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "10px",
                    color: "rgba(244,237,228,0.38)",
                    margin: 0,
                    letterSpacing: "0.05em",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease 0.1s",
                  }}
                >
                  {pot.collection}
                </p>

                {/* Click hint */}
                {isHovered && (
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "1px",
                        background: "rgba(196,98,45,0.5)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.28em",
                        color: "rgba(196,98,45,0.6)",
                        textTransform: "uppercase",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Click to view
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
