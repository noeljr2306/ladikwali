"use client";

import { useEffect, useRef, useState } from "react";

interface MagnifyingGlassProps {
  imageSrc: string;
}

const LENS_SIZE = 130; // diameter of magnifier circle
const ZOOM = 2.4; // magnification factor

export default function MagnifyingGlass({ imageSrc }: MagnifyingGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // Measure container on mount
  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    setImgSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, []);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Background-position to show the zoomed area
  const bgX = -(pos.x * ZOOM - LENS_SIZE / 2);
  const bgY = -(pos.y * ZOOM - LENS_SIZE / 2);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {visible && (
        <div
          style={{
            position: "absolute",
            left: pos.x - LENS_SIZE / 2,
            top: pos.y - LENS_SIZE / 2,
            width: LENS_SIZE,
            height: LENS_SIZE,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1.5px solid rgba(196,98,45,0.5)",
            boxShadow:
              "0 0 0 1px rgba(196,98,45,0.15), 0 8px 32px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            // Lens distortion effect via subtle box-shadow inset
            background: `url(${imageSrc})`,
            backgroundSize: `${imgSize.w * ZOOM}px ${imgSize.h * ZOOM}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
            backgroundRepeat: "no-repeat",
            // Subtle lens glass tint
            backdropFilter: "brightness(1.1) contrast(1.08)",
            WebkitBackdropFilter: "brightness(1.1) contrast(1.08)",
          }}
        >
          {/* Lens glare */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: "15%",
              width: "30%",
              height: "25%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
