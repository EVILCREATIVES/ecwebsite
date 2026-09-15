import { useEffect, useMemo, useRef, useState } from "react";

type Word = { word: string; links: string[] };

// Creative-field vocabulary. Links describe conceptual adjacency.
const WORDS: Word[] = [
  { word: "Brand", links: ["Identity", "Strategy", "Voice", "Story"] },
  { word: "Identity", links: ["Brand", "Type", "Art Direction", "System"] },
  { word: "Strategy", links: ["Brand", "Product", "Concept", "Vision"] },
  { word: "Narrative", links: ["Story", "Voice", "World", "Concept"] },
  { word: "Story", links: ["Narrative", "Brand", "Emotion", "World"] },
  { word: "AI", links: ["Product", "System", "Intelligence", "Prototype"] },
  { word: "Product", links: ["AI", "Strategy", "Interface", "Prototype"] },
  { word: "Design", links: ["Interface", "Type", "Motion", "Craft"] },
  { word: "Experience", links: ["Interface", "Motion", "Emotion", "World"] },
  { word: "Interface", links: ["Design", "Product", "Experience", "System"] },
  { word: "Motion", links: ["Design", "Film", "Experience", "Craft"] },
  { word: "Film", links: ["Motion", "Story", "Art Direction", "Emotion"] },
  { word: "Type", links: ["Identity", "Design", "Art Direction", "Craft"] },
  { word: "Concept", links: ["Strategy", "Narrative", "Vision", "Art Direction"] },
  { word: "Art Direction", links: ["Concept", "Film", "Type", "Identity"] },
  { word: "Campaign", links: ["Brand", "Story", "Voice", "Concept"] },
  { word: "Voice", links: ["Brand", "Narrative", "Story", "Campaign"] },
  { word: "System", links: ["AI", "Identity", "Interface", "Intelligence"] },
  { word: "World", links: ["Narrative", "Story", "Experience", "Vision"] },
  { word: "Prototype", links: ["AI", "Product", "Craft", "Vision"] },
  { word: "Intelligence", links: ["AI", "System", "Product", "Vision"] },
  { word: "Emotion", links: ["Story", "Film", "Experience", "Voice"] },
  { word: "Craft", links: ["Design", "Type", "Motion", "Prototype"] },
  { word: "Vision", links: ["Strategy", "Concept", "World", "Intelligence"] },
];

// Deterministic-ish 3D positions distributed inside a cube volume.
function buildPositions(n: number) {
  const pts: { x: number; y: number; z: number }[] = [];
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < n; i++) {
    pts.push({
      x: rnd() * 2 - 1,
      y: rnd() * 2 - 1,
      z: rnd() * 2 - 1,
    });
  }
  return pts;
}

// Cube wireframe corners + edges
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

function rotate(p: { x: number; y: number; z: number }, ay: number, ax: number) {
  const sy = Math.sin(ay), cy = Math.cos(ay);
  let x = p.x * cy - p.z * sy;
  let z = p.x * sy + p.z * cy;
  let y = p.y;
  const sx = Math.sin(ax), cx = Math.cos(ax);
  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  return { x, y: y2, z: z2 };
}

const SIZE = 600;
const CENTER = SIZE / 2;
const SCALE = 132;
const FOCAL = 3.2;

function project(p: { x: number; y: number; z: number }) {
  const persp = FOCAL / (FOCAL - p.z);
  return {
    x: CENTER + p.x * SCALE * persp,
    y: CENTER + p.y * SCALE * persp,
    persp,
    z: p.z,
  };
}

export default function WordCube() {
  const positions = useMemo(() => buildPositions(WORDS.length), []);
  const nameToIndex = useMemo(() => {
    const m: Record<string, number> = {};
    WORDS.forEach((w, i) => (m[w.word] = i));
    return m;
  }, []);

  const [angle, setAngle] = useState(0.5);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  const tilt = -0.5;

  // Respect prefers-reduced-motion: hold a static, pleasant isometric view.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      if (!pausedRef.current && selected === null) {
        setAngle((a) => a + dt * 0.00028);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [selected, reduced]);

  const activeIdx = selected ?? hovered ?? focused;
  const linkedSet = useMemo(() => {
    if (activeIdx === null) return new Set<number>();
    const s = new Set<number>();
    WORDS[activeIdx].links.forEach((name) => {
      const i = nameToIndex[name];
      if (i !== undefined) s.add(i);
    });
    return s;
  }, [activeIdx, nameToIndex]);

  // Compute rotated + projected nodes, sorted back-to-front
  const nodes = WORDS.map((w, i) => {
    const r = rotate(positions[i], angle, tilt);
    const pr = project(r);
    return { ...pr, i, word: w.word };
  });
  const sorted = [...nodes].sort((a, b) => a.z - b.z);

  const corners = CORNERS.map((c) => project(rotate({ x: c[0], y: c[1], z: c[2] }, angle, tilt)));

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseLeave={() => {
        setHovered(null);
        pausedRef.current = false;
      }}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full max-h-[560px]"
        style={{ overflow: "visible" }}
        role="group"
        aria-label="Interactive map of creative-field concepts. Tab between concepts and press Enter to reveal connections to related concepts."
        data-testid="word-cube"
      >
        {/* Cube wireframe */}
        {EDGES.map((e, i) => (
          <line
            key={`edge-${i}`}
            x1={corners[e[0]].x}
            y1={corners[e[0]].y}
            x2={corners[e[1]].x}
            y2={corners[e[1]].y}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}

        {/* Link lines from active node */}
        {activeIdx !== null &&
          WORDS[activeIdx].links.map((name, i) => {
            const j = nameToIndex[name];
            if (j === undefined) return null;
            const a = nodes[activeIdx];
            const b = nodes[j];
            return (
              <line
                key={`link-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="hsl(47 98% 44%)"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.85}
              />
            );
          })}

        {/* Nodes */}
        {sorted.map((n) => {
          const isActive = activeIdx === n.i;
          const isLinked = linkedSet.has(n.i);
          const dim = activeIdx !== null && !isActive && !isLinked;
          const r = (isActive ? 7 : isLinked ? 5.5 : 4) * (0.7 + n.persp * 0.2);
          const baseOpacity = 0.35 + (n.persp - 0.6) * 0.9;
          const isFocused = focused === n.i;
          return (
            <g
              key={n.i}
              role="button"
              tabIndex={0}
              aria-pressed={selected === n.i}
              aria-label={`${n.word}. ${WORDS[n.i].links.length} related concepts: ${WORDS[n.i].links.join(", ")}. Activate to map connections.`}
              style={{ cursor: "pointer", outline: "none" }}
              opacity={dim ? 0.18 : Math.min(1, Math.max(0.3, baseOpacity))}
              onMouseEnter={() => {
                setHovered(n.i);
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                setHovered(null);
                if (selected === null) pausedRef.current = false;
              }}
              onFocus={() => {
                setFocused(n.i);
                pausedRef.current = true;
              }}
              onBlur={() => {
                setFocused(null);
                if (selected === null && hovered === null) pausedRef.current = false;
              }}
              onClick={() => setSelected((cur) => (cur === n.i ? null : n.i))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected((cur) => (cur === n.i ? null : n.i));
                } else if (e.key === "Escape") {
                  setSelected(null);
                }
              }}
            >
              {/* hit area */}
              <circle cx={n.x} cy={n.y} r={Math.max(14, r + 10)} fill="transparent" />
              {isFocused && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 6}
                  fill="none"
                  stroke="hsl(47 98% 44%)"
                  strokeWidth={2}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={isActive || isLinked ? "hsl(47 98% 44%)" : "rgba(255,255,255,0.5)"}
              />
              {(isActive || isLinked || n.persp > 1.02) && (
                <text
                  x={n.x + r + 5}
                  y={n.y + 3}
                  fontFamily="Inter, sans-serif"
                  fontSize={isActive ? 15 : 12}
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive || isLinked ? "hsl(47 98% 44%)" : "rgba(255,255,255,0.6)"}
                  style={{ pointerEvents: "none" }}
                >
                  {n.word}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Helper hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-[0.25em] uppercase text-white/35 pointer-events-none text-center">
        {selected !== null ? "Select again to release" : "Click or tab to a word · map connections"}
      </div>
    </div>
  );
}
