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

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("intro");
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        {
          root: null,
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      className={`
        fixed left-0 top-1/2 -translate-y-1/2 z-[100]
        flex flex-col items-center gap-0
        py-7
        bg-[rgba(12,8,6,0.55)]
        backdrop-blur-[8px]
        border-r border-[rgba(196,98,45,0.1)]
        transition-opacity duration-[800ms] ease
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className="
          w-[1px] h-12 mb-5
          bg-[linear-gradient(to_bottom,transparent,rgba(196,98,45,0.25))]
        "
      />

      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;

        return (
          <div key={id} className="flex flex-col items-center">
            {/* Indicator */}
            <div
              className={`
                my-[6px] rounded-full transition-all duration-400
                ${
                  isActive
                    ? "w-[3px] h-[3px] bg-[#C4622D] shadow-[0_0_6px_rgba(196,98,45,0.7)]"
                    : "w-[1px] h-[1px] bg-[rgba(196,98,45,0.25)]"
                }
              `}
            />

            {/* Label */}
            <button
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${label} section`}
              className={`
                bg-none border-none cursor-pointer
                px-5 py-2.5
                text-[9px] uppercase
                font-[Georgia,serif]
                outline-none
                [writing-mode:vertical-rl]
                [text-orientation:mixed]
                rotate-180
                transition-all duration-400
                ${
                  isActive
                    ? "text-[#C4622D] tracking-[0.38em]"
                    : "text-[rgba(244,237,228,0.3)] tracking-[0.28em]"
                }
              `}
            >
              {label}
            </button>
          </div>
        );
      })}

      {/* Bottom line */}
      <div
        className="
          w-[1px] h-12 mt-5
          bg-[linear-gradient(to_bottom,rgba(196,98,45,0.25),transparent)]
        "
      />
    </nav>
  );
}
