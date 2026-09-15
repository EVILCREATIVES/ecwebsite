import { motion, useReducedMotion } from "framer-motion";
import { GridFX } from "@/components/BackgroundFX";

type GalleryItem = { src: string; label: string; video?: boolean; contain?: boolean };

const rowOne: GalleryItem[] = [
  { src: "/images/gallery-brandworlds.png", label: "Brand Worlds" },
  { src: "/images/site-img5.png", label: "Concept Film" },
  { src: "/images/gallery-lumen-park.png", label: "Multimedia Activation" },
  { src: "/images/site-img6.png", label: "Type & Identity" },
  { src: "/images/case6.png", label: "Photo-Reportage" },
];

const rowTwo: GalleryItem[] = [
  { src: "/images/site-img10.png", label: "Narrative Campaigns" },
  { src: "/images/site-img2.png", label: "Social Content" },
  { src: "/images/interface-lumen.png", label: "Interface Systems" },
  { src: "/videos/gallery-dome.mp4", video: true, label: "3D & Spatial" },
  { src: "/images/site-img7.png", label: "Docu-Series" },
];

function Marquee({ items, reverse = false }: { items: GalleryItem[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        className="flex gap-5 shrink-0 pr-5"
        animate={reduceMotion ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={reduceMotion ? undefined : { duration: 38, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <div
            key={i}
            className="group relative w-[300px] md:w-[420px] aspect-[16/10] shrink-0 overflow-hidden bg-[#111]"
            data-testid={`gallery-item-${reverse ? "b" : "a"}-${i}`}
          >
            {"video" in item && item.video ? (
              <video
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <img
                src={item.src}
                alt={item.label}
                className={`absolute inset-0 w-full h-full ${item.contain ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
            <span className="absolute bottom-4 left-5 font-display text-sm tracking-[0.15em] uppercase text-white">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="relative bg-[#0c0c0c] py-0 overflow-hidden">
      <GridFX pattern="grid" />
      {/* Section label bar */}
      <div className="relative z-10 border-y border-white/8 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">Creative Range</span>
        <span className="font-display text-xs tracking-[0.2em] text-white/30 uppercase">A Studio Without a House Style</span>
      </div>

      {/* Intro */}
      <div className="relative z-10 px-8 md:px-14 py-16 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(2.2rem,6vw,6rem)] font-display leading-[0.9] max-w-4xl"
        >
          One Studio.<br /><span className="text-primary">Every Register.</span>
        </motion.h2>
        <p className="text-white/50 font-sans text-base font-light max-w-xl mt-6 leading-relaxed">
          From brand worlds to narrative systems — we shift tone, medium, and aesthetic to fit the idea. No templates. Meaning is our house style.
        </p>
      </div>

      {/* Two marquee rows */}
      <div className="relative z-10 flex flex-col gap-5 pb-20">
        <Marquee items={rowOne} />
        <Marquee items={rowTwo} reverse />
      </div>
    </section>
  );
}
