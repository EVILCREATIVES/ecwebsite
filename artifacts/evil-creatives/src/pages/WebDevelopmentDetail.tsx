import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { GridFX } from "@/components/BackgroundFX";

const pillars = [
  {
    title: "AI-Assisted Coding",
    body: "Rapid interface development, component iteration, responsive layout, deployment support, and faster prototyping cycles.",
  },
  {
    title: "Generative Content",
    body: "Copy exploration, message hierarchy, headline testing, visual concept development, and category-specific storytelling.",
  },
  {
    title: "Human Creative Direction",
    body: "Positioning, tone, structure, taste, editing, client logic, and final decision-making remain intentionally human.",
  },
  {
    title: "Lean Production",
    body: "Small-team execution with the speed of AI tools and the judgment of senior creative and product experience.",
  },
];

const projects = [
  {
    num: "01",
    name: "CC Explorations",
    url: "www.ccexplorations.com",
    category: "Satellite Mineral Exploration / Deep-Tech Corporate",
    goal: "Translate satellite-based resource exploration into a credible, investor-facing narrative.",
    approach: "Balance scientific ambition with commercial clarity and a structured information hierarchy.",
    style: "Serious, technical, trustworthy.",
    achievement: "A deep-tech story made legible to investors without losing scientific weight.",
    image: "images/web-ccexplorations.png",
  },
  {
    num: "02",
    name: "Copper Nano",
    url: "www.coopernano.com",
    category: "Industrial Product / Technical Sales Landing",
    goal: "Present copper nanoparticles as a serious, verifiable industrial product.",
    approach: "Treat 99.999% purity and lab verification as evidence, not decoration.",
    style: "Precise, industrial, evidence-led.",
    achievement: "A technical sales landing that earns trust through proof.",
    image: "images/web-coppernano.png",
  },
  {
    num: "03",
    name: "QuickTime",
    url: "www.quicktime.com",
    category: "Retail Fuel / Convenience Brand",
    goal: "Reframe a convenience-and-fuel concept for investors and the public.",
    approach: "Center neighborhood improvement, cleaner design, and modern mobility.",
    style: "Clean, optimistic, community-minded.",
    achievement: "A retail brand repositioned around progress rather than commodity.",
    image: "images/web-quicktime.png",
  },
  {
    num: "04",
    name: "Encore Family Entertainment",
    url: "encorefamilyentertainment.com",
    category: "Entertainment Destination / Investor Concept",
    goal: "Make a next-generation immersive destination feel like a real entertainment property.",
    approach: "Epic, cinematic worldbuilding that elevates the concept above a pitch deck.",
    style: "Immersive, theatrical, premium.",
    achievement: "An investor concept that reads as a destination brand, not a slide.",
    image: "images/web-encore.png",
  },
];

const detailFields: { label: string; key: keyof (typeof projects)[number] }[] = [
  { label: "Goal", key: "goal" },
  { label: "Approach", key: "approach" },
  { label: "Style", key: "style" },
  { label: "Achievement", key: "achievement" },
];

function Screenshot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <img src={src} alt={alt} loading="lazy" className="w-full h-auto block" />
    </div>
  );
}

export default function WebDevelopmentDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(11,10,22,0.75)] border-b border-white/8 px-8 md:px-14 py-5 flex items-center justify-between">
        <Link
          href="/"
          data-testid="link-home-wordmark"
          className="font-display text-sm tracking-[0.25em] uppercase hover:text-primary transition-colors"
        >
          Evil Creatives
        </Link>
        <Link
          href="/"
          data-testid="link-back-home"
          className="group inline-flex items-center gap-2 font-display text-[11px] tracking-[0.25em] uppercase text-white/60 hover:text-primary transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back To Site
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 pt-20 md:pt-28 pb-16">
        <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-6">
          AI-Assisted Website Development
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[clamp(2.6rem,7vw,7rem)] font-display leading-[0.88] max-w-5xl mb-8"
        >
          Senior Direction,<br />AI-Accelerated <span className="text-primary">Execution</span>
        </motion.h1>
        <p className="text-white/60 font-sans leading-relaxed text-lg font-light max-w-2xl">
          Four recent builds — deep-tech, industrial, retail and entertainment — where positioning
          and art direction stay human while AI compresses the production cycle. Here's how each
          one came together.
        </p>
        </div>
      </section>

      {/* Method pillars (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-t border-[#0d0d0d]/12">
        <GridFX light pattern="dots" />
        <div className="relative z-10 px-8 md:px-14 py-5 border-b border-[#0d0d0d]/12">
          <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/50 uppercase">How The Work Gets Made</span>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="px-8 md:px-10 py-10 border-b border-[#0d0d0d]/12 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 border-[#0d0d0d]/12"
            >
              <p className="font-display text-primary text-sm tracking-[0.05em] uppercase mb-4">{p.title}</p>
              <p className="text-[#0d0d0d]/65 font-sans text-sm leading-relaxed font-light">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects — each project alternates dark / bright */}
      {projects.map((p, i) => {
        const dark = i % 2 === 0;
        return (
          <section
            key={p.name}
            className={`relative overflow-hidden border-t ${
              dark ? "border-white/8" : "bg-[#f2f0eb] text-[#0d0d0d] border-[#0d0d0d]/12"
            }`}
          >
            <GridFX light={!dark} pattern={dark ? "grid" : "dots"} />
            {i === 0 && (
              <div className="relative z-10 px-8 md:px-14 py-5 border-b border-white/8">
                <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">Selected Projects</span>
              </div>
            )}
            <motion.article
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10 px-8 md:px-14 py-14"
              data-testid={`detail-project-${p.num}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                <div className="lg:col-span-4">
                  <div className={`font-display text-2xl leading-none mb-4 ${dark ? "text-white/15" : "text-[#0d0d0d]/20"}`}>{p.num}</div>
                  <h2 className="text-4xl md:text-5xl font-display leading-none mb-3">{p.name}</h2>
                  <p className={`font-sans text-xs mb-3 ${dark ? "text-white/35" : "text-[#0d0d0d]/45"}`}>{p.url}</p>
                  <p className={`font-display text-[11px] tracking-[0.18em] uppercase leading-relaxed max-w-xs ${dark ? "text-white/45" : "text-[#0d0d0d]/55"}`}>
                    {p.category}
                  </p>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
                  {detailFields.map((f) => (
                    <div key={f.label}>
                      <p className="font-display text-[10px] tracking-[0.25em] text-primary uppercase mb-2">{f.label}</p>
                      <p className={`font-sans text-sm leading-relaxed font-light ${dark ? "text-white/65" : "text-[#0d0d0d]/65"}`}>{p[f.key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot */}
              <Screenshot
                src={`${import.meta.env.BASE_URL}${p.image}`}
                alt={`${p.name} website`}
                className={`mt-10 border ${dark ? "border-white/10 bg-white/[0.02]" : "border-[#0d0d0d]/12 bg-[#0d0d0d]/[0.02]"}`}
              />
            </motion.article>
          </section>
        );
      })}

      {/* Closing back link (dark) */}
      <section className="relative overflow-hidden border-t border-b border-white/8">
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 py-12">
          <Link
            href="/"
            data-testid="link-back-home-bottom"
            className="group inline-flex items-center gap-3 border border-primary/60 text-primary font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-background transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back To Site
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
