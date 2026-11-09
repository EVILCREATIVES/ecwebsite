// The site-wide "Unleash" call to action (opens an email to the studio).
export default function UnleashButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="mailto:unleash@evilcreatives.com"
      data-testid="link-unleash-cta"
      className={`inline-flex items-center border border-primary/70 text-primary font-display text-[11px] tracking-[0.2em] uppercase px-4 py-2 hover:bg-primary hover:text-black transition-colors ${className}`}
    >
      Unleash
    </a>
  );
}
