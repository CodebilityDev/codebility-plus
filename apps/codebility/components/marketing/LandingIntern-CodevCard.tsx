"use client";

import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import { InternCard } from "@/components/marketing/InternCard";
import { ROLE_CONFIG, ROLE_STYLES } from "@/constants/marketing/marketing";
import type { Person } from "@/types/marketing/marketing";
import type { InternCardsProps } from "@/types/marketing/marketing";

export default function InternCards({
  interns,
  playOnMount = false,
}: InternCardsProps) {
  const isCodev = (person: Person): boolean => person.role === ROLE_CONFIG.CODEV;

  return (
    <ProgressiveMotion
      className="mx-auto w-full max-w-6xl py-10"
      y={60}
      duration={0.8}
      staggerChildren={0.1}
      playOnMount={playOnMount}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {interns.map((intern, idx) => {
          const roleStyles =
            ROLE_STYLES[intern.role];

          return (
            <InternCard
              key={`${intern.name}-${idx}`}
              intern={intern}
              roleStyles={roleStyles}
              isCodev={isCodev(intern)}
              index={idx}
              progressive
            />
          );
        })}
      </div>
    </ProgressiveMotion>
  );
}
