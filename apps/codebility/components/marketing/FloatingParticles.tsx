"use client";

import { useSyncExternalStore } from "react";
import { DesktopParticles } from "@/components/marketing/DesktopParticles";
import { LiteAtmosphere } from "@/components/marketing/LiteAtmosphere";
import { EMPTY_PARTICLES, PARTICLE_COLORS } from "@/constants/marketing/marketing";
import type { Particle } from "@/types/marketing/marketing";
import { subscribeParticles, subscribeLiteMode, getLiteModeSnapshot } from "@/utils/marketing/marketing";



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
