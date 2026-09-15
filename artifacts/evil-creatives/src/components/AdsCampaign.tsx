import { motion } from "framer-motion";
import { GridFX } from "@/components/BackgroundFX";

const base = import.meta.env.BASE_URL;

type Media = { src: string; video?: boolean; label: string };

const brandFilm: Media = { src: `${base}videos/ads-cocktail.mp4`, video: true, label: "Brand Film" };
const outOfHome: Media = { src: `${base}images/site-img9.png`, label: "Key Visuals" };
const social: Media = { src: `${base}videos/ads-social.mp4`, video: true, label: "Social Campaign" };
const polarity: Media = { src: `${base}videos/ads-motion.mp4`, video: true, label: "Guerrilla Tactics" };
const activations: Media = { src: `${base}videos/ads-activation.mp4`, video: true, label: "Brand Activations" };

function Frame({ media, className, delay = 0 }: { media: Media; className?: string; delay?: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={`group relative overflow-hidden border border-white/8 ${className ?? ""}`}
      data-testid={`ads-frame-${media.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {media.video ? (
        <video
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={media.src}
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
    </motion.figure>
  );
}

export default function AdsCampaign() {
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

      {/* Image grid */}
      <div className="relative px-8 md:px-14 pb-24 md:pb-32 space-y-4 md:space-y-5">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <Frame media={brandFilm} className="lg:col-span-4 aspect-[3/4]" delay={0} />
          <Frame media={outOfHome} className="lg:col-span-8 aspect-[16/9]" delay={0.08} />
        </div>
        {/* Bottom row — tall Social Campaign closes alongside a stacked Polarity / Brand Activations column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 lg:items-stretch">
          <Frame media={social} className="lg:col-span-5 aspect-[3/4] lg:aspect-auto" delay={0.16} />
          <div className="lg:col-span-7 grid gap-4 md:gap-5">
            <Frame media={polarity} className="aspect-[16/9]" delay={0.24} />
            <Frame media={activations} className="aspect-[16/9]" delay={0.32} />
          </div>
        </div>
      </div>
    </section>
  );
}
