"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

export function FloatingCodeTags() {
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {codeTags.map((tag, i) => {
        const x = useTransform(mouseX, [0, windowSize.width], [-10, 10]);
        const y = useTransform(mouseY, [0, windowSize.height], [-10, 10]);
        const top = Math.random() * 90 + 5;
        const left = Math.random() * 90 + 5;
        const delay = Math.random() * 2;

        return (
          <motion.span
            key={tag + i}
            className="absolute select-none font-mono text-sm text-white opacity-20 blur-[0.5px]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              x,
              y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 0.2,
              scale: 1,
              y: ["0%", "-5%", "0%"],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            {tag}
          </motion.span>
        );
      })}
    </div>
  );
}
