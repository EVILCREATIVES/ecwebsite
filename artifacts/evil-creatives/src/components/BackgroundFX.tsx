import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

type Pattern = "grid" | "dots";

/**
 * Soft animated background layer: a slowly drifting grid/dot pattern with two
 * floating gold glows. Purely decorative — sits behind content. Respects the
 * user's reduced-motion preference and only animates while on screen, so it is
 * safe to use on every section of every page.
 */
export function GridFX({
  light = false,
  pattern = "grid",
  cell = 64,
}: {
  light?: boolean;
  pattern?: Pattern;
  cell?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px" });
  const active = inView && !reduce;

  const line = light ? "rgba(13,13,13,0.05)" : "rgba(255,255,255,0.045)";
  const dot = light ? "rgba(13,13,13,0.08)" : "rgba(255,255,255,0.06)";
  const fade = "radial-gradient(ellipse at center, #000 35%, transparent 82%)";

  const backgroundImage =
    pattern === "dots"
      ? `radial-gradient(${dot} 1.3px, transparent 1.4px)`
      : `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage,
          backgroundSize: `${cell}px ${cell}px`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
        animate={
          active
            ? {
                backgroundPosition: [
                  "0px 0px",
                  pattern === "dots" ? `${cell}px ${cell}px` : `0px ${cell}px`,
                ],
              }
            : undefined
        }
        transition={
          active ? { duration: 22, ease: "linear", repeat: Infinity } : undefined
        }
      />
      {active && (
        <>
          <motion.div
            className="absolute h-80 w-80 rounded-full blur-3xl"
            style={{
              background: "rgba(224,176,2,0.10)",
              top: "-5rem",
              left: "-3rem",
            }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div
            className="absolute h-72 w-72 rounded-full blur-3xl"
            style={{
              background: "rgba(224,176,2,0.07)",
              bottom: "-5rem",
              right: "-2rem",
            }}
            animate={{
              x: [0, -42, 0],
              y: [0, -26, 0],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Wraps children and translates them vertically as they pass through the
 * viewport, creating a subtle parallax drift. Falls back to a static wrapper
 * when reduced motion is preferred. Pass `style` to override positioning (e.g.
 * an absolute fill that drifts inside an `overflow-hidden` parent).
 */
export function Parallax({
  children,
  range = 60,
  className,
  style,
}: {
  children: ReactNode;
  range?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range], {
    clamp: true,
  });

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ position: "relative", ...style, y }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax for elements that manage their own positioning (e.g. an absolutely
 * positioned image/video fill). Attach the returned `ref` to the element and
 * spread `{ y }` into its motion style. Returns a flat `0` when reduced motion
 * is preferred.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(range = 60) {
  const reduce = useReducedMotion();
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [range, -range],
    { clamp: true },
  );
  return { ref, y };
}
