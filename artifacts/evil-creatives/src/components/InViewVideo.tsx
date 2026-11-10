import { useEffect, useRef, type VideoHTMLAttributes } from "react";

/**
 * Muted looping preview video that only plays while it is on screen.
 * Keeps long strips with many videos smooth (no off-screen decoding).
 */
export default function InViewVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "0px 200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} muted loop playsInline preload="metadata" draggable={false} {...props} />;
}
