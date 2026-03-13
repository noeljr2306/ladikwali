"use client";

interface BiographyTextProps {
  inView: boolean;
}

const FACTS = [
  { value: "1925", label: "Born in Kwali" },
  { value: "1954", label: "Joined Abuja Pottery" },
  { value: "20+", label: "Countries exhibited" },
  { value: "1984", label: "Passed in Minna" },
];

const PARAGRAPHS = [
  {
    delay: 0.2,
    text: `Ladi Kwali was born around 1925 in the village of Kwali, in the
    Gwari region of what is now Niger State, Nigeria. From childhood,
    she learned the ancient coiling technique from her aunt — shaping
    clay by hand into vessels used for water, food, and ceremony.`,
  },
  {
    delay: 0.38,
    text: `In 1954, British studio potter Michael Cardew encountered her work
    and invited her to the Abuja Pottery Training Centre. She became
    its first woman — and its greatest talent. Her coil-built, incised
    pots fused Gwari tradition with studio techniques, creating a new
    language in world ceramics.`,
  },
  {
    delay: 0.54,
    text: `She demonstrated her craft in London, Rome, Paris, Washington DC,
    and across the United States. Her works entered the permanent
    collections of the Smithsonian Institution, the Victoria & Albert
    Museum, York Art Gallery, and Berkeley Galleries.`,
  },
];

export default function BiographyText({ inView }: BiographyTextProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div
        className={`transition-all duration-900 ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="font-[Canela,Georgia,serif] font-normal text-[clamp(32px,4vw,56px)] text-[#F4EDE4] leading-[1.05] tracking-[-0.01em] m-0">
          Her Life &
          <br />
          <em className="text-[#C4622D] italic">Her Work</em>
        </h2>

        {/* Underline accent */}
        <div className="mt-4 flex items-center gap-[10px]">
          <div className="w-[40px] h-[1px] bg-[rgba(196,98,45,0.5)]" />

          <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden>
            <polygon points="3,0 6,3 3,6 0,3" fill="#C4622D" opacity="0.7" />
          </svg>

          <div className="w-[120px] h-[1px] bg-gradient-to-r from-[rgba(196,98,45,0.3)] to-transparent" />
        </div>
      </div>

      {/* Paragraphs */}
      <div className="flex flex-col gap-[18px]">
        {PARAGRAPHS.map((p, i) => (
          <p
            key={i}
            className={`font-[Georgia,serif] text-[clamp(13px,1.15vw,15px)] text-[rgba(244,237,228,0.52)] leading-[1.85] m-0 max-w-[480px] transition-all duration-900 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{
              transitionDelay: `${p.delay}s`,
            }}
          >
            {p.text}
          </p>
        ))}
      </div>

      {/* Fact stats */}
      <div
        className={`grid grid-cols-4 gap-4 pt-6 border-t border-[rgba(196,98,45,0.1)] transition-all duration-900 ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]"
        }`}
        style={{ transitionDelay: "0.65s" }}
      >
        {FACTS.map((f) => (
          <div key={f.label}>
            <div className="font-[Canela,Georgia,serif] text-[clamp(18px,2vw,26px)] text-[#C4622D] leading-none mb-[5px]">
              {f.value}
            </div>

            <div className="text-[9px] text-[rgba(244,237,228,0.3)] tracking-[0.16em] uppercase font-[Georgia,serif]">
              {f.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
