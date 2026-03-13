"use client";

import { useEffect, useState, useCallback } from "react";
import type { NavItem, SectionId } from "@/types";

const NAV_ITEMS: NavItem[] = [
  { id: "intro", label: "Intro" },
  { id: "journey", label: "Journey" },
  { id: "craft", label: "Craft" },
  { id: "gallery", label: "Gallery" },
  { id: "legacy", label: "Legacy" },
];

interface NavbarProps {
  onNavigate?: (targetId: SectionId) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [active, setActive] = useState<SectionId>("intro");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = useCallback(
    (id: SectionId) => {
      if (onNavigate) {
        // Use clay transition
        onNavigate(id);
      } else {
        // Fallback: smooth scroll
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [onNavigate],
  );

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "fixed",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "rgba(12,8,6,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRight: "1px solid rgba(196,98,45,0.1)",
        padding: "28px 0",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Top fade line */}
      <div
        style={{
          width: "1px",
          height: "48px",
          marginBottom: "20px",
          background:
            "linear-gradient(to bottom, transparent, rgba(196,98,45,0.25))",
        }}
      />

      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Dot indicator */}
            <div
              style={{
                width: isActive ? "3px" : "1px",
                height: isActive ? "3px" : "1px",
                borderRadius: "50%",
                background: isActive ? "#C4622D" : "rgba(196,98,45,0.25)",
                margin: "6px 0",
                boxShadow: isActive ? "0 0 6px rgba(196,98,45,0.7)" : "none",
                transition: "all 0.4s ease",
              }}
            />

            {/* Label */}
            <button
              onClick={() => handleClick(id)}
              aria-label={`Navigate to ${label}`}
              aria-current={isActive ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 20px",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontSize: "9px",
                letterSpacing: isActive ? "0.38em" : "0.28em",
                textTransform: "uppercase",
                fontFamily: "Georgia, serif",
                color: isActive ? "#C4622D" : "rgba(244,237,228,0.3)",
                outline: "none",
                transition: "color 0.4s ease, letter-spacing 0.4s ease",
              }}
            >
              {label}
            </button>
          </div>
        );
      })}

      {/* Bottom fade line */}
      <div
        style={{
          width: "1px",
          height: "48px",
          marginTop: "20px",
          background:
            "linear-gradient(to bottom, rgba(196,98,45,0.25), transparent)",
        }}
      />
    </nav>
  );
}
