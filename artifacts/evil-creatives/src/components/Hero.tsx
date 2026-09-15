import { motion } from "framer-motion";
import { GridFX, Parallax } from "@/components/BackgroundFX";
import Typewriter from "@/components/Typewriter";

const MANIFESTO = `We believe creativity belongs to people who make things.
We write. We design. We code. We prototype. We film. We edit. We build. We bring ideas to life.`;

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-[#f2f0eb] text-[#0d0d0d]">
      {/* Faded "nun" figure as light backdrop */}
      <div className="absolute inset-0 z-0 flex items-center justify-end">
        <Parallax range={70} className="h-full">
          <img
            src="/images/site-img3.png"
            alt=""
            className="h-full w-auto max-w-none object-cover object-center opacity-90 mix-blend-multiply md:translate-x-[10%]"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f2f0eb] via-[#f2f0eb]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f2f0eb] via-transparent to-[#f2f0eb]/60" />
      </div>
      <GridFX light pattern="dots" />

      {/* Content: bottom-left editorial */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 md:px-14 pb-16 pt-32 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-3"
        >
          <div className="w-6 h-[2px] bg-primary" />
          <span className="font-display text-[#0d0d0d]/70 text-xs md:text-sm tracking-[0.25em] uppercase">
            Creative AI Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(4rem,15vw,14rem)] font-display leading-[0.85] tracking-tight mb-8 max-w-5xl"
        >
          <span className="block text-[#0d0d0d]">EVIL</span>
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(13,13,13,0.85)' }}
          >
            CREATIVES
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <p className="font-display text-base md:text-xl text-[#0d0d0d]/60 tracking-[0.1em] uppercase max-w-2xl">
            Brands Development · Video Production · Design · Narrative Systems · AI Products · MULTIMEDIA Experiences
          </p>

          <a
            href="#ads-campaign"
            data-testid="link-view-work"
            className="group flex items-center gap-4 border border-[#0d0d0d]/25 hover:border-primary px-6 py-3 transition-colors font-display text-sm tracking-widest uppercase text-[#0d0d0d]/70 hover:text-primary shrink-0"
          >
            View Work
            <span className="block w-4 h-[1px] bg-current group-hover:w-8 transition-all duration-300" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 max-w-2xl border-l-2 border-primary/60 pl-5"
        >
          <Typewriter
            text={MANIFESTO}
            startDelay={1200}
            speed={22}
            className="block font-mono text-sm md:text-base leading-relaxed text-[#0d0d0d]/75 whitespace-pre-line"
            cursorClassName="text-primary"
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 right-10 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#0d0d0d]/30" />
        <span className="font-display text-[9px] tracking-[0.3em] text-[#0d0d0d]/40 uppercase rotate-90 origin-center mt-3">Scroll</span>
      </motion.div>
    </section>
  );
}
