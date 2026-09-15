import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EvilLogo from "@/components/EvilLogo";

const HEADER_LINE = 44;

function luminanceOf(rgb: string) {
  const m = rgb.match(/[\d.]+/g);
  if (!m || m.length < 3) return 1;
  const [r, g, b] = m.map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setMobileOpen(false);

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("section[id], footer"),
      );
      let current: HTMLElement | null = null;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top <= HEADER_LINE && rect.bottom > HEADER_LINE) {
          current = s;
          break;
        }
      }
      if (current) {
        let el: HTMLElement | null = current;
        let lum = 1;
        while (el) {
          const bg = getComputedStyle(el).backgroundColor;
          if (bg && bg !== "transparent" && !bg.startsWith("rgba(0, 0, 0, 0")) {
            lum = luminanceOf(bg);
            break;
          }
          el = el.parentElement;
        }
        setOnLight(lum >= 0.5);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const links = [
    { href: "#gallery", label: "Range" },
    { href: "#methodology", label: "Methodology" },
    { href: "#studio", label: "Studio" },
    { href: "#app-development", label: "Apps" },
    { href: "#web-development", label: "Web" },
    { href: "#capabilities", label: "Capabilities" },
  ];

  // Dark elements (black logo/text) when the section behind the header is light.
  const dark = onLight;
  const headerBg = !scrolled
    ? "rgba(11,10,22,0)"
    : onLight
      ? "rgba(242,240,235,0.92)"
      : "rgba(11,10,22,0.97)";
  const textCls = dark
    ? "text-[#0d0d0d]/55 hover:text-[#0d0d0d]"
    : "text-white/50 hover:text-white";
  const ctaCls = dark
    ? "border-[#0d0d0d]/25 hover:border-primary hover:text-primary text-[#0d0d0d]/70"
    : "border-white/20 hover:border-primary hover:text-primary text-white/60";

  return (
    <>
      <motion.header
        animate={{ backgroundColor: headerBg }}
        transition={{ duration: 0.35 }}
        className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-14 ${
          scrolled ? "backdrop-blur-md" : ""
        } ${scrolled ? (onLight ? "border-b border-[#0d0d0d]/10" : "border-b border-white/10") : ""}`}
      >
        <div className="flex items-center justify-between py-5">
          <a href="#hero" className="flex items-center" data-testid="link-home">
            <EvilLogo
              className={`h-5 md:h-6 w-auto transition-colors ${dark ? "text-[#0d0d0d]" : "text-white"}`}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9 font-display text-[11px] tracking-[0.2em] uppercase">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`link-${link.label.toLowerCase()}`}
                className={`transition-colors ${textCls}`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="mailto:unleash@evilcreatives.com"
              data-testid="link-email-cta"
              className={`border px-4 py-2 transition-colors ${ctaCls}`}
            >
              Unleash
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            data-testid="button-mobile-menu"
          >
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className={`block w-5 h-[1.5px] transition-all ${dark ? "bg-[#0d0d0d]/70" : "bg-white/70"} ${
                  mobileOpen && n === 0
                    ? "rotate-45 translate-y-[6.5px] !bg-white/70"
                    : ""
                } ${mobileOpen && n === 1 ? "opacity-0" : ""} ${
                  mobileOpen && n === 2
                    ? "-rotate-45 -translate-y-[6.5px] !bg-white/70"
                    : ""
                }`}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 bg-[#0c0c0c] flex flex-col items-center justify-center gap-7"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl tracking-widest uppercase text-white/70 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </>
  );
}
