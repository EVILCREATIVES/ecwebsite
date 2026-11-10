import { useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { posterFor, resolveSrc, type MediaItem } from "@/lib/siteContent";

/**
 * Full-screen carousel for Works / Campaigns assets. Arrow keys, on-screen
 * arrows and swipes move between items; videos play with sound and controls.
 */
export default function MediaLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: MediaItem[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && items.length > 0;
  const i = index ?? 0;
  const item = items[i];
  const count = items.length;
  const go = (d: number) => onIndexChange((i + d + count) % count);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  const touchX = useRef<number | null>(null);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[101] flex flex-col focus:outline-none"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          {item && (
            <>
              <div className="flex items-center justify-between px-5 md:px-8 py-4 text-white">
                <span className="font-display text-[11px] tracking-[0.25em] uppercase text-white/60">
                  {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <DialogPrimitive.Close
                  className="font-display text-[11px] tracking-[0.25em] uppercase text-white/70 hover:text-primary px-2 py-1"
                  aria-label="Close"
                >
                  Close ✕
                </DialogPrimitive.Close>
              </div>

              <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-20 pb-4">
                {item.video ? (
                  <video
                    key={item.src}
                    src={resolveSrc(item.src)}
                    poster={posterFor(item)}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full object-contain bg-black"
                  />
                ) : (
                  <img
                    key={item.src}
                    src={resolveSrc(item.src)}
                    alt={item.label}
                    className="max-h-full max-w-full object-contain select-none"
                    draggable={false}
                  />
                )}

                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous"
                      className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center border border-white/20 bg-black/50 text-white text-xl hover:border-primary hover:text-primary transition-colors"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next"
                      className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center border border-white/20 bg-black/50 text-white text-xl hover:border-primary hover:text-primary transition-colors"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              <DialogPrimitive.Title className="px-5 md:px-8 pb-6 text-center font-display text-sm tracking-[0.2em] uppercase text-white">
                {item.label}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Use the arrow keys or swipe to see other items.
              </DialogPrimitive.Description>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
