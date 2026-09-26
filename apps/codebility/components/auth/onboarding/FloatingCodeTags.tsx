"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const codeTags = [
  "const",
  "function",
  "<div>",
  "import",
  "return",
  "export",
  "let",
  "async",
  "=>",
];

/** Seeded RNG so positions/timings are stable */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
type Pos = { top: number; left: number };
type CornerIndex = 0 | 1 | 2 | 3;

function placeAwayFromCenter(rand: () => number): Pos {
  let top = rand() * 90 + 5;
  let left = rand() * 90 + 5;

  const inCenter = top > 30 && top < 70 && left > 30 && left < 70;
  if (inCenter) {
    const cornerIndex = Math.min(
      3,
      Math.max(0, Math.floor(rand() * 4)),
    ) as CornerIndex;

    // Tuple of exactly 4 positions
    const ranges: readonly [Pos, Pos, Pos, Pos] = [
      { top: rand() * 25 + 5, left: rand() * 25 + 5 }, // TL
      { top: rand() * 25 + 5, left: rand() * 25 + 75 }, // TR
      { top: rand() * 25 + 75, left: rand() * 25 + 5 }, // BL
      { top: rand() * 25 + 75, left: rand() * 25 + 75 }, // BR
    ] as const;

    const chosen: Pos = ranges[cornerIndex]; // always defined with tuple indexing
    top = chosen.top;
    left = chosen.left;
  }

  return { top, left };
}
export function FloatingCodeTags() {
  const reduceMotion = useReducedMotion();

  const configs = useMemo(() => {
    return codeTags.map((tag, i) => {
      const seed =
        Array.from((tag + i).toString()).reduce(
          (a, c) => a + c.charCodeAt(0),
          0,
        ) +
        i * 99991;
      const rnd = mulberry32(seed);

      const { top, left } = placeAwayFromCenter(rnd);
      const floatDuration = 10 + Math.floor(rnd() * 6); // 10–15s
      const floatDelay = rnd() * 2; // 0–2s
      const floatAmplitude = 8 + rnd() * 6; // 8–14px

      // add a very subtle horizontal drift to avoid uniformity (no parallax)
      const drift = 4 + rnd() * 4; // 4–8px
      const driftDuration = 12 + Math.floor(rnd() * 6); // 12–17s
      const driftDelay = rnd() * 2;

      return {
        key: `${tag}-${i}`,
        tag,
        topPct: top,
        leftPct: left,
        floatDuration,
        floatDelay,
        floatAmplitude,
        drift,
        driftDuration,
        driftDelay,
      };
    });
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {configs.map(
        ({
          key,
          tag,
          topPct,
          leftPct,
          floatDuration,
          floatDelay,
          floatAmplitude,
          drift,
          driftDuration,
          driftDelay,
        }) => (
          <motion.span
            key={key}
            className="absolute select-none font-mono text-xs text-white/20 will-change-transform lg:text-sm"
            style={{ top: `${topPct}%`, left: `${leftPct}%` }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              reduceMotion
                ? { opacity: 0.2, scale: 1 }
                : {
                    opacity: 0.2, // steady (no flicker)
                    scale: 1,
                    // gentle vertical bob + slow horizontal drift
                    translateY: [0, -floatAmplitude, 0],
                    translateX: [0, drift, 0, -drift, 0],
                  }
            }
            transition={
              reduceMotion
                ? { opacity: { duration: 0.6, ease: "easeOut" } }
                : {
                    opacity: { duration: 0.8, ease: "easeOut" },
                    scale: { duration: 0.8, ease: "easeOut" },
                    translateY: {
                      duration: floatDuration,
                      repeat: Infinity,
                      delay: floatDelay,
                      ease: "easeInOut",
                    },
                    translateX: {
                      duration: driftDuration,
                      repeat: Infinity,
                      delay: driftDelay,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            {tag}
          </motion.span>
        ),
      )}
    </div>
  );
}
