import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { GridFX } from "@/components/BackgroundFX";
import Typewriter from "@/components/Typewriter";

const ESSAY = `Meaning does not emerge from facts alone. It emerges from interpretation, context, symbols, narratives, and relationships.

This is particularly relevant to artificial intelligence. AI does not reason from truth. It identifies patterns across vast networks of language, images, and associations. Its outputs are not objective facts but probabilistic constructions of meaning. Hallucinations are also potential alternative interpretations generated from the same underlying patterns.

For this reason, we combine generative AI with semiotics, narrative theory, and systems thinking. Rather than focusing on asset generation, we investigate how meaning is produced, organized, and understood.

The result is work that is not only intelligent, but visionaire.`;

const pillars = [
  {
    num: "01",
    title: "Positioning",
    desc: "Define the categories, audiences, tensions, and opportunities that shape how a brand is understood."
  },
  {
    num: "02",
    title: "Narrative Architecture",
    desc: "Organize stories, symbols, relationships, and rules into a coherent framework for people and intelligent systems alike."
  },
  {
    num: "03",
    title: "Experience Design",
    desc: "Translate meaning into products, interfaces, campaigns, and experiences that users can understand, trust, and navigate."
  },
  {
    num: "04",
    title: "Adaptive Execution",
    desc: "Produce, test, refine, and deploy across media, teams, and AI-powered workflows without losing coherence."
  }
];

export default function Methodology() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  return (
    <section id="methodology" className="bg-[#f2f0eb] text-[#0d0d0d] relative overflow-hidden">
      <GridFX light pattern="dots" />
      {/* Top bar: section label */}
      <div className="relative z-10 border-b border-[#0d0d0d]/12 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/50 uppercase">Methodology</span>
        <span className="font-display text-xs tracking-[0.2em] text-[#0d0d0d]/40 uppercase">How We Work</span>
      </div>

      <div className="relative z-10 px-8 md:px-14 py-24 max-w-7xl mx-auto">
        {/* Statement headline */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-display leading-[0.9] text-[#0d0d0d] max-w-4xl mb-8">
            <span className="text-primary">Meaning,</span>
            <br />Not False Truth.
          </h2>
          <Typewriter
            text={ESSAY}
            start={inView}
            speed={14}
            startDelay={300}
            className="block font-mono text-sm md:text-base leading-relaxed text-[#0d0d0d]/70 whitespace-pre-line w-full border-l-2 border-primary pl-5"
            cursorClassName="text-primary"
          />
        </motion.div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#0d0d0d]/12">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group p-8 border-r border-b border-[#0d0d0d]/12 last:border-r-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0 hover:bg-[#0d0d0d] hover:text-white transition-colors duration-300"
              data-testid={`pillar-${i}`}
            >
              <div className="text-5xl font-display text-[#0d0d0d]/10 group-hover:text-white/10 mb-6 transition-colors">{pillar.num}</div>
              <h3 className="text-xl font-display uppercase tracking-wide mb-4 group-hover:text-primary transition-colors">{pillar.title}</h3>
              <p className="text-[#0d0d0d]/60 group-hover:text-white/60 font-sans text-sm leading-relaxed transition-colors">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep-dive into the full approach */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-[#0d0d0d]/12 pt-10"
        >
          <p className="text-[#0d0d0d]/60 font-sans text-base font-light max-w-md leading-relaxed">
            From interpretation to expression — how we turn meaning into products, campaigns, and experiences without losing coherence.
          </p>
          <Link
            href="/approach"
            data-testid="link-methodology-approach"
            className="group inline-flex items-center gap-3 self-start border border-primary/60 text-[#0d0d0d] font-display text-xs tracking-[0.25em] uppercase px-7 py-4 hover:bg-primary hover:text-black transition-colors"
          >
            Our Full Approach
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
