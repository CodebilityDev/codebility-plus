"use client";

import { X } from "lucide-react";

import { Badge } from "@codevs/ui/badge";

import { ExperienceRanges, Filters } from "./ApplicantsPageClient";

interface ApplicantsFilterBadgesProps {
  filters: Filters;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onFilterChange: (filters: Filters) => void;
  onToggleSort: (field: string) => void;
  setSortField: (field: string | null) => void;
}

const ApplicantsFilterBadges = ({
  filters,
  sortField,
  sortDirection,
  onFilterChange,
  onToggleSort,
  setSortField,
}: ApplicantsFilterBadgesProps) => {
  // Update a specific filter
  const updateFilter = (key: keyof Filters, value: boolean) => {
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
      {/* Sort Badge */}
      {sortField && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          Sort: {sortField} {sortDirection === "asc" ? "↑" : "↓"}
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => setSortField(null)}
          />
        </Badge>
      )}

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

      {/* Assessment Badges */}
      {filters.assessmentSent && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          Assessment Sent
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("assessmentSent", false)}
          />
        </Badge>
      )}
      {filters.assessmentNotSent && (
        <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800 flex items-center gap-1">
          Assessment Not Sent
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => updateFilter("assessmentNotSent", false)}
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
};

export default ApplicantsFilterBadges;
