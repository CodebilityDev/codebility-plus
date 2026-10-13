"use client";

import { ORB_COLORS } from "@/constants/marketing/marketing";

import { wave01 } from "@/utils/marketing/marketing";
import { useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import type { DesktopParticlesProps } from "@/types/marketing/marketing";

export function DesktopParticles({ particles }: DesktopParticlesProps) {
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ambientARef = useRef<HTMLDivElement | null>(null);
  const ambientBRef = useRef<HTMLDivElement | null>(null);

  useAnimationFrame((time) => {
    if (typeof document !== "undefined" && document.hidden) return;

    for (let i = 0; i < particles.length; i++) {
      const el = particleRefs.current[i];
      const particle = particles[i];
      if (!el || !particle) continue;

      const w = wave01(time, 10 + particle.speed * 4, particle.id * 0.15);
      const dx = Math.cos(particle.direction) * 24 * w;
      const dy = Math.sin(particle.direction) * 24 * w;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      el.style.opacity = String(particle.opacity * (1 - 0.45 * w));
    }

    for (let i = 0; i < 3; i++) {
      const el = orbRefs.current[i];
      if (!el) continue;

      const w = wave01(time, 14 + i * 2, 0);
      const dx = (i * 20 - 40) * w;
      const dy = (i * 14 - 24) * w;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      el.style.opacity = String(0.5 + 0.35 * w);
    }

    const ambientA = ambientARef.current;
    if (ambientA) {
      const w = wave01(time, 14, 0);
      const scale = 1 + 0.2 * w;
      ambientA.style.transform = `scale(${scale})`;
      ambientA.style.opacity = String(0.35 + 0.2 * w);
    }

    const ambientB = ambientBRef.current;
    if (ambientB) {
      const w = wave01(time, 12, 0);
      const scale = 1.15 - 0.15 * w;
      ambientB.style.transform = `scale(${scale})`;
      ambientB.style.opacity = String(0.4 + 0.2 * w);
    }
  });

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          ref={(node) => {
            particleRefs.current[index] = node;
          }}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={`orb-${i}`}
          ref={(node) => {
            orbRefs.current[i] = node;
          }}
          className="absolute h-2.5 w-2.5 rounded-full"
          style={{
            left: `${25 + i * 22}%`,
            top: `${28 + (i % 3) * 18}%`,
            background: `radial-gradient(circle, ${ORB_COLORS[i % 2]} 0%, transparent 70%)`,
            opacity: 0.5,
            willChange: "transform, opacity",
          }}
        />
      ))}

      <div
        ref={ambientARef}
        className="absolute left-1/4 top-1/3 h-16 w-16 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 71, 255, 0.12) 0%, transparent 70%)",
          filter: "blur(8px)",
          opacity: 0.35,
          willChange: "transform, opacity",
        }}
      />

      <div
        ref={ambientBRef}
        className="absolute right-1/4 top-2/3 h-14 w-14 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(2, 255, 226, 0.14) 0%, transparent 70%)",
          filter: "blur(8px)",
          opacity: 0.4,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
