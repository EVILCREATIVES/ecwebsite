import { motion } from "framer-motion";
import { Link } from "wouter";
import { GridFX } from "@/components/BackgroundFX";

const screens = [
  { src: "images/web-ccexplorations.png", label: "CC Explorations", category: "Deep-Tech Corporate" },
  { src: "images/web-coppernano.png", label: "Copper Nano", category: "Industrial Product" },
  { src: "images/web-quicktime.png", label: "QuickTime", category: "Retail" },
  { src: "images/web-encore.png", label: "Encore", category: "Entertainment" },
];

export default function WebDevelopment() {
  return (
    <section id="web-development" className="relative bg-[#f2f0eb] text-[#0d0d0d] border-t border-[#0d0d0d]/12">
      <GridFX light pattern="dots" />
      {/* Section label bar */}
      <div className="relative z-10 border-b border-[#0d0d0d]/12 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/40 uppercase">AI-Assisted Website Development</span>
        <span className="font-display text-xs tracking-[0.2em] text-[#0d0d0d]/30 uppercase">Capability</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* Teaser copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 px-8 md:px-14 py-16 md:py-24 flex flex-col justify-center lg:border-r border-[#0d0d0d]/12"
        >
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-display leading-[0.9] mb-6">
            Websites, Built<br />As <span className="text-primary">Brand Worlds</span>
          </h2>
          <p className="text-[#0d0d0d]/60 font-sans leading-relaxed text-base font-light max-w-xl mb-9">
            A hybrid production system pairing senior creative direction with AI-accelerated
            execution — not generic sites made faster, but sharper positioning, stronger visual
            worlds, and more useful business communication on leaner cycles.
          </p>
          <Link
            href="/web-development"
            data-testid="link-web-know-more"
            className="group inline-flex items-center gap-3 self-start border border-primary/60 text-[#0d0d0d] font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-black transition-colors"
          >
            Know More
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Build screenshots — flat, clearly visible, labeled */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-8 px-8 md:px-14 py-16 md:py-20 lg:border-t-0 border-t border-[#0d0d0d]/12">
          {screens.map((s, i) => (
            <motion.figure
              key={s.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
              data-testid={`web-screen-${i}`}
            >
              <div
                className="rounded-lg overflow-hidden border border-black/10 bg-[#111] transition-transform duration-300 group-hover:-translate-y-1.5"
                style={{ boxShadow: "0 24px 50px -28px rgba(0,0,0,0.45)" }}
              >
                {/* browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1b1b1b] border-b border-white/8">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 font-display text-[9px] tracking-[0.2em] uppercase text-white/35">{s.label}</span>
                </div>
                <img
                  src={`${import.meta.env.BASE_URL}${s.src}`}
                  alt={`${s.label} — website built by Evil Creatives`}
                  loading="lazy"
                  className="block w-full aspect-[2000/1198] object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-sm uppercase tracking-wide text-[#0d0d0d]/80">{s.label}</span>
                <span className="font-sans text-xs text-[#0d0d0d]/45">{s.category}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
