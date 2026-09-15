import { motion } from "framer-motion";
import { GridFX } from "@/components/BackgroundFX";

const caps = [
  { title: "AI Product Design", desc: "From opportunity definition to functional prototype." },
  { title: "Domain Models", desc: "AI systems shaped around a specific discipline or market." },
  { title: "Narrative Systems", desc: "Canon, archives, timelines, character logic and authorship support." },
  { title: "Geospatial Intelligence", desc: "Maps, 3D environments, survey workflows and analytical interfaces." },
  { title: "Immersive Platform", desc: "VR, multimedia, real-time graphics, and interactive environments that extend stories beyond traditional screens." },
  { title: "Rapid Prototyping", desc: "Lean production from concept to deployed application." },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative overflow-hidden bg-[#f2f0eb] text-[#0d0d0d]">
      <GridFX light pattern="dots" />
      {/* Section label bar */}
      <div className="relative z-10 border-b border-[#0d0d0d]/12 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/50 uppercase">Capabilities</span>
        <span className="font-display text-xs tracking-[0.2em] text-[#0d0d0d]/40 uppercase">What We Build</span>
      </div>

      <div className="relative z-10 px-8 md:px-14 pt-20 pb-0 max-w-7xl mx-auto">
        {/* Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[clamp(2.2rem,6vw,6.5rem)] font-display leading-[0.9] text-[#0d0d0d] max-w-4xl mb-20"
        >
          We do not<br />build prompts.<br />
          <span className="text-primary">We build products.</span>
        </motion.h2>
      </div>

      {/* Six capabilities grid */}
      <div className="relative z-10 border-t border-[#0d0d0d]/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {caps.map((cap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="group px-8 md:px-14 py-12 border-b border-r border-[#0d0d0d]/12 last:border-r-0 [&:nth-child(2)]:lg:border-r [&:nth-child(3)]:border-r-0 hover:bg-[#0d0d0d] hover:text-white transition-colors duration-300"
            data-testid={`cap-${i}`}
          >
            <div className="text-3xl font-display text-[#0d0d0d]/10 group-hover:text-white/10 mb-5 transition-colors">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-xl md:text-2xl font-display uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
              {cap.title}
            </h3>
            <p className="text-[#0d0d0d]/55 group-hover:text-white/55 font-sans text-sm leading-relaxed transition-colors">
              {cap.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
