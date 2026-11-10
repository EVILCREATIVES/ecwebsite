import { useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Drift speed in px per second. */
  speed: number;
  /** Speed while the mouse is over the strip. */
  hoverSpeed: number;
  /** Drift towards the left edge instead of the right. */
  reverse?: boolean;
};

/**
 * Makes a horizontally scrollable element drift on its own and loop forever.
 * The element's content must be rendered three times in a row (COPIES), and
 * one copy must be wider than the element. The scroll position is always kept
 * inside the middle copy, so dragging, swiping or trackpad scrolling in either
 * direction never reaches a real edge.
 *
 * - Hovering eases the drift down to `hoverSpeed`.
 * - Mouse drag, touch swipe and trackpad scrolling all work; touch pauses the
 *   drift briefly so native momentum can settle.
 * - Reduced-motion visitors get no drift, but can still scroll and drag.
 *
 * Returns a ref that is `true` when the last pointer gesture was a drag, so
 * click handlers can ignore the click that ends a drag.
 */
/** How many times the strip's content must be rendered. */
export const COPIES = 3;

/** Repeat `items` until there are at least `min` of them (for short lists). */
export function repeatToMin<T>(items: T[], min: number): T[] {
  if (items.length === 0) return items;
  const out = [...items];
  while (out.length < min) out.push(...items);
  return out;
}

export function useDriftScroll(ref: RefObject<HTMLElement | null>, { speed, hoverSpeed, reverse = false }: Options, deps: unknown[] = []) {
  const dragged = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = reverse ? -1 : 1;

    let hovering = false;
    let touching = false;
    let dragging = false;
    let current = reduce ? 0 : speed;
    let pos = el.scrollLeft;
    let started = false;
    let last = performance.now();
    let raf = 0;
    let touchTimer = 0;

    const unit = () => el.scrollWidth / COPIES;
    const wrap = () => {
      const u = unit();
      if (u <= 0) return;
      if (el.scrollLeft >= 2 * u) el.scrollLeft -= u;
      else if (el.scrollLeft < u) el.scrollLeft += u;
    };

    const tick = (t: number) => {
      const dt = Math.min(t - last, 100) / 1000;
      last = t;
      if (!started && unit() > 0) {
        el.scrollLeft = unit(); // start at the middle copy
        pos = el.scrollLeft;
        started = true;
      }
      // Something else moved the strip (drag, wheel, swipe) — follow it.
      if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;

      const target = reduce || touching || dragging ? 0 : hovering ? hoverSpeed : speed;
      current += (target - current) * Math.min(1, dt * 3); // ease between speeds
      if (Math.abs(current) > 0.01) {
        pos += dir * current * dt;
        el.scrollLeft = pos;
        const before = el.scrollLeft;
        wrap();
        if (el.scrollLeft !== before) pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Mouse drag. Pointer capture only starts once the mouse has really moved,
    // so a plain click still reaches the item underneath.
    let startX = 0;
    let startScroll = 0;
    let pointerId = -1;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      dragged.current = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      pointerId = e.pointerId;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!dragged.current && Math.abs(dx) > 5) {
        dragged.current = true;
        el.setPointerCapture(pointerId);
        el.classList.add("cursor-grabbing");
      }
      if (!dragged.current) return;
      el.scrollLeft = startScroll - dx;
      const before = el.scrollLeft;
      wrap();
      startScroll += el.scrollLeft - before;
      pos = el.scrollLeft;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      el.classList.remove("cursor-grabbing");
    };
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    const touchStart = () => {
      window.clearTimeout(touchTimer);
      touching = true;
    };
    const touchEnd = () => {
      touchTimer = window.setTimeout(() => (touching = false), 1200);
    };
    // Wheel / trackpad / touch scrolling: keep looping in both directions.
    const onScroll = () => {
      if (started) wrap();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("touchend", touchEnd);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(touchTimer);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchend", touchEnd);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, hoverSpeed, reverse, ...deps]);

  return dragged;
}
