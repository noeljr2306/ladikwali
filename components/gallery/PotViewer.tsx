"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryPot } from "@/types";

interface PotViewerProps {
  pot: GalleryPot;
  onClose: () => void;
}

export default function PotViewer({ pot, onClose }: PotViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0); // degrees Y
  const [tilt, setTilt] = useState(0); // degrees X
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velX = useRef(0);
  const rafRef = useRef<number>(0);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Momentum spin
  useEffect(() => {
    const spin = () => {
      if (!dragging.current && Math.abs(velX.current) > 0.05) {
        setRotation((r) => r + velX.current);
        velX.current *= 0.92; // friction
        rafRef.current = requestAnimationFrame(spin);
      }
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    velX.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    const dy = e.clientY - lastY.current;
    velX.current = dx * 0.4;
    setRotation((r) => r + dx * 0.4);
    setTilt((t) => Math.max(-18, Math.min(18, t + dy * 0.15)));
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `rgba(12,8,6,${mounted ? 0.96 : 0})`,
        transition: "background 0.5s ease",
      }}
      onClick={onClose}
    >
      {/* ── Inner card — stop propagation ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          width: "min(900px, 92vw)",
          maxHeight: "88vh",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid rgba(196,98,45,0.18)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "scale(1) translateY(0)"
            : "scale(0.94) translateY(24px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* ── Left: 360° viewer ── */}
        <div
          style={{
            flex: "0 0 55%",
            position: "relative",
            background: "#100A06",
            cursor: dragging.current ? "grabbing" : "grab",
            userSelect: "none",
            overflow: "hidden",
            minHeight: "460px",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Kiln floor glow */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: "30%",
              background:
                "radial-gradient(ellipse at bottom, rgba(180,60,10,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Pot image — rotates with drag */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
              perspective: "800px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "clamp(180px, 26vw, 320px)",
                aspectRatio: "0.75",
                transform: `rotateY(${rotation}deg) rotateX(${tilt}deg)`,
                transition: dragging.current
                  ? "none"
                  : "transform 0.05s linear",
              }}
            >
              <Image
                src={pot.image}
                alt={pot.title}
                fill
                sizes="320px"
                style={{
                  objectFit: "contain",
                  filter: "sepia(0.15) contrast(1.08) brightness(0.9)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Drag hint */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "rgba(196,98,45,0.4)",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
              whiteSpace: "nowrap",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}
          >
            ← Drag to rotate →
          </div>
        </div>

        {/* ── Right: details panel ── */}
        <div
          style={{
            flex: "1 1 45%",
            background: "#0C0806",
            padding: "clamp(28px,4vw,48px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            overflowY: "auto",
            borderLeft: "1px solid rgba(196,98,45,0.1)",
          }}
        >
          {/* Year */}
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.38em",
              color: "rgba(196,98,45,0.6)",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            {pot.year}
          </span>

          {/* Title */}
          <h2
            style={{
              fontFamily: "Canela, Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(20px, 2.2vw, 30px)",
              color: "#F4EDE4",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {pot.title}
          </h2>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "rgba(196,98,45,0.35)",
              }}
            />
            <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
              <polygon points="3,0 6,3 3,6 0,3" fill="#C4622D" opacity="0.7" />
            </svg>
          </div>

          {/* Metadata rows */}
          {[
            { label: "Technique", value: pot.technique },
            { label: "Collection", value: pot.collection },
            { label: "Dimensions", value: pot.dimensions ?? "—" },
          ].map((row) => (
            <div key={row.label}>
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.32em",
                  color: "rgba(196,98,45,0.45)",
                  textTransform: "uppercase",
                  fontFamily: "Georgia, serif",
                  margin: "0 0 5px",
                }}
              >
                {row.label}
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(12px, 1.05vw, 14px)",
                  color: "rgba(244,237,228,0.65)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {row.value}
              </p>
            </div>
          ))}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              marginTop: "auto",
              padding: "12px 24px",
              background: "transparent",
              border: "1px solid rgba(196,98,45,0.3)",
              borderRadius: "2px",
              color: "rgba(244,237,228,0.45)",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              transition: "border-color 0.3s ease, color 0.3s ease",
              alignSelf: "flex-start",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,98,45,0.7)";
              e.currentTarget.style.color = "#F4EDE4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(196,98,45,0.3)";
              e.currentTarget.style.color = "rgba(244,237,228,0.45)";
            }}
          >
            ← Close
          </button>
        </div>
      </div>
    </div>
  );
}
