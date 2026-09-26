"use client";

import { AnimatedProfilesGrid } from "@/components/marketing/profiles/AnimatedProfilesGrid";
import type { ProfilesGridProps } from "@/types/marketing/profiles/profiles";

export function ProfilesGrid({
  codevs,
  animationKey,
}: ProfilesGridProps) {
  return <AnimatedProfilesGrid codevs={codevs} animationKey={animationKey} />;
}
