"use client";

import CodevCard from "@/components/global/marketing/CodevCard";
import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";

import { getStableColor } from "@/utils/global/getRandomColor";
import type { AnimatedProfilesGridProps } from "@/types/marketing/profiles/profiles";

export function AnimatedProfilesGrid({
  codevs,
  animationKey,
}: AnimatedProfilesGridProps) {
  if (codevs.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <ProgressiveMotion
      key={animationKey}
      className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      y={20}
      duration={0.5}
      staggerChildren={0.05}
      playOnMount
    >
      {codevs.map((codev) => (
        <div key={codev.id} data-progressive-child>
          <CodevCard
            color={getStableColor(codev.id)}
            codev={codev}
            animateEntrance={false}
          />
        </div>
      ))}
    </ProgressiveMotion>
  );
}
