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
    : applicant.tech_stacks?.slice(0, 5);

  const hasMoreStacks = (applicant.tech_stacks?.length || 0) > 5;

  return (
    <div className="px-3 py-3 text-sm">
      <div className="flex w-40 flex-wrap justify-center gap-2 text-sm">
        {applicant.tech_stacks &&
        applicant.tech_stacks.length > 0 &&
        !applicant.tech_stacks.includes("none") ? (
          <div className="flex flex-wrap gap-2 text-sm">
            {displayStacks?.map((stack) => (
              <Image
                key={stack}
                src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                alt={stack}
                width={22}
                height={22}
                className="h-6 w-6"
              />
            ))}
            {hasMoreStacks && (
              <button
                /*  variant="ghost" */
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                {showAll
                  ? "Show less"
                  : `+${applicant.tech_stacks.length - 5} more`}
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">None</span>
        )}
      </div>
    </div>
  );
}
