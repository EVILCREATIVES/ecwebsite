import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterProps = {
  text: string;
  speed?: number;
  startDelay?: number;
  start?: boolean;
  className?: string;
  cursorClassName?: string;
};

export default function Typewriter({
  text,
  speed = 26,
  startDelay = 0,
  start = true,
  className,
  cursorClassName,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const starter = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(starter);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, reduceMotion, start]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span
          className={`inline-block w-[0.5em] translate-y-[0.05em] animate-cursor-blink ${cursorClassName ?? ""}`}
        >
          ▋
        </span>
      </span>
    </span>
  );
}
