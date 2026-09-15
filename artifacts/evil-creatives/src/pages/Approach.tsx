import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { GridFX, Parallax } from "@/components/BackgroundFX";
import Typewriter from "@/components/Typewriter";

const APPROACH_MANIFESTO = `We come from the worlds of art, branding, storytelling — and code. Isn’t coding the literature of the present? And can human beings survive without the nuance of a novel, the emotion of a brushstroke, the rhythm of a bass-line?

We don’t choose between the two worlds. We mesh both to build the creative systems of tomorrow.`;

const marketProblems = [
  "Generation is no longer the bottleneck.",
  "Meaning does not scale automatically.",
  "Interpretation is the new competitive advantage.",
];

const evilBenefits = [
  "On Brand",
  "High Creative Control",
  "Infinite Possibilities & Variations",
  "Scalable Workflows Built for the Future",
  "Model-Trained, Not Prompt-Randomized",
  "Creative Output That Learns & Improves",
];

function Bar({ left, right, light }: { left: string; right: string; light?: boolean }) {
  const base = light ? "border-[#0d0d0d]/12" : "border-white/8";
  const a = light ? "text-[#0d0d0d]/50" : "text-white/40";
  const b = light ? "text-[#0d0d0d]/40" : "text-white/30";
  return (
    <div className={`relative z-10 border-b ${base} px-8 md:px-14 py-4 flex items-center justify-between`}>
      <span className={`font-display text-xs tracking-[0.25em] ${a} uppercase`}>{left}</span>
      <span className={`font-display text-xs tracking-[0.2em] ${b} uppercase`}>{right}</span>
    </div>
  );
}

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(11,10,22,0.75)] border-b border-white/8 px-8 md:px-14 py-5 flex items-center justify-between">
        <Link
          href="/"
          data-testid="link-home-wordmark"
          className="font-display text-sm tracking-[0.25em] uppercase text-white hover:text-primary transition-colors"
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

      {/* 1 — Manifesto hero (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-b border-[#0d0d0d]/12">
        {/* Manifesto glitch portrait backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-manifesto.png`}
            alt=""
            className="h-full w-full object-cover object-center opacity-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2f0eb]/90 via-[#f2f0eb]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f2f0eb]/85 via-transparent to-[#f2f0eb]/30" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(224,176,2,0.14),transparent_55%)]" />
        <GridFX light pattern="dots" />
        <div className="relative z-10 px-8 md:px-14 pt-20 md:pt-28 pb-20">
          <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-6">Our Approach / The EVIL Method</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(2.3rem,6.2vw,6rem)] font-display leading-[0.92] max-w-6xl mb-10"
          >
            Human Creativity,<br />Empowering<br /><span className="text-primary">Audacious Imagination</span>.
          </motion.h1>
          <div ref={ref}>
            <Typewriter
              text={APPROACH_MANIFESTO}
              start={inView}
              speed={14}
              startDelay={300}
              className="block font-mono text-base md:text-lg leading-relaxed text-[#0d0d0d]/75 whitespace-pre-line max-w-2xl border-l-2 border-primary pl-5"
              cursorClassName="text-primary"
            />
          </div>
        </div>
      </section>

      {/* 2 — The new canvas (dark) */}
      <section className="relative overflow-hidden border-b border-white/8">
        <GridFX pattern="grid" />
        <Bar left="The New Canvas" right="AI × Creative" />
        <div className="relative z-10 px-8 md:px-14 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-display leading-[0.9] mb-8">
              Execution Becomes<br /><span className="text-primary">Exploratory</span>.
            </h2>
            <p className="text-white/60 font-sans text-lg font-light leading-relaxed max-w-xl mb-6">
              The traditional process moved in one line — pre-production, production,
              post-production, distribution. With AI, each step generates new possibilities and
              each round of execution produces new branches of exploration.
            </p>
            <p className="text-white/80 font-sans text-lg leading-relaxed max-w-xl mb-10">
              The system yields iterations, variations and expansions — leading to infinite creative loops.
            </p>
            <blockquote className="border-l-2 border-primary pl-6 max-w-xl">
              <p className="font-display text-2xl md:text-3xl leading-tight mb-4">
                “The persistence of the work is the guarantee of its communicative possibilities — and of its aesthetic experience.”
              </p>
              <cite className="font-display text-[11px] tracking-[0.2em] uppercase text-white/40 not-italic">Umberto Eco — The Open Work</cite>
            </blockquote>
          </div>
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,176,2,0.18),transparent_65%)]" />
            <Parallax range={50} className="relative">
              <motion.img
                src={`${import.meta.env.BASE_URL}images/approach-cyber.png`}
                alt="A cybernetic figure — human and machine meshed into one"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-h-[560px] w-auto object-contain drop-shadow-2xl -scale-x-100"
                data-testid="img-approach-cyber"
              />
            </Parallax>
          </div>
        </div>
      </section>

      {/* 3 — Market POV (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-b border-[#0d0d0d]/12">
        <GridFX light pattern="dots" />
        <Bar left="Where The Market Is Heading" right="The Half-Baked AI Playbook" light />
        <div className="relative z-10 px-8 md:px-14 py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
            <div className="lg:col-span-7 lg:order-2 flex flex-col justify-center">
              <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-display leading-[0.95] mb-8">
                AI Can Generate.<br />Only Humans <span className="text-primary">Breathe Meaning</span>.
              </h2>
              <p className="text-[#0d0d0d]/60 font-sans text-lg font-light leading-relaxed max-w-xl">
                Generative AI has made production abundant. Meaning remains scarce. The challenge is
                no longer creating content, but organizing interpretation across products, campaigns,
                systems, and experiences.
              </p>
            </div>
            <div className="lg:col-span-5 lg:order-1">
              <Parallax range={40}>
                <motion.img
                  src={`${import.meta.env.BASE_URL}images/approach-lipstick.png`}
                  alt="A surreal city skyline rendered as towering lipsticks"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="w-full aspect-[4/5] object-cover object-center [mask-image:linear-gradient(to_bottom,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_right,#000_55%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_right,#000_55%,transparent_100%)] [-webkit-mask-composite:source-in]"
                  data-testid="img-approach-lipstick"
                />
              </Parallax>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#0d0d0d]/12 border border-[#0d0d0d]/12">
            {marketProblems.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#f2f0eb] px-8 py-12"
                data-testid={`market-problem-${i}`}
              >
                <span className="font-display text-5xl text-primary/40 leading-none block mb-6">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-xl md:text-2xl leading-tight uppercase tracking-wide text-[#0d0d0d]/85">{p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — EVIL AI: Emotional Craft × AI Superpower (dark) */}
      <section className="relative overflow-hidden border-b border-white/8">
        <GridFX pattern="grid" />
        <Bar left="EVIL AI" right="Emotional Craft × AI Superpower" />
        <div className="relative z-10 px-8 md:px-14 py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
            <div className="lg:col-span-7">
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-display leading-[0.9] mb-6">
                Emotional Craft <span className="text-primary">×</span><br />AI Superpower.
              </h2>
              <p className="text-white/60 font-sans text-lg font-light leading-relaxed max-w-xl mb-10">
                The soul of a story, engineered with the precision of a machine. We fuse human
                emotion with mechanical control — that is the EVIL standard.
              </p>
              <blockquote className="border-l-2 border-primary pl-6 max-w-xl">
                <p className="font-display text-2xl md:text-3xl leading-tight mb-4">
                  “I am interested in the cracks of technology. In other words, errors and noise. They are the things that really interest me, and I wonder whether new cultural trends could emerge from this deficiency.”
                </p>
                <cite className="font-display text-[11px] tracking-[0.2em] uppercase text-white/40 not-italic">Ryuichi Sakamoto — “Tokyo Melody”</cite>
              </blockquote>
            </div>
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,176,2,0.16),transparent_65%)]" />
              <Parallax range={40} className="relative">
                <motion.img
                  src={`${import.meta.env.BASE_URL}images/approach-heart.png`}
                  alt="A mechanical heart forged from brass and steel"
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-h-[420px] w-auto object-contain drop-shadow-2xl"
                  data-testid="img-approach-heart"
                />
              </Parallax>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {evilBenefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-background px-7 py-7 flex items-center gap-4"
                data-testid={`evil-benefit-${i}`}
              >
                <span className="font-display text-primary text-lg">✓</span>
                <span className="font-display text-sm md:text-base uppercase tracking-wide text-white/80 leading-tight">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Hacking the chaos with clarity (bright) */}
      <section className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d] border-b border-[#0d0d0d]/12">
        <GridFX light pattern="dots" />
        <Bar left="This. Is. How. We. Do." right="Systems, Not Tools" light />
        <div className="relative z-10 px-8 md:px-14 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-display leading-[0.9] mb-8">
              Hacking The Chaos<br />With <span className="text-primary">Clarity</span>.
            </h2>
            <p className="text-[#0d0d0d]/60 font-sans text-lg font-light leading-relaxed max-w-xl">
              We build systems, code stories and dig for meaning. We connect creative talent with a
              technical skillset — custom LoRA model training, smart prompting, scalable workflows
              and an affordable, controllable tech stack, infused with human acumen.
            </p>
          </div>
          <div className="lg:col-span-6 flex flex-col justify-center gap-8 border-l border-[#0d0d0d]/12 lg:pl-10">
            <div>
              <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-3">We Connect Dots</p>
              <p className="text-[#0d0d0d]/70 font-sans leading-relaxed">
                Your own AI. Fine-tuned identity. Your style, your world, your essence — encoded into the model.
              </p>
            </div>
            <div>
              <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-3">We Scale</p>
              <p className="text-[#0d0d0d]/70 font-sans leading-relaxed">
                We integrate workflow design and AI model training at the execution level. Every
                creative decision becomes part of a scalable system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Closing statement (dark, full-bleed) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(224,176,2,0.14),transparent_60%)]" />
        <GridFX pattern="grid" />
        <div className="relative z-10 px-8 md:px-14 py-28 md:py-36 text-center">
          <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-10">A Shadow Network Disguised As A Collective</p>
          <h2 className="text-[clamp(2rem,5.5vw,5rem)] font-display leading-[0.95] max-w-5xl mx-auto mb-12">
            “The greatest trick Evil Creatives ever pulled was convincing the world we
            <span className="text-primary"> didn’t exist</span>.”
          </h2>
          <p className="text-white/55 font-sans text-lg font-light max-w-xl mx-auto mb-12">
            We trade in visions, nightmares and stolen sparks of genius. Tradition, boldness and
            scalability — EVIL-level precision, human-level impact.
          </p>
          <a
            href="mailto:unleash@evilcreatives.com"
            data-testid="link-approach-cta"
            className="inline-flex items-center gap-3 border border-primary/60 text-primary font-display text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-primary hover:text-black transition-colors"
          >
            Join Us
            <span>→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
