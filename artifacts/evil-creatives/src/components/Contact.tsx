import { motion } from "framer-motion";
import EvilLogo from "@/components/EvilLogo";
import { GridFX, Parallax } from "@/components/BackgroundFX";

export default function Contact() {
  return (
    <section id="contact" className="bg-[#f2f0eb] text-[#0d0d0d] border-t border-[#0d0d0d]/12 relative overflow-hidden">
      <GridFX light pattern="dots" />
      {/* Section label bar */}
      <div className="relative z-10 border-b border-[#0d0d0d]/12 px-8 md:px-14 py-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.25em] text-[#0d0d0d]/40 uppercase">Contact</span>
        <span className="font-display text-xs tracking-[0.2em] text-[#0d0d0d]/30 uppercase">Start a Project</span>
      </div>

      <div className="relative z-10 px-8 md:px-14 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: CTA */}
          <div className="lg:col-span-7">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(3rem,7vw,7rem)] font-display leading-[0.88] mb-10"
            >
              Ready to<br />
              <span className="text-primary">Unleash</span><br />
              Your Vision?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-[#0d0d0d]/55 font-sans text-base font-light leading-relaxed max-w-md mb-12"
            >
              We work with brands, organizations, and founders who need more than an AI demo — they need a product. Tell us what you're building.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              href="mailto:unleash@evilcreatives.com"
              data-testid="link-email"
              className="inline-flex items-center gap-4 bg-primary text-black font-display text-sm tracking-widest uppercase px-8 py-4 hover:bg-[#0d0d0d] hover:text-white transition-colors"
            >
              unleash@evilcreatives.com
              <span className="text-lg leading-none">→</span>
            </motion.a>
          </div>

          {/* Right: logo + social */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-between gap-12"
          >
            <Parallax range={30}>
              <EvilLogo className="h-32 md:h-40 w-auto text-[#0d0d0d] opacity-90" />
            </Parallax>

            <div className="flex flex-col gap-4">
              <p className="font-display text-[10px] tracking-[0.25em] text-[#0d0d0d]/30 uppercase mb-2">Connect</p>
              <a
                href="https://www.linkedin.com/company/evilcreatives"
                target="_blank"
                rel="noreferrer"
                data-testid="link-linkedin"
                className="font-display text-sm tracking-widest uppercase text-[#0d0d0d]/50 hover:text-primary transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://instagram.com/evilcreatives"
                target="_blank"
                rel="noreferrer"
                data-testid="link-instagram"
                className="font-display text-sm tracking-widest uppercase text-[#0d0d0d]/50 hover:text-primary transition-colors"
              >
                Instagram ↗
              </a>
              <a
                href="http://www.evilcreatives.com"
                target="_blank"
                rel="noreferrer"
                data-testid="link-website"
                className="font-display text-sm tracking-widest uppercase text-[#0d0d0d]/50 hover:text-primary transition-colors"
              >
                evilcreatives.com ↗
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
