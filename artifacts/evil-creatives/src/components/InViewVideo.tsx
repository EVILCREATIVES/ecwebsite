import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

/**
 * Muted looping preview video that only plays while it is on screen.
 * Keeps long strips with many videos smooth (no off-screen decoding).
 *
 * The cover (`poster`) is drawn as a real image underneath, and the video
 * fades in only once it is actually playing. Browsers that skip or blank the
 * native poster (Safari, low-power mode, slow connections) still show it.
 * Pass position/size classes that work for both layers (e.g. `absolute
 * inset-0 w-full h-full`).
 */
export default function InViewVideo({ poster, className = "", ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <>
      {poster && <img src={poster} alt="" aria-hidden="true" draggable={false} className={className} />}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        draggable={false}
        poster={poster}
        onPlaying={() => setPlaying(true)}
        className={className}
        style={{ opacity: poster && !playing ? 0 : 1, transition: "opacity 0.5s, transform 0.7s" }}
        {...props}
      />
    </>
  );
}
