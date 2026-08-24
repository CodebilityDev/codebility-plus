"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type AnimatedMetricsProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  format?: "number" | "decimal";
  delay?: number;
  variant?: "hero" | "stat";
};

const VIEWPORT = { once: true, amount: 0.5 } as const;

const VARIANT_CONFIG = {
  hero: {
    countDuration: 2,
    enterInitial: { scale: 0, opacity: 0 },
    enterAnimate: { scale: 1, opacity: 1 },
  },
  stat: {
    countDuration: 2.5,
    enterInitial: { opacity: 0, scale: 0.5 },
    enterAnimate: { opacity: 1, scale: 1 },
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
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => {
    const formatted =
      format === "decimal" ? v.toFixed(1) : Math.floor(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  const delaySec = delay / 1000;
  const config = VARIANT_CONFIG[variant];

  const startCount = () => {
    animate(count, value, {
      duration: config.countDuration,
      delay: delaySec,
      ease: "easeOut",
    });
  };

  const enterTransition = {
    duration: 0.6,
    delay: delaySec,
    type: "spring" as const,
    bounce: 0.4,
  };

  if (variant === "stat") {
    return (
      <motion.div
        className="text-center"
        initial={config.enterInitial}
        whileInView={config.enterAnimate}
        viewport={VIEWPORT}
        transition={enterTransition}
        onViewportEnter={startCount}
      >
        <motion.div
          className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ scale: 1 }}
          whileInView={{ scale: [1, 1.1, 1] }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: delaySec + 0.3 }}
        >
          <motion.span>{display}</motion.span>
        </motion.div>
        {label ? (
          <motion.p
            className="text-sm md:text-base text-gray-300 mt-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: delaySec + 0.5 }}
          >
            {label}
          </motion.p>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.p
      className="text-2xl font-semibold text-white md:text-3xl"
      initial={config.enterInitial}
      whileInView={config.enterAnimate}
      viewport={VIEWPORT}
      transition={enterTransition}
      onViewportEnter={startCount}
    >
      <motion.span>{display}</motion.span>
    </motion.p>
  );
};

export default AnimatedMetrics;
