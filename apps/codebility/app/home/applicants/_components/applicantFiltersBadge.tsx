import React from "react";
import { X } from "lucide-react";

import { Badge } from "@codevs/ui/badge";

import { ApplicantFilters } from "./applicantHeaders";
import { ExperienceRanges } from "../_service/types";

export default function ApplicantFiltersBadge({
  filters,
  setFilter,
  onFilterChange,
}: {
  filters: ApplicantFilters;
  setFilter: React.Dispatch<React.SetStateAction<ApplicantFilters>>;
  onFilterChange: (filters: ApplicantFilters) => void;}) {
  // Update a specific filter
  const updateFilter = (key: keyof ApplicantFilters, value: boolean) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  // Update experience filter
  const updateExperienceFilter = (
    key: keyof ExperienceRanges,
    value: boolean,
  ) => {
    onFilterChange({
      ...filters,
      experienceRanges: {
        ...filters.experienceRanges,
        [key]: value,
      },
    });
  };

  // Update position filter
  const updatePositionFilter = (position: string, value: boolean) => {
    onFilterChange({
      ...filters,
      positions: {
        ...filters.positions,
        [position]: value,
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Portfolio Badges */}
      {filters.hasPortfolio && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          Has Portfolio
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("hasPortfolio", false)}
          />
        </Badge>
      )}
      {filters.noPortfolio && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          No Portfolio
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("noPortfolio", false)}
          />
        </Badge>
      )}

      {/* GitHub Badges */}
      {filters.hasGithub && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          Has GitHub
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("hasGithub", false)}
          />
        </Badge>
      )}
      {filters.noGithub && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          No GitHub
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("noGithub", false)}
          />
        </Badge>
      )}

      {/* Experience Badges */}
      {filters.experienceRanges.novice && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          0-2 Years Experience
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateExperienceFilter("novice", false)}
          />
        </Badge>
      )}
      {filters.experienceRanges.intermediate && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          3-5 Years Experience
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateExperienceFilter("intermediate", false)}
          />
        </Badge>
      )}
      {filters.experienceRanges.expert && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          5+ Years Experience
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateExperienceFilter("expert", false)}
          />
        </Badge>
      )}

      {/* Position Badges */}
      {Object.entries(filters.positions).map(
        ([position, isActive]) =>
          isActive && (
            <Badge
              key={position}
              className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1"
            >
              Position: {position}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => updatePositionFilter(position, false)}
              />
            </Badge>
          ),
      )}
    </div>
  );
}
