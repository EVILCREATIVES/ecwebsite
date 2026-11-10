import { useEffect, useRef, type RefObject } from "react";

/** How many times a strip's content must be rendered back to back. */
export const COPIES = 2;

/** Repeat `items` until there are at least `min` of them (for short lists). */
export function repeatToMin<T>(items: T[], min: number): T[] {
  if (items.length === 0) return items;
  const out = [...items];
  while (out.length < min) out.push(...items);
  return out;
}

type Options = {
  /** Drift speed in px per second. */
  speed: number;
  /** Speed while the mouse is over the strip. */
  hoverSpeed: number;
  /** Drift towards the right instead of the left. */
  reverse?: boolean;
};

/**
 * Endless horizontal strip, moved with a GPU transform (no native scrolling,
 * so slow drifts glide smoothly instead of stepping pixel by pixel).
 *
 * `viewport` is the clipping element; `track` holds the content rendered
 * COPIES times, and one copy must be at least as wide as the viewport.
 *
 * - Drifts on its own; hovering eases it down to `hoverSpeed`.
 * - Mouse drag and touch swipe (with momentum) in either direction.
 * - Horizontal trackpad / shift+wheel scrolling.
 * - Reduced-motion visitors get no drift but can still drag.
 *
 * Returns a ref that is `true` when the last gesture was a drag, so click
 * handlers can ignore the click that ends a drag.
 */
export function useDriftScroll(
  viewport: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
  { speed, hoverSpeed, reverse = false }: Options,
  deps: unknown[] = [],
) {
  const dragged = useRef(false);

  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = reverse ? -1 : 1;

    let unit = tr.scrollWidth / COPIES;
    const ro = new ResizeObserver(() => (unit = tr.scrollWidth / COPIES));
    ro.observe(tr);

    let offset = 0; // how far the content has moved left, in px (unbounded)
    let hovering = false;
    let holding = false;
    let current = reduce ? 0 : speed;
    let velocity = 0; // momentum after a swipe/drag, px per second
    let last = performance.now();
    let raf = 0;

    const apply = () => {
      if (unit <= 0) return;
      const m = ((offset % unit) + unit) % unit;
      tr.style.transform = `translate3d(${-m}px,0,0)`;
    };

    const tick = (t: number) => {
      const dt = Math.min(t - last, 64) / 1000;
      last = t;
      const target = reduce || holding ? 0 : hovering ? hoverSpeed : speed;
      current += (target - current) * Math.min(1, dt * 3); // ease between speeds
      offset += dir * current * dt;
      if (!holding && Math.abs(velocity) > 1) {
        offset += velocity * dt;
        velocity *= Math.pow(0.04, dt); // momentum fades out over ~1s
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Drag / swipe. Capture only starts once the pointer has really moved,
    // so a plain click or tap still reaches the item underneath.
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastT = 0;
    let pointerId = -1;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      holding = true;
      dragged.current = false;
      velocity = 0;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      startOffset = offset;
      pointerId = e.pointerId;
    };
    const move = (e: PointerEvent) => {
      if (!holding || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragged.current && Math.abs(dx) > 6) {
        dragged.current = true;
        vp.setPointerCapture(pointerId);
        vp.classList.add("cursor-grabbing");
      }
      if (!dragged.current) return;
      offset = startOffset - dx;
      const dtMove = (e.timeStamp - lastT) / 1000;
      if (dtMove > 0) velocity = -(e.clientX - lastX) / dtMove;
      lastX = e.clientX;
      lastT = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (!holding || e.pointerId !== pointerId) return;
      holding = false;
      // No momentum if the pointer paused before letting go.
      if (!dragged.current || e.timeStamp - lastT > 80) velocity = 0;
      velocity = Math.max(-4000, Math.min(4000, velocity));
      if (vp.hasPointerCapture(pointerId)) vp.releasePointerCapture(pointerId);
      vp.classList.remove("cursor-grabbing");
    };
    const enter = (e: PointerEvent) => e.pointerType === "mouse" && (hovering = true);
    const leave = (e: PointerEvent) => e.pointerType === "mouse" && (hovering = false);
    const wheel = (e: WheelEvent) => {
      const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY)) return; // vertical: let the page scroll
      e.preventDefault();
      offset += dx;
      velocity = 0;
    };

    vp.addEventListener("pointerdown", down);
    vp.addEventListener("pointermove", move);
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
    vp.addEventListener("pointerenter", enter);
    vp.addEventListener("pointerleave", leave);
    vp.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vp.removeEventListener("pointerdown", down);
      vp.removeEventListener("pointermove", move);
      vp.removeEventListener("pointerup", up);
      vp.removeEventListener("pointercancel", up);
      vp.removeEventListener("pointerenter", enter);
      vp.removeEventListener("pointerleave", leave);
      vp.removeEventListener("wheel", wheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, hoverSpeed, reverse, ...deps]);

  return dragged;
}
