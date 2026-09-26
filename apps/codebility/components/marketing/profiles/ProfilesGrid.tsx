"use client";

import { AnimatedProfilesGrid } from "@/components/marketing/profiles/AnimatedProfilesGrid";
import type { ProfilesListingPage } from "@/types/global/profiles-listing";

export function ProfilesGrid({
  codevs,
  animationKey,
}: {
  codevs: ProfilesListingPage["codevs"];
  animationKey: string;
}) {
  return <AnimatedProfilesGrid codevs={codevs} animationKey={animationKey} />;
}
