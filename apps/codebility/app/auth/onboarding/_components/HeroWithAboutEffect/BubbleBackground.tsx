"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function BubbleBackground() {
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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
      {[...Array(4)].map((_, i) => {
        const size = Math.floor(Math.random() * 80) + 100;
        const top = Math.random() * 100;
        const left = Math.random() * 100;

        const x = useTransform(mouseX, [0, windowSize.width], [-10, 10]);
        const y = useTransform(mouseY, [0, windowSize.height], [-10, 10]);

        return (
          <motion.div
            key={`blurry-${i}`}
            className="absolute rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 opacity-30 blur-2xl"
            style={{
              width: size,
              height: size,
              top: `${top}%`,
              left: `${left}%`,
              x,
              y,
            }}
            transition={{ type: "spring", stiffness: 20, damping: 30 }}
          />
        );
      })}

      {[...Array(8)].map((_, i) => {
        const isOutline = i % 3 === 0;
        const size = Math.floor(Math.random() * 20) + 10;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const duration = (Math.random() * 10 + 6).toFixed(1);
        const delay = (Math.random() * 4).toFixed(1);

        const className = isOutline
          ? "border border-pink-400 bg-transparent"
          : "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400";

        return (
          <div
            key={`float-${i}`}
            className={`absolute rounded-full ${className} animate-floatY opacity-[0.14] blur-[1px]`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      {[...Array(3)].map((_, i) => {
        const size = Math.floor(Math.random() * 4) + 2;
        const top = Math.random() * 100;
        const left = Math.random() * 100;

        return (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        );
      })}
    </div>
  );
}
