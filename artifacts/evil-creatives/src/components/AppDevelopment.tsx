import { motion } from "framer-motion";
import { Link } from "wouter";
import { GridFX } from "@/components/BackgroundFX";

const products = [
  "Matchpoint",
  "Storyline",
  "CC Geotarget",
  "Geo-App",
  "Chess Master",
  "Lumen",
];

export default function AppDevelopment() {
  return (
    <section id="app-development" className="bg-background text-foreground relative overflow-hidden">
      <GridFX pattern="grid" />
      {/* Section label bar */}
      <div className="relative z-10 border-b border-white/8 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">App Development</span>
        <span className="font-display text-xs tracking-[0.2em] text-white/30 uppercase">AI Products</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* Feature image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative min-h-[320px] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/8"
        >
          <video
            src={`${import.meta.env.BASE_URL}videos/feature-app.mp4`}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </motion.div>

        {/* Teaser copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 px-8 md:px-14 py-20 md:py-24 flex flex-col justify-center"
        >
          <h2 className="text-[clamp(2.4rem,5.5vw,5rem)] font-display leading-[0.9] mb-6">
            Gen AI Apps, Built<br />To <span className="text-primary">Ship</span>.
          </h2>
          <p className="text-white/60 font-sans leading-relaxed text-base font-light max-w-xl mb-9">
            A repeatable system for turning client problems into intelligent products —
            domain-specific AI with real strategy, interface design, and deployable systems
            behind it. Not demos. Products that ship.
          </p>

          <div className="mb-10">
            <p className="font-display text-[11px] tracking-[0.3em] text-white/35 uppercase mb-5">Product Families</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10 border-t border-white/8">
              {products.map((name, i) => (
                <li key={name} className="flex items-baseline gap-3 py-3 border-b border-white/8">
                  <span className="font-display text-xs text-white/20 w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-base md:text-lg uppercase tracking-wide text-white/80">{name}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/app-development"
            data-testid="link-app-know-more"
            className="group inline-flex items-center gap-3 self-start border border-primary/60 text-primary font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-background transition-colors"
          >
            Know More
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
