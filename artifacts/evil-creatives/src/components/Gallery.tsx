import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GridFX } from "@/components/BackgroundFX";
import MediaLightbox from "@/components/MediaLightbox";
import { COPIES, repeatToMin, useDriftScroll } from "@/hooks/useDriftScroll";
import { resolveSrc, useSiteContent, type MediaItem } from "@/lib/siteContent";

function Marquee({
  items,
  reverse = false,
  onOpen,
}: {
  items: MediaItem[];
  reverse?: boolean;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragged = useDriftScroll(ref, { speed: 50, hoverSpeed: 12, reverse }, [items]);
  // One unit (repeated to be wider than any screen) is rendered COPIES times
  // so the row loops seamlessly in both directions.
  const unit = repeatToMin(items.map((item, index) => ({ item, index })), 8);
  const loop = Array.from({ length: COPIES }, () => unit).flat();
  return (
    <div
      ref={ref}
      onClickCapture={(e) => {
        if (dragged.current) {
          e.stopPropagation();
          dragged.current = false;
        }
      }}
      className="campaign-strip overflow-x-auto overflow-y-hidden cursor-grab select-none"
      aria-label="Works — drag or scroll sideways, click to enlarge"
    >
      <div className="flex w-max">
        {loop.map(({ item, index }, i) => {
          // Only the first real set is exposed to keyboard and screen readers.
          const isCopy = i >= items.length;
          const open = () => onOpen(index);
          return (
            <div key={i} className="shrink-0 pr-5" aria-hidden={isCopy || undefined}>
              <div
                role="button"
                tabIndex={isCopy ? -1 : 0}
                aria-label={`Open ${item.label}`}
                onClick={open}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
                className="group relative w-[300px] md:w-[420px] aspect-[16/10] overflow-hidden bg-[#111] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                data-testid={`gallery-item-${reverse ? "b" : "a"}-${i}`}
              >
                {item.video ? (
                  <video
                    src={resolveSrc(item.src)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={resolveSrc(item.src)}
                    alt={item.label}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                {item.video && (
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full border border-white/40 bg-black/40 text-white text-[10px] opacity-80 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary transition-colors"
                  >
                    ▶
                  </span>
                )}
                <span className="absolute bottom-4 left-5 font-display text-sm tracking-[0.15em] uppercase text-white">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { data } = useSiteContent();
  const [open, setOpen] = useState<number | null>(null);
  // Both rows share one carousel: top row first, then bottom row.
  const all = data ? [...data.works.rowOne, ...data.works.rowTwo] : [];
  const offset = data?.works.rowOne.length ?? 0;
  return (
    <section id="works" className="relative bg-[#0c0c0c] py-0 overflow-hidden">
      <GridFX pattern="grid" />
      {/* Section label bar */}
      <div className="relative z-10 border-y border-white/8 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">Works</span>
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
        {data ? (
          <>
            {data.works.rowOne.length > 0 && <Marquee items={data.works.rowOne} onOpen={setOpen} />}
            {data.works.rowTwo.length > 0 && (
              <Marquee items={data.works.rowTwo} reverse onOpen={(i) => setOpen(offset + i)} />
            )}
          </>
        ) : (
          // Reserve the rows' height while content loads, so the page doesn't jump.
          <div className="h-[calc(2*(300px*10/16)+1.25rem)] md:h-[calc(2*(420px*10/16)+1.25rem)]" />
        )}
      </div>
      <MediaLightbox items={all} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />
    </section>
  );
}
