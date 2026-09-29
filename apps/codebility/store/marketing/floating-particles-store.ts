// External stores read with useSyncExternalStore in FloatingParticles.
import { LITE_QUERY, PARTICLE_COLORS } from "@/constants/marketing/marketing";
import type { Particle } from "@/types/marketing/marketing";

let cachedParticles: Particle[] | null = null;

export function subscribeParticles() {
  return () => {};
}

export function getClientParticles(): Particle[] {
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

export function subscribeLiteMode(onStoreChange: () => void) {
  const media = window.matchMedia(LITE_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export function getLiteModeSnapshot() {
  return window.matchMedia(LITE_QUERY).matches;
}
