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
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {codeTags.map((tag, i) => {
        const x = useTransform(mouseX, [0, windowSize.width], [-8, 8]);
        const y = useTransform(mouseY, [0, windowSize.height], [-8, 8]);
        
        // Avoid placing tags in the center area where logo/text is
        let top = Math.random() * 90 + 5;
        let left = Math.random() * 90 + 5;
        
        // Keep tags away from center area (30%-70% both horizontally and vertically)
        if (top > 30 && top < 70 && left > 30 && left < 70) {
          // Randomly place in corners instead
          const corners = [
            { top: Math.random() * 25 + 5, left: Math.random() * 25 + 5 }, // top-left
            { top: Math.random() * 25 + 5, left: Math.random() * 25 + 75 }, // top-right
            { top: Math.random() * 25 + 75, left: Math.random() * 25 + 5 }, // bottom-left
            { top: Math.random() * 25 + 75, left: Math.random() * 25 + 75 }, // bottom-right
          ];
          const corner = corners[Math.floor(Math.random() * corners.length)];
          if (corner) {
            top = corner.top;
            left = corner.left;
          }
        }
        
        const delay = Math.random() * 2;

        return (
          <motion.span
            key={tag + i}
            className="absolute select-none font-mono text-xs text-white opacity-15 blur-[0.3px] lg:text-sm"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              x,
              y,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [0.8, 1, 0.8],
              y: ["0%", "-8%", "0%"],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
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
