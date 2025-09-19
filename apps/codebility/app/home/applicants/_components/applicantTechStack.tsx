import React from "react";
import Image from "next/image";

import { NewApplicantType } from "../_service/types";

export default function ApplicantTechStack({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  const [showAll, setShowAll] = React.useState(false);

  const displayStacks = showAll
    ? applicant.tech_stacks
    : applicant.tech_stacks?.slice(0, 3);

  const hasMoreStacks = (applicant.tech_stacks?.length || 0) > 3;

  return (
    <div className="px-1 py-1 text-xs">
      <div className="flex w-32 flex-wrap justify-center gap-1 text-xs">
        {applicant.tech_stacks &&
        applicant.tech_stacks.length > 0 &&
        !applicant.tech_stacks.includes("none") ? (
          <div className="flex flex-wrap gap-1 text-xs">
            {displayStacks?.map((stack) => (
              <Image
                key={stack}
                src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                alt={stack}
                width={18}
                height={18}
                className="h-4 w-4"
              />
            ))}
            {hasMoreStacks && (
              <button
                /*  variant="ghost" */
                onClick={() => setShowAll(!showAll)}
                className="text-[10px] text-gray-400 hover:text-gray-200"
              >
                {showAll
                  ? "Show less"
                  : `+${applicant.tech_stacks.length - 3} more`}
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">None</span>
        )}
      </div>
    </div>
  );
}
