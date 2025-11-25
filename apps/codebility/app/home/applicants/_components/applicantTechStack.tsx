import React from "react";
import Image from "next/image";

import { getTechStackIconName } from "@/constants/techstack";
import { NewApplicantType } from "../_service/types";

export default function ApplicantTechStack({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  const [showAll, setShowAll] = React.useState(false);

  const displayStacks = showAll
    ? applicant.tech_stacks
    : applicant.tech_stacks?.slice(0, 4);

  const hasMoreStacks = (applicant.tech_stacks?.length || 0) > 4;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {applicant.tech_stacks &&
      applicant.tech_stacks.length > 0 &&
      !applicant.tech_stacks.includes("none") ? (
        <>
          {displayStacks?.map((stack) => {
            const iconName = getTechStackIconName(stack);
            return (
              <div
                key={stack}
                className="group relative"
                title={stack}
              >
                <Image
                  src={`/assets/svgs/techstack/icon-${iconName}.svg`}
                  alt={stack}
                  width={24}
                  height={24}
                  className="h-6 w-6 transition-transform group-hover:scale-110"
                />
              </div>
            );
          })}
          {hasMoreStacks && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              {showAll ? "−" : `+${applicant.tech_stacks.length - 4}`}
            </button>
          )}
        </>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-500">None</span>
      )}
    </div>
  );
}
