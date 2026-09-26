"use client";

import { useRef, useSyncExternalStore } from "react";
import { useAnimationFrame } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number;
}

const EMPTY_PARTICLES: Particle[] = [];

const PARTICLE_COLORS = [
  "rgba(147, 71, 255, 0.4)",
  "rgba(2, 255, 226, 0.3)",
  "rgba(106, 120, 242, 0.3)",
  "rgba(255, 255, 255, 0.2)",
] as const;

const ORB_COLORS = [
  "rgba(147, 71, 255, 0.55)",
  "rgba(2, 255, 226, 0.4)",
] as const;

const LITE_QUERY = "(max-width: 767px), (prefers-reduced-motion: reduce)";

let cachedParticles: Particle[] | null = null;

function getClientParticles(): Particle[] {
  if (cachedParticles) return cachedParticles;

  cachedParticles = Array.from({ length: 8 }, (_, i) => {
    const randomColorIndex = Math.floor(Math.random() * PARTICLE_COLORS.length);
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      color: PARTICLE_COLORS[randomColorIndex]!,
      opacity: Math.random() * 0.4 + 0.15,
      speed: Math.random() * 0.4 + 0.2,
      direction: Math.random() * Math.PI * 2,
    };
  });

  return cachedParticles;
}

function subscribeParticles() {
  return () => {};
}

function subscribeLiteMode(onStoreChange: () => void) {
  const media = window.matchMedia(LITE_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getLiteModeSnapshot() {
  return window.matchMedia(LITE_QUERY).matches;
}

function wave01(timeMs: number, durationSec: number, delaySec: number) {
  const elapsed = Math.max(0, timeMs / 1000 - delaySec);
  const cycle = (elapsed % durationSec) / durationSec;
  return (1 - Math.cos(cycle * Math.PI * 2)) / 2;
}

function LiteAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      <div
        className="absolute left-1/4 top-1/3 h-24 w-24 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 71, 255, 0.25) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 h-20 w-20 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(2, 255, 226, 0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}

function DesktopParticles({ particles }: { particles: Particle[] }) {
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

const FloatingParticles = () => {
  const isLite = useSyncExternalStore(
    subscribeLiteMode,
    getLiteModeSnapshot,
    () => true,
  );

  const particles = useSyncExternalStore(
    subscribeParticles,
    getClientParticles,
    () => EMPTY_PARTICLES,
  );

  if (isLite) {
    return <LiteAtmosphere />;
  }

  if (particles.length === 0) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
        aria-hidden
      />
    );
  }

  return <DesktopParticles particles={particles} />;
};

export default FloatingParticles;
