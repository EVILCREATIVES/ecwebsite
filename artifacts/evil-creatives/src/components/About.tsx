import { motion } from "framer-motion";
import WordCube from "@/components/WordCube";
import { GridFX } from "@/components/BackgroundFX";

const clients = [
  "Amazon", "Samsung", "Google", "NFL", "Sephora",
  "Michael Kors", "Microsoft", "Mercedes-Benz", "JPMorgan",
  "The New York Times", "Wyclef Jean", "Phillips Auction",
  "Aldi", "CC-Explorations", "QuickTime", "Threadline",
];

export default function About() {
  return (
    <section id="studio" className="relative bg-[#0b0a16] text-white overflow-hidden">
      {/* ambient cosmic wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 78% 40%, rgba(109,75,255,0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(224,176,2,0.06), transparent 50%)",
        }}
      />

      <GridFX pattern="dots" />

      {/* Section label bar */}
      <div className="relative border-b border-white/10 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-white/45 uppercase">Studio</span>
        <span className="font-display text-xs tracking-[0.2em] text-white/35 uppercase">Evil Creatives</span>
      </div>

      {/* Statement + cube */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        {/* Left: concept statement */}
        <div className="lg:col-span-5 px-8 md:px-14 py-20 flex flex-col justify-between border-r border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-[11px] tracking-[0.3em] text-primary uppercase mb-8">
              Machine Meets Meaning
            </p>
            <h2 className="text-[clamp(2.6rem,5vw,5rem)] font-display leading-[0.9] mb-10">
              AI Creates<br />Infinite Paths.<br />
              <span className="text-primary">Humans</span> Build<br />The Meaning.
            </h2>
            <p className="text-white/65 font-sans leading-relaxed mb-6 text-base font-light">
              Evil Creatives is a creative AI studio that pairs senior creative direction with AI execution — building intelligent products, narrative systems, and experience platforms for brands ready to move beyond demos.
            </p>
            <p className="text-white/45 font-sans leading-relaxed text-sm font-light">
              The machine generates endless possibility. Taste, strategy, and judgment decide what should exist, why it matters, and how it speaks. Click a word to draw the connections.
            </p>
          </motion.div>

          {/* Clients */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 pt-10 border-t border-white/10"
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-white/40 uppercase mb-6">Clients include</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {clients.map((client, i) => (
                <span key={i} className="text-white/45 font-sans text-sm hover:text-white transition-colors cursor-default">
                  {client}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: interactive word cube */}
        <div className="lg:col-span-7 relative min-h-[520px] lg:min-h-[680px] flex items-center justify-center p-8 md:p-12 lg:p-16">
          <WordCube />
        </div>
      </div>

    </section>
  );
}
