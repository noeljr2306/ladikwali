"use client";

import { useEffect, useRef, useState } from "react";

interface GlobeMapProps {
  inView: boolean;
}

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  note: string;
}

const CITIES: City[] = [
  {
    name: "Kwali",
    country: "Nigeria",
    lat: 9.0,
    lng: 7.1,
    note: "Her birthplace & the pottery that bears her name",
  },
  {
    name: "Abuja",
    country: "Nigeria",
    lat: 9.07,
    lng: 7.39,
    note: "Abuja Pottery Training Centre — where it all began",
  },
  {
    name: "London",
    country: "UK",
    lat: 51.5,
    lng: -0.1,
    note: "Royal College of Art · Berkeley Galleries · V&A Museum",
  },
  {
    name: "Rome",
    country: "Italy",
    lat: 41.9,
    lng: 12.5,
    note: "Demonstrations sponsored by Rosenthal, 1963",
  },
  {
    name: "Washington",
    country: "USA",
    lat: 38.9,
    lng: -77.0,
    note: "Smithsonian Silver Prize, 10th Int'l Ceramic Exhibition",
  },
  {
    name: "Aberystwyth",
    country: "Wales",
    lat: 52.4,
    lng: -4.08,
    note: "University collection holds several major works",
  },
  {
    name: "York",
    country: "UK",
    lat: 53.96,
    lng: -1.08,
    note: "York Art Gallery — W.A. Ismay collection",
  },
];

// Equirectangular projection: lng/lat → x/y on a flat map
function project(lat: number, lng: number, W: number, H: number) {
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return { x, y };
}

export default function GlobeMap({ inView }: GlobeMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<City | null>(null);
  const [revealed, setRevealed] = useState(0); // 0–CITIES.length
  const animRef = useRef<number>(0);

  const W = 560;
  const H = 300;

  // Draw the flat world map with dots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W;
    canvas.height = H;
    drawMap(ctx, W, H, CITIES, revealed, hovered);
  }, [revealed, hovered]);

  // Reveal dots one by one when in view
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const reveal = () => {
      i++;
      setRevealed(i);
      if (i < CITIES.length) {
        animRef.current = window.setTimeout(reveal, 300);
      }
    };
    animRef.current = window.setTimeout(reveal, 600);
    return () => clearTimeout(animRef.current);
  }, [inView]);

  // Mouse hit-test against city dots
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const hit = CITIES.slice(0, revealed).find((c) => {
      const { x, y } = project(c.lat, c.lng, W, H);
      return Math.hypot(mx - x, my - y) < 14;
    });
    setHovered(hit ?? null);
  };

  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
      }}
    >
      {/* Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(196,98,45,0.5))",
          }}
        />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.38em",
            color: "rgba(196,98,45,0.5)",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
          }}
        >
          Where She Went
        </span>
      </div>

      {/* Map canvas */}
      <div
        style={{
          position: "relative",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid rgba(196,98,45,0.1)",
          background: "#080504",
          cursor: hovered ? "pointer" : "default",
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: "100%", display: "block" }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHovered(null)}
        />

        {/* Tooltip */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(12,8,6,0.92)",
              border: "1px solid rgba(196,98,45,0.25)",
              borderRadius: "3px",
              padding: "10px 16px",
              maxWidth: "280px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                fontFamily: "Canela, Georgia, serif",
                fontSize: "14px",
                color: "#F4EDE4",
                margin: "0 0 4px",
              }}
            >
              {hovered.name}{" "}
              <span
                style={{ color: "rgba(244,237,228,0.4)", fontSize: "11px" }}
              >
                · {hovered.country}
              </span>
            </p>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "11px",
                color: "rgba(244,237,228,0.45)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {hovered.note}
            </p>
          </div>
        )}
      </div>

      <p
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "10px",
          color: "rgba(244,237,228,0.25)",
          letterSpacing: "0.14em",
          marginTop: "10px",
          textTransform: "uppercase",
        }}
      >
        Hover a dot to explore
      </p>
    </div>
  );
}

// ── Canvas drawing ───────────────────────────────────────────
function drawMap(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  cities: City[],
  revealed: number,
  hovered: City | null,
) {
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = "#080504";
  ctx.fillRect(0, 0, W, H);

  // Latitude grid lines
  ctx.strokeStyle = "rgba(196,98,45,0.06)";
  ctx.lineWidth = 0.5;
  for (let lat = -60; lat <= 80; lat += 30) {
    const y = ((90 - lat) / 180) * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 60) {
    const x = ((lng + 180) / 360) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Equator
  ctx.strokeStyle = "rgba(196,98,45,0.12)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  // Draw connector lines between cities (in order of reveal)
  const visibleCities = cities.slice(0, revealed);
  if (visibleCities.length > 1) {
    ctx.strokeStyle = "rgba(196,98,45,0.18)";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 5]);
    for (let i = 1; i < visibleCities.length; i++) {
      const a = project(
        visibleCities[i - 1].lat,
        visibleCities[i - 1].lng,
        W,
        H,
      );
      const b = project(visibleCities[i].lat, visibleCities[i].lng, W, H);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  // Draw city dots
  visibleCities.forEach((city, i) => {
    const { x, y } = project(city.lat, city.lng, W, H);
    const isHov = hovered?.name === city.name;
    const isFirst = i === 0;

    // Glow ring
    if (isHov || isFirst) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = isFirst
        ? "rgba(125,171,138,0.12)"
        : "rgba(196,98,45,0.12)";
      ctx.fill();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, isHov ? 7 : 5, 0, Math.PI * 2);
    ctx.strokeStyle = isFirst
      ? "#7DAB8A"
      : isHov
        ? "#C4622D"
        : "rgba(196,98,45,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, isHov ? 3 : 2, 0, Math.PI * 2);
    ctx.fillStyle = isFirst ? "#7DAB8A" : "#C4622D";
    ctx.fill();

    // City name label
    ctx.fillStyle = isHov ? "#F4EDE4" : "rgba(244,237,228,0.4)";
    ctx.font = `${isHov ? "500" : "400"} 9px Georgia, serif`;
    ctx.textAlign = "left";
    ctx.fillText(city.name, x + 9, y + 4);
  });
}
