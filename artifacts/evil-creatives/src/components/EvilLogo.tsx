type EvilLogoProps = {
  className?: string;
};

export default function EvilLogo({ className }: EvilLogoProps) {
  return (
    <svg
      viewBox="0 0 909.6 900.5"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="Evil Creatives"
    >
      <rect width="909.6" height="227" />
      <rect x="0" y="673.5" width="909.6" height="227" />
      <rect x="450" y="336.7" width="452.2" height="227" />
    </svg>
  );
}
