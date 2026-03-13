"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";

interface GlobeMapProps {
  inView: boolean;
}

interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
  note: string;
}

const CITIES: City[] = [
  { name: "Kwali", lat: 9.0, lng: 7.1, country: "Nigeria", note: "Her birthplace & the pottery that bears her name" },
  { name: "Abuja", lat: 9.07, lng: 7.39, country: "Nigeria", note: "Abuja Pottery Training Centre — where it all began" },
  { name: "London", lat: 51.5, lng: -0.1, country: "UK", note: "Royal College of Art · V&A Museum" },
  { name: "Rome", lat: 41.9, lng: 12.5, country: "Italy", note: "Demonstrations sponsored by Rosenthal, 1963" },
  { name: "Washington", lat: 38.9, lng: -77.0, country: "USA", note: "Smithsonian Silver Prize, 1966" },
  { name: "Aberystwyth", lat: 52.4, lng: -4.08, country: "Wales", note: "University collection holds major works" },
  { name: "York", lat: 53.96, lng: -1.08, country: "UK", note: "York Art Gallery — W.A. Ismay collection" },
];

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}

const GLOBE_SIZE = 560; // ← single source of truth for size

export default function InfluenceGlobe({ inView }: GlobeMapProps) {
  const globeRef = useRef<GlobeMethods>();
  const [hovered, setHovered] = useState<City | null>(null);
  const [ready, setReady] = useState(false);

  const arcsData: Arc[] = useMemo(() => {
    return CITIES.slice(1).map((city, i) => ({
      startLat: CITIES[i].lat,
      startLng: CITIES[i].lng,
      endLat: city.lat,
      endLng: city.lng,
      color: ["rgba(196, 98, 45, 0.15)", "rgba(212, 168, 67, 0.7)"],
    }));
  }, []);

  // Wait for globe to be ready before setting camera + rotation
  useEffect(() => {
    if (!inView || !ready || !globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    globeRef.current.pointOfView({ lat: 20, lng: 10, altitude: 2.0 }, 1800);
  }, [inView, ready]);

  return (
    <div className={`relative w-full transition-opacity duration-1000 ${inView ? "opacity-100" : "opacity-0"}`}>
      
      {/* Header */}
      <div className="absolute top-0 left-0 z-10 p-6 pointer-events-none">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[1px] w-8 bg-terracotta" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-terracotta font-sohne">
            Global Exhibition
          </span>
        </div>
        <h2 className="font-canela text-2xl text-kaolin italic">
          The Travel Records
        </h2>
      </div>

      {/* Globe container — must have explicit pixel size matching width/height props */}
      <div
        className="relative rounded-2xl overflow-hidden bg-kiln/50 cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: `${GLOBE_SIZE}px` }}  // ← fixed pixel height
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%)" }}  // ← centres the fixed-size globe
        >
          <Globe
            ref={globeRef}
            width={GLOBE_SIZE}   // ← Bug 1 fix: explicit px dimensions
            height={GLOBE_SIZE}
            onGlobeReady={() => setReady(true)}  // ← ensures controls exist before we touch them
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere
            atmosphereColor="var(--color-terracotta)"
            atmosphereDayLightIntensity={0.3}
            arcsData={arcsData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={2}
            arcDashAnimateTime={3000}
            arcStroke={0.3}
            pointsData={CITIES}
            pointColor={(d) =>
              (d as City).name === "Kwali"
                ? "var(--color-celadon)"
                : "var(--color-naira)"
            }
            pointAltitude={0.02}
            pointRadius={0.6}
            // pointsMerge is removed — Bug 2 fix: merging kills onPointHover
            onPointHover={(d) => setHovered(d as City | null)}
            labelsData={CITIES}
            labelLat={(d) => (d as City).lat}
            labelLng={(d) => (d as City).lng}
            labelText={(d) => (d as City).name}
            labelSize={0.8}
            labelDotRadius={0.2}
            labelColor={() => "rgba(244, 237, 228, 0.5)"}
            labelResolution={2}
          />
        </div>

        {/* Tooltip */}
        {hovered && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[260px] pointer-events-none z-20">
            <div className="bg-kiln/95 border border-naira/30 p-3 rounded-sm shadow-2xl animate-in fade-in slide-in-from-bottom-2">
              <h4 className="font-canela text-naira text-base">{hovered.name}</h4>
              <p className="font-sohne text-[8px] uppercase tracking-widest text-kaolin/40 mb-1">
                {hovered.country}
              </p>
              <div className="h-[1px] w-full bg-naira/10 mb-1" />
              <p className="font-sohne text-sm leading-tight text-kaolin/80 italic">
                &apos;{hovered.note}&apos;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-between items-center px-2">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-celadon shadow-[0_0_5px_var(--color-celadon)]" />
            <span className="text-[9px] font-sohne text-kaolin/40 uppercase tracking-tighter">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-naira shadow-[0_0_5px_var(--color-naira)]" />
            <span className="text-[9px] font-sohne text-kaolin/40 uppercase tracking-tighter">Exhibition</span>
          </div>
        </div>
        <p className="text-[9px] font-sohne text-kaolin/20 uppercase tracking-[0.2em]">
          Drag to rotate · Scroll to zoom
        </p>
      </div>
    </div>
  );
}