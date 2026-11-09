import { motion } from "framer-motion";
import WordCube from "@/components/WordCube";
import { GridFX } from "@/components/BackgroundFX";

// Add `logo` (path under public/) when a clean logo file is available;
// clients without one render as a styled name.
const clients: { name: string; logo?: string; badge?: boolean }[] = [
  { name: "NFL" },
  { name: "PVH", logo: "images/clients/pvh.png", badge: true },
  { name: "Michael Kors", logo: "images/clients/michael-kors.png" },
  { name: "The New York Times" },
  { name: "Phillips Auction" },
  { name: "Aldi" },
  { name: "CC-Explorations", logo: "images/clients/cc-explorations.png", badge: true },
  { name: "QuickTime", logo: "images/clients/quicktime.png" },
  { name: "Guardian Alarm", logo: "images/clients/guardian-alarm.png", badge: true },
  { name: "GutterMaxx", logo: "images/clients/guttermaxx.png" },
  { name: "SpokenLayer", logo: "images/clients/spokenlayer.png" },
  { name: "Agentio", logo: "images/clients/agentio.png" },
];

function ClientItem({ name, logo, badge, hidden }: { name: string; logo?: string; badge?: boolean; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className="shrink-0 flex items-center px-8 md:px-10 opacity-70 hover:opacity-100 transition-opacity">
      {logo ? (
        <img
          src={`${import.meta.env.BASE_URL}${logo}`}
          alt={name}
          loading="lazy"
          className={`${badge ? "h-10 md:h-12" : "h-5 md:h-6"} w-auto max-w-[220px] object-contain`}
        />
      ) : (
        <span className="font-display text-sm md:text-base tracking-[0.18em] uppercase text-white whitespace-nowrap">
          {name}
        </span>
      )}
    </li>
  );
}

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
        <div className="lg:col-span-5 px-8 md:px-14 py-20 flex flex-col justify-center border-r border-white/10">
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
            <p className="text-white/65 font-sans leading-relaxed text-base font-light">
              Evil Creatives is a creative studio that blends senior creative direction, traditional craft, and AI execution — building intelligent products, narrative systems, and experience platforms for brands ready to scale beyond the unimaginable.
            </p>
          </motion.div>
        </div>

        {/* Right: interactive word cube */}
        <div className="lg:col-span-7 relative min-h-[520px] lg:min-h-[680px] flex items-center justify-center p-8 md:p-12 lg:p-16">
          <WordCube />
        </div>
      </div>

      {/* Clients — full-width rotating banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="relative border-t border-white/10 py-10"
      >
        <p className="px-8 md:px-14 font-display text-[10px] tracking-[0.25em] text-white/40 uppercase mb-6">Clients include</p>
        <div
          className="client-marquee relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <ul className="animate-client-marquee flex w-max items-center py-2" aria-label="Clients">
            {[...clients, ...clients].map((c, i) => (
              <ClientItem key={i} {...c} hidden={i >= clients.length} />
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
