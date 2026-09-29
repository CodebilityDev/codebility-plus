"use client";

import { useSyncExternalStore } from "react";
import { DesktopParticles } from "@/components/marketing/DesktopParticles";
import { LiteAtmosphere } from "@/components/marketing/LiteAtmosphere";
import { EMPTY_PARTICLES } from "@/constants/marketing/marketing";
import {
  getClientParticles,
  getLiteModeSnapshot,
  subscribeLiteMode,
  subscribeParticles,
} from "@/store/marketing/floating-particles-store";

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
