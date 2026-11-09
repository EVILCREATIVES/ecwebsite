import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { GridFX } from "@/components/BackgroundFX";
import { resolveSrc, useSiteContent, type MediaItem as Media } from "@/lib/siteContent";

function Frame({ media, className }: { media: Media; className?: string }) {
  return (
    <figure
      className={`group relative overflow-hidden border border-white/8 ${className ?? ""}`}
      data-testid={`ads-frame-${media.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {media.video ? (
        <video
          src={resolveSrc(media.src)}
          autoPlay
          loop
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
      <figcaption className="absolute bottom-0 left-0 p-5 md:p-6">
        <span className="font-display text-[11px] tracking-[0.25em] uppercase text-white/85">
          {media.label}
        </span>
      </figcaption>
    </figure>
  );
}

// The original mosaic, repeated sideways: tall · wide · tall · two stacked wides.
type Column = { kind: "tall" | "wide"; items: [Media] } | { kind: "stack"; items: Media[] };

function toColumns(items: Media[]): Column[] {
  const cols: Column[] = [];
  const pattern = ["tall", "wide", "tall", "stack"] as const;
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const kind = pattern[p % pattern.length];
    if (kind === "stack") {
      cols.push({ kind, items: items.slice(i, i + 2) });
      i += 2;
    } else {
      cols.push({ kind, items: [items[i]] });
      i += 1;
    }
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

function ColumnView({ col }: { col: Column }) {
  return (
    <div className="shrink-0 h-full pr-5">
      <div className={`h-full flex flex-col gap-5 ${COL_WIDTH[col.kind]}`}>
      {col.items.map((m, i) => (
        <Frame key={i} media={m} className="flex-1" />
      ))}
      </div>
    </div>
  );
}

const SPEED = 18; // px per second — deliberately slow

/**
 * Horizontally scrolling strip: drifts slowly on its own, can be dragged with
 * the mouse, swiped on touch, or scrolled with a trackpad. Auto-drift pauses
 * while the visitor hovers or interacts, and is off for reduced-motion users.
 */
function CampaignStrip({ items }: { items: Media[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const cols = toColumns(items);
  // Render the sequence twice so the drift can loop seamlessly.
  const loop = [...cols, ...cols];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paused = false;
    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      pos = el.scrollLeft;
    };

    const tick = (t: number) => {
      const dt = Math.min(t - last, 100) / 1000;
      last = t;
      if (!paused && !reduce) {
        pos += SPEED * dt;
        el.scrollLeft = pos;
        if (el.scrollLeft >= el.scrollWidth / 2) wrap();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Mouse drag
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
      if (el.scrollLeft <= 0) {
        el.scrollLeft += el.scrollWidth / 2;
        startScroll += el.scrollWidth / 2;
      }
      wrap();
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("cursor-grabbing");
    };
    const enter = () => (paused = true);
    const leave = () => {
      paused = false;
      pos = el.scrollLeft;
    };
    const touchStart = () => (paused = true);
    const touchEnd = () => {
      // Let native momentum settle before drifting again.
      window.setTimeout(() => {
        paused = false;
        pos = el.scrollLeft;
      }, 1200);
    };
    const onScroll = () => {
      if (paused) {
        if (el.scrollLeft <= 0) el.scrollLeft += el.scrollWidth / 2;
        wrap();
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("touchend", touchEnd);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchend", touchEnd);
      el.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <div
      ref={ref}
      className="campaign-strip overflow-x-auto overflow-y-hidden cursor-grab select-none [--h:min(70vh,640px)] max-md:[--h:min(60vh,440px)]"
      aria-label="Campaign frames — drag or scroll sideways"
    >
      <div className="flex w-max h-[var(--h)]">
        {loop.map((col, i) => (
          <ColumnView key={i} col={col} />
        ))}
      </div>
    </div>
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
