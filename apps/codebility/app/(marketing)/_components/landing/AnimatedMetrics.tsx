"use client";

import { useCallback, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

import {
  attachProgressiveInView,
  isElementIntersecting,
} from "./progressive-in-view";

type AnimatedMetricsProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  format?: "number" | "decimal";
  delay?: number;
  variant?: "hero" | "stat";
};

const VARIANT_CONFIG = {
  hero: {
    countDuration: 2,
  },
  stat: {
    countDuration: 2.5,
  },
} as const;

const AnimatedMetrics = ({
  value,
  suffix = "",
  prefix = "",
  label,
  format = "number",
  delay = 0,
  variant = "hero",
}: AnimatedMetricsProps) => {
  const count = useMotionValue(value);
  const hasStarted = useRef(false);
  const stopRef = useRef<(() => void) | undefined>(undefined);
  const display = useTransform(count, (v) => {
    const formatted =
      format === "decimal" ? v.toFixed(1) : Math.floor(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  const config = VARIANT_CONFIG[variant];

  const startCount = useCallback(
    (alreadyVisible: boolean) => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      if (alreadyVisible) {
        count.set(value);
        return;
      }

      count.set(0);
      animate(count, value, {
        duration: config.countDuration,
        delay: delay / 1000,
        ease: "easeOut",
      });
    },
    [config.countDuration, count, delay, value],
  );

  const metricRef = useCallback(
    (element: HTMLElement | null) => {
      stopRef.current?.();
      stopRef.current = undefined;
      if (!element) return;

      if (isElementIntersecting(element)) {
        startCount(true);
        return;
      }

      count.set(0);
      stopRef.current = attachProgressiveInView(element, startCount);
    },
    [count, startCount],
  );

  if (variant === "stat") {
    return (
      <div ref={metricRef} className="text-center" style={{ opacity: 1 }}>
        <div className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl">
          <motion.span>{display}</motion.span>
        </div>
        {label ? (
          <p className="mt-1 text-sm text-gray-300 md:text-base">{label}</p>
        ) : null}
      </div>
    );
  }

  return (
    <p ref={metricRef} className="text-2xl font-semibold text-white md:text-3xl">
      <motion.span>{display}</motion.span>
    </p>
  );
};

export default AnimatedMetrics;
