import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { GridFX } from "@/components/BackgroundFX";

const pillars = [
  {
    title: "Product Strategy",
    body: "Define the opportunity, the audience, the workflow and the commercial value before selecting the model.",
  },
  {
    title: "AI Architecture",
    body: "Build intelligence around context: data, rules, constraints, domain logic and usable outputs.",
  },
  {
    title: "Experience Design",
    body: "Turn complex AI workflows into interfaces people can understand, trust and use.",
  },
  {
    title: "Rapid Execution",
    body: "Prototype, test, iterate and deploy with a small team and production-aware tools.",
  },
];

const products = [
  {
    num: "01",
    name: "LUMEN",
    url: "https://www.visit-lumen.com/",
    tag: "World Activation Engine",
    meta: "Attractions / Museums / Parks / Visitor Media",
    goal: "Turn attractions into media ecosystems.",
    approach: "Organizations upload the world. LUMEN understands it, activates visitors through personalized media and extends the experience beyond the exit.",
    style: "Premium, cinematic and entertainment-driven. The product should feel like a portal into a brand world, not an admin tool.",
    achievement: "Creates a new layer of engagement and monetization for parks, museums, cruises, live events and cultural destinations.",
    image: "images/product-lumen.png",
  },
  {
    num: "02",
    name: "IKI",
    url: "https://iki-pink.vercel.app",
    tag: "Creative AI for Fashion Content",
    meta: "Brand Memory / Sketch-to-Image / Human Review",
    goal: "Generate fashion content at AI scale without altering products, diluting identity or breaking visual consistency.",
    approach: "Product assets, approved references, brand rules and narrative direction become a persistent brand memory that guides and validates every generation: Sketch → Brand Memory → Generation → Human Review.",
    style: "Calm, tactile and studio-like. A drawing canvas instead of a prompt box, so designers stay in control of the idea.",
    achievement: "AI-scale content production that keeps product accuracy, visual consistency and fidelity to the brand.",
    image: "images/product-iki.jpg",
  },
  {
    num: "03",
    name: "STORYLINE",
    url: "https://storyline-one.vercel.app",
    tag: "Narrative Intelligence Platform",
    meta: "Archives / Letters / Canon Management / Authorship",
    goal: "Transform fragmented archives into coherent stories.",
    approach: "Built for authors, historians, researchers, museums and documentary teams working with letters, diaries, notes, interviews and historical material.",
    style: "Editorial, archival and research-driven. The product treats writing as reconstruction, not automation.",
    achievement: "Turns scattered documents into timelines, relationships, contradictions, themes and narrative structures — a canon system for reality.",
    image: "images/product-storyline.png",
  },
  {
    num: "04",
    name: "MARKET-AGENT",
    url: "https://market-agent-lime-gamma.vercel.app",
    tag: "Autonomous Marketing Operator",
    meta: "Product Brain / Market Research / Campaigns / Channel Execution",
    goal: "Give every project an autonomous marketing operator that turns source material into accurate, approved campaigns and measurable growth.",
    approach: "Market Agent learns each brand from its sources, researches its market, combines independent strategic perspectives, and prepares or executes approved work through connected channels.",
    style: "Clear, proactive, brand-aware, evidence-led, and concise—never repetitive, superficial, pushy, or invented.",
    achievement: "Users move from raw documents and connected accounts to ready-to-publish campaigns, assets, distribution, and performance insight with minimal manual work.",
    image: "images/product-market-agent.png",
  },
  {
    num: "05",
    name: "CC GEO LAB",
    url: "https://www.ccexplorations.com/geolab",
    tag: "AI Geospatial Intelligence",
    meta: "3D Data Visualization / Anomaly Interpretation / Decision Support",
    goal: "Transform raw exploration datasets into interpretable intelligence.",
    approach: "Combines 3D visualization, resource overlays, anomaly interpretation and AI-assisted analysis inside an interactive Cesium environment.",
    style: "Technical, cinematic and data-driven. The system makes scientific complexity visually inspectable.",
    achievement: "Reduces the distance between data acquisition and actionable exploration decisions.",
    image: "images/product-geoapp.png",
  },
  {
    num: "06",
    name: "CC GEOTARGET",
    url: "https://www.ccexplorations.com/#form",
    tag: "Geospatial Intake Platform",
    meta: "AOI Definition / KMZ Generation / Survey Qualification",
    goal: "Reduce friction between survey inquiry and technical evaluation.",
    approach: "The client defines an area of interest, selects survey needs, uploads geospatial data and produces a structured request that can be qualified by AI.",
    style: "Operational, scientific and clear. It makes a complex technical sales process feel simple and credible.",
    achievement: "Turns geospatial lead qualification into an interactive product instead of an email chain.",
    image: "images/product-geotarget.png",
  }
];

const capabilities = [
  { title: "AI Product Design", body: "From opportunity definition to functional prototype." },
  { title: "Domain Intelligence", body: "AI systems shaped around a specific discipline or market." },
  { title: "Narrative Systems", body: "Canon, archives, timelines, character logic and authorship support." },
  { title: "Geospatial Intelligence", body: "Maps, 3D environments, survey workflows and analytical interfaces." },
  { title: "Experience Platforms", body: "Visitor activation, persistent engagement and new monetization layers." },
  { title: "Rapid Prototyping", body: "Lean production from concept to deployed application." },
];

const detailFields: { label: string; key: "goal" | "approach" | "style" | "achievement" }[] = [
  { label: "Goal", key: "goal" },
  { label: "Approach", key: "approach" },
  { label: "Style", key: "style" },
  { label: "Achievement", key: "achievement" },
];

function ProductShot({
  num,
  src,
  alt,
  dark = true,
}: {
  num: string;
  src: string;
  alt: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`lg:col-span-5 relative overflow-hidden border ${
        dark ? "border-white/10 bg-white/[0.02]" : "border-[#0d0d0d]/12 bg-[#0d0d0d]/[0.02]"
      }`}
    >
      <span
        className={`absolute top-3 left-4 z-10 font-display text-5xl leading-none select-none ${
          dark ? "text-white/10" : "text-[#0d0d0d]/10"
        }`}
      >
        {num}
      </span>
      <img src={src} alt={alt} loading="lazy" className="w-full h-auto block" />
    </div>
  );
}

export default function AppDevelopmentDetail() {
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
          Back To Home Page
        </Link>
      </header>

      {/* Hero (dark) */}
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(224,176,2,0.12),transparent_55%)]" />
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 pt-20 md:pt-28 pb-16">
          <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-6">
            App Development / AI Products
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.6rem,7vw,7rem)] font-display leading-[0.88] max-w-5xl mb-8"
          >
            Domain Intelligence,<br />Made <span className="text-primary">Tangible</span>.
          </motion.h1>
          <p className="text-white/65 font-sans leading-relaxed text-lg font-light max-w-2xl">
            Six AI products across sport, narrative, geospatial, learning and live experience —
            each engineered around a specific discipline, with the strategy, interface and
            deployment to match.
          </p>
        </div>
      </section>

      {/* Methodology (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-t border-[#0d0d0d]/12">
        <GridFX light pattern="dots" />
        <div className="relative z-10 px-8 md:px-14 py-5 border-b border-[#0d0d0d]/12">
          <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/50 uppercase">From Idea To AI Product</span>
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

      {/* Product families label (dark) */}
      <section className="relative overflow-hidden border-t border-white/8">
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 py-5">
          <span className="font-display text-xs tracking-[0.25em] text-white/40 uppercase">Product Families</span>
        </div>
      </section>

      {/* Products — each product alternates bright / dark */}
      {products.map((p, i) => {
        const dark = i % 2 === 1;
        return (
          <section
            key={p.name}
            className={`relative overflow-hidden border-t ${
              dark ? "border-white/8" : "bg-[#f2f0eb] text-[#0d0d0d] border-[#0d0d0d]/12"
            }`}
          >
            <GridFX light={!dark} pattern={dark ? "grid" : "dots"} />
            <motion.article
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="relative z-10 px-8 md:px-14 py-14"
              data-testid={`detail-product-${p.num}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Screenshot */}
                <ProductShot
                  num={p.num}
                  src={`${import.meta.env.BASE_URL}${p.image}`}
                  alt={p.name}
                  dark={dark}
                />

                {/* Detail */}
                <div className="lg:col-span-7">
                  <p className="font-display text-[11px] tracking-[0.22em] text-primary uppercase mb-3">{p.tag}</p>
                  <h2 className="text-4xl md:text-5xl font-display leading-none mb-3">{p.name}</h2>
                  <p className={`font-display text-[11px] tracking-[0.18em] uppercase mb-8 ${dark ? "text-white/40" : "text-[#0d0d0d]/50"}`}>{p.meta}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
                    {detailFields.map((f) => (
                      <div key={f.label}>
                        <p className="font-display text-[10px] tracking-[0.25em] text-primary uppercase mb-2">{f.label}</p>
                        <p className={`font-sans text-sm leading-relaxed font-light ${dark ? "text-white/65" : "text-[#0d0d0d]/65"}`}>{p[f.key]}</p>
                      </div>
                    ))}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-visit-${p.num}`}
                    className="group mt-10 inline-flex items-center gap-3 border border-primary/60 text-primary font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-background transition-colors"
                  >
                    Visit {p.name}
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                </div>
              </div>

            </motion.article>
          </section>
        );
      })}

      {/* Capability summary (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-t border-[#0d0d0d]/12">
        <GridFX light pattern="dots" />
        <div className="relative z-10 px-8 md:px-14 py-5 border-b border-[#0d0d0d]/12">
          <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/50 uppercase">Capability Summary</span>
        </div>
        <div className="relative z-10 px-8 md:px-14 pt-12 pb-4">
          <p className="text-[#0d0d0d]/65 font-sans leading-relaxed text-base font-light max-w-3xl mb-10">
            A practical AI product-development model: using AI to accelerate coding, data
            interpretation, visual exploration, content generation and workflow design while
            keeping the critical decisions human — strategy, taste, structure, positioning and
            business logic.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-[#0d0d0d]/12">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-8 md:px-10 py-10 border-b border-[#0d0d0d]/12 lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r sm:[&:nth-child(odd)]:border-r lg:sm:[&:nth-child(odd)]:border-r"
            >
              <p className="font-display text-primary text-sm tracking-[0.05em] uppercase mb-4">{c.title}</p>
              <p className="text-[#0d0d0d]/65 font-sans text-sm leading-relaxed font-light">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tagline (dark) */}
      <section className="relative overflow-hidden border-t border-b border-white/8 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(224,176,2,0.12),transparent_60%)]" />
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 py-20">
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-display leading-[0.95]">
            We do not build prompts.<br /><span className="text-primary">We build products.</span>
          </h2>
          <Link
            href="/"
            data-testid="link-back-home-bottom"
            className="group mt-12 inline-flex items-center gap-3 border border-primary/60 text-primary font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-background transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back To Home Page
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
