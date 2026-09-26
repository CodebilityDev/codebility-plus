"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { codeTags } from "@/constants/auth/onboarding/onboarding";
import { mulberry32, placeAwayFromCenter } from "@/utils/auth/onboarding/onboarding";

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
