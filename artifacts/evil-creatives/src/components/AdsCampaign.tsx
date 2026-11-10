import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GridFX } from "@/components/BackgroundFX";
import MediaLightbox from "@/components/MediaLightbox";
import { useDriftScroll } from "@/hooks/useDriftScroll";
import { resolveSrc, useSiteContent, type MediaItem as Media } from "@/lib/siteContent";

function Frame({ media, className, onOpen }: { media: Media; className?: string; onOpen: () => void }) {
  return (
    <figure
      role="button"
      tabIndex={0}
      aria-label={`Open ${media.label}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group relative overflow-hidden border border-white/8 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${className ?? ""}`}
      data-testid={`ads-frame-${media.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {media.video ? (
        <video
          src={resolveSrc(media.src)}
          autoPlay
          loop
          draggable={false}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={resolveSrc(media.src)}
          draggable={false}
          alt={`Evil Creatives advertising campaign frame — ${media.label}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-70" />
      {media.video && (
        <span className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full border border-white/40 bg-black/40 text-white text-xs opacity-80 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary transition-colors" aria-hidden="true">
          ▶
        </span>
      )}
      <figcaption className="absolute bottom-0 left-0 p-5 md:p-6">
        <span className="font-display text-[11px] tracking-[0.25em] uppercase text-white/85">
          {media.label}
        </span>
      </figcaption>
    </figure>
  );
}

// The original mosaic, repeated sideways: tall · wide · tall · two stacked wides.
type Indexed = { media: Media; index: number };
type Column = { kind: "tall" | "wide" | "stack"; items: Indexed[] };

function toColumns(items: Media[]): Column[] {
  const cols: Column[] = [];
  const pattern = ["tall", "wide", "tall", "stack"] as const;
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const kind = pattern[p % pattern.length];
    const take = kind === "stack" ? 2 : 1;
    cols.push({ kind, items: items.slice(i, i + take).map((media, k) => ({ media, index: i + k })) });
    i += take;
    p += 1;
  }
  return cols;
}

const COL_WIDTH: Record<Column["kind"], string> = {
  // Heights are set by the track; widths keep each frame's original aspect ratio.
  tall: "w-[calc(var(--h)*3/4)]",
  wide: "w-[calc(var(--h)*16/9)]",
  stack: "w-[calc((var(--h)_-_1.25rem)/2*16/9)]",
};

function ColumnView({ col, onOpen }: { col: Column; onOpen: (index: number) => void }) {
  return (
    <div className="shrink-0 h-full pr-5">
      <div className={`h-full flex flex-col gap-5 ${COL_WIDTH[col.kind]}`}>
      {col.items.map(({ media, index }) => (
        <Frame key={index} media={media} className="flex-1" onOpen={() => onOpen(index)} />
      ))}
      </div>
    </div>
  );
}

/**
 * Horizontally scrolling strip: drifts slowly on its own, slows further on
 * hover, and can be dragged, swiped or trackpad-scrolled. Clicking a frame
 * opens it in a full-screen carousel.
 */
function CampaignStrip({ items }: { items: Media[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useDriftScroll(ref, { speed: 18, hoverSpeed: 5 }, [items]);
  const cols = toColumns(items);
  // Render the sequence twice so the drift can loop seamlessly.
  const loop = [...cols, ...cols];

  return (
    <>
      <div
        ref={ref}
        // A click that ends a drag shouldn't open the carousel.
        onClickCapture={(e) => {
          if (dragged.current) {
            e.stopPropagation();
            dragged.current = false;
          }
        }}
        className="campaign-strip overflow-x-auto overflow-y-hidden cursor-grab select-none [--h:min(70vh,640px)] max-md:[--h:min(60vh,440px)]"
        aria-label="Campaign frames — drag or scroll sideways, click to enlarge"
      >
        <div className="flex w-max h-[var(--h)]">
          {loop.map((col, i) => (
            <ColumnView key={i} col={col} onOpen={setOpen} />
          ))}
        </div>
      </div>
      <MediaLightbox items={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}

export default function AdsCampaign() {
  const { data } = useSiteContent();
  return (
    <section id="ads-campaign" className="relative bg-background text-foreground border-t border-white/8 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(224,176,2,0.07), transparent 55%)",
        }}
      />

      <GridFX pattern="grid" />

      {/* Section label bar */}
      <div className="relative border-b border-white/8 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">Ads Campaign</span>
        <span className="font-display text-xs tracking-[0.2em] text-white/30 uppercase">Selected Frames</span>
      </div>

      {/* Intro */}
      <div className="relative px-8 md:px-14 pt-20 md:pt-28 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 text-[clamp(2.6rem,6vw,6rem)] font-display leading-[0.9]"
        >
          Campaigns That<br /><span className="text-primary">Move People</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-5 text-white/55 font-sans text-base leading-relaxed font-light self-end"
        >
          AI-powered campaigns delivering tailored, multi-platform solutions — concepting,
          creative systems, and motion engineered for performance and brand.
        </motion.p>
      </div>

      {/* Scrollable frames — slow auto-drift, draggable */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative pb-24 md:pb-32"
      >
        {data ? <CampaignStrip items={data.campaigns} /> : <div className="h-[min(70vh,640px)] max-md:h-[min(60vh,440px)]" />}
      </motion.div>
    </section>
  );
}
