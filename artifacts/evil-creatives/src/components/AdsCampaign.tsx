import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GridFX } from "@/components/BackgroundFX";
import InViewVideo from "@/components/InViewVideo";
import MediaLightbox from "@/components/MediaLightbox";
import { COPIES, useDriftScroll } from "@/hooks/useDriftScroll";
import { posterFor, resolveSrc, useSiteContent, videoSrc, type MediaItem as Media } from "@/lib/siteContent";

const GAP = 16; // px between tiles, both directions

// ---------------------------------------------------------------------------
// Natural proportions of each asset (height / width), read from the files.
// ---------------------------------------------------------------------------
const ratioCache = new Map<string, number>();

function loadRatio(item: Media): Promise<number> {
  const src = resolveSrc(item.src);
  const cached = ratioCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise<number>((resolve) => {
    const done = (w: number, h: number) => {
      const r = w > 0 && h > 0 ? h / w : 9 / 16;
      ratioCache.set(src, r);
      resolve(r);
    };
    const timer = window.setTimeout(() => done(16, 9), 8000); // don't hang on a broken file
    const cover = posterFor(item); // a cover has the video's shape and loads faster
    if (item.video && !cover) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.onloadedmetadata = () => (window.clearTimeout(timer), done(v.videoWidth, v.videoHeight));
      v.onerror = () => (window.clearTimeout(timer), done(16, 9));
      v.src = src;
    } else {
      const img = new Image();
      img.onload = () => (window.clearTimeout(timer), done(img.naturalWidth, img.naturalHeight));
      img.onerror = () => (window.clearTimeout(timer), done(16, 9));
      img.src = cover ?? src;
    }
  });
}

function useRatios(items: Media[]): number[] | null {
  const [ratios, setRatios] = useState<number[] | null>(null);
  useEffect(() => {
    let alive = true;
    setRatios(null);
    Promise.all(items.map(loadRatio)).then((r) => alive && setRatios(r));
    return () => {
      alive = false;
    };
  }, [items]);
  return ratios;
}

// ---------------------------------------------------------------------------
// Mosaic layout: columns of 2 (or 3) assets. Each column's width is chosen so
// its assets, at their own proportions, exactly fill the strip height — no
// cropping, no stretching, and never a single asset filling a whole column.
// ---------------------------------------------------------------------------
type Tile = { media: Media; index: number; ratio: number };
type Column = { tiles: Tile[]; width: number };

function columnWidth(tiles: Tile[], height: number) {
  const sum = tiles.reduce((s, t) => s + t.ratio, 0);
  return (height - GAP * (tiles.length - 1)) / sum;
}

function buildColumns(tiles: Tile[], height: number): Column[] {
  if (tiles.length === 0) return [];
  // A single asset can't share a column with anything — pair it with itself.
  const list = tiles.length === 1 ? [tiles[0], tiles[0]] : tiles;
  const groups: Tile[][] = [];
  for (let i = 0; i < list.length; i += 2) groups.push(list.slice(i, i + 2));
  // Odd count: the last asset joins the previous column (3 high).
  if (groups.length > 1 && groups[groups.length - 1].length === 1) {
    groups[groups.length - 2].push(...groups.pop()!);
  }
  return groups.map((g) => ({ tiles: g, width: columnWidth(g, height) }));
}

function Tile({ tile, width, onOpen, hidden }: { tile: Tile; width: number; onOpen: () => void; hidden?: boolean }) {
  const { media } = tile;
  return (
    <figure
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-label={`Open ${media.label}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{ width, height: width * tile.ratio }}
      className="group relative shrink-0 overflow-hidden bg-[#111] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      data-testid={`ads-frame-${media.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {media.video ? (
        <InViewVideo src={videoSrc(media)} poster={posterFor(media)} className="block w-full h-full" />
      ) : (
        <img
          src={resolveSrc(media.src)}
          draggable={false}
          alt={`Evil Creatives advertising campaign frame — ${media.label}`}
          loading="lazy"
          className="block w-full h-full"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {media.video && (
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full border border-white/40 bg-black/40 text-white text-[10px] group-hover:border-primary group-hover:text-primary transition-colors"
        >
          ▶
        </span>
      )}
      <figcaption className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="font-display text-[11px] tracking-[0.25em] uppercase text-white">{media.label}</span>
      </figcaption>
    </figure>
  );
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ width: Math.round(e.contentRect.width), height: Math.round(e.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/**
 * Endless mosaic strip: drifts slowly, slows further on hover, can be dragged,
 * swiped or trackpad-scrolled. Clicking a tile opens the full-screen carousel.
 */
function CampaignStrip({ items }: { items: Media[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const ratios = useRatios(items);
  const { width: vpWidth, height } = useSize(viewport);

  let unit: Column[] = [];
  let base = 0; // columns in the first real set (the rest are loop copies)
  if (ratios && height > 0) {
    const tiles = items.map((media, index) => ({ media, index, ratio: ratios[index] }));
    const set = buildColumns(tiles, height);
    base = set.length;
    const baseWidth = set.reduce((s, c) => s + c.width + GAP, 0);
    // One unit must be at least as wide as the screen for a seamless loop.
    const reps = Math.max(1, Math.ceil((vpWidth + 1) / Math.max(baseWidth, 1)));
    unit = Array.from({ length: reps }, () => set).flat();
  }
  const loop = Array.from({ length: COPIES }, () => unit).flat();
  const dragged = useDriftScroll(viewport, track, { speed: 18, hoverSpeed: 5 }, [loop.length, height]);

  return (
    <>
      <div
        ref={viewport}
        onClickCapture={(e) => {
          // A click that ends a drag shouldn't open the carousel.
          if (dragged.current) {
            e.stopPropagation();
            dragged.current = false;
          }
        }}
        className="relative overflow-hidden cursor-grab select-none touch-pan-y h-[min(70vh,640px)] max-md:h-[min(60vh,440px)]"
        aria-label="Campaign frames — drag or scroll sideways, click to enlarge"
      >
        <div ref={track} className="flex w-max h-full will-change-transform">
          {loop.map((col, i) => (
            <div
              key={i}
              className="shrink-0 flex flex-col"
              style={{ width: col.width, marginRight: GAP, gap: GAP }}
              aria-hidden={i >= base || undefined}
            >
              {col.tiles.map((t, k) => (
                <Tile key={k} tile={t} width={col.width} hidden={i >= base} onOpen={() => setOpen(t.index)} />
              ))}
            </div>
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
