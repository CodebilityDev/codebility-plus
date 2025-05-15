import React, { useEffect, useMemo, useState } from "react";
import { H1 } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { Filter, X } from "lucide-react";

import { Badge } from "@codevs/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { NewApplicantType } from "../_service/types";
import { ExperienceRanges } from "../../applicants/_components/ApplicantsPageClient";
import ApplicantFiltersBadge from "./applicantFiltersBadge";

export type ApplicantFilters = {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
};

export default function ApplicantFilterHeaders({
  applicants,
  setApplicants,
}: {
  applicants: NewApplicantType[];
  setApplicants: React.Dispatch<React.SetStateAction<NewApplicantType[]>>;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const onSearch = (value: string) => {
    setSearchTerm(value);
    const filteredApplicants = applicants.filter((applicant) =>
      applicant.first_name.toLowerCase().includes(value.toLowerCase()),
    );
    setApplicants(filteredApplicants);
  };

  // Update a specific filter // Update a specific filter
  const [filters, setFilters] = useState<ApplicantFilters>({
    hasPortfolio: false,
    noPortfolio: false,
    hasGithub: false,
    noGithub: false,
    experienceRanges: {
      novice: false,
      intermediate: false,
      expert: false,
    },
    positions: {},
  });

  useEffect(() => {
    const filteredApplicants = applicants.filter((applicant) => {
      // Filter by portfolio
      if (filters.hasPortfolio && !applicant.portfolio_website) return false;
      if (filters.noPortfolio && applicant.portfolio_website) return false;

      // Filter by GitHub
      if (filters.hasGithub && !applicant.github) return false;
      if (filters.noGithub && applicant.github) return false;

      // Filter by experience
      if (filters.experienceRanges.novice && applicant.years_of_experience > 2)
        return false;
      if (
        filters.experienceRanges.intermediate &&
        (applicant.years_of_experience < 3 || applicant.years_of_experience > 5)
      )
        return false;
      if (filters.experienceRanges.expert && applicant.years_of_experience < 5)
        return false;

      // Filter by position
      const positionFilter = Object.entries(filters.positions).find(
        ([position, isChecked]) => {
          if (isChecked) {
            return applicant.display_position === position;
          }
          return false;
        },
      );

      if (positionFilter) {
        return true;
      }
      if (Object.values(filters.positions).some((isChecked) => isChecked)) {
        return false;
      }
      return true;
    });
    setApplicants(filteredApplicants);
  }, [filters, applicants]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count basic filters
    if (filters.hasPortfolio) count++;
    if (filters.noPortfolio) count++;
    if (filters.hasGithub) count++;
    if (filters.noGithub) count++;

    // Count experience filters
    if (filters.experienceRanges.novice) count++;
    if (filters.experienceRanges.intermediate) count++;
    if (filters.experienceRanges.expert) count++;

    // Count position filters
    for (const pos in filters.positions) {
      if (filters.positions[pos]) count++;
    }

    return count;
  }, [filters]);

  const uniquePositions = useMemo(() => {
    return [
      ...new Set(
        applicants?.map((a) => a.display_position).filter(Boolean) || [],
      ),
    ];
  }, [applicants]);

  const onFilterChange = (newFilters: ApplicantFilters) => {
    setFilters(newFilters);
  };

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

  const onResetFilters = () => {
    setFilters({
      hasPortfolio: false,
      noPortfolio: false,
      hasGithub: false,
      noGithub: false,
      experienceRanges: {
        novice: false,
        intermediate: false,
        expert: false,
      },
      positions: {},
    });

    setApplicants(applicants);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <H1>Applicants Management</H1>
        </div>
        <div className="flex items-center justify-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 flex h-5 w-5 items-center justify-center bg-blue-500 p-0 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 border border-gray-300 bg-white">
              <DropdownMenuLabel className="text-black-500 dark:text-light-800">
                Filter applicants
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

              {/* Portfolio Filters */}
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                Portfolio
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.hasPortfolio}
                onCheckedChange={(checked) =>
                  updateFilter("hasPortfolio", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Has portfolio
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.noPortfolio}
                onCheckedChange={(checked) =>
                  updateFilter("noPortfolio", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                No portfolio
              </DropdownMenuCheckboxItem>

              {/* GitHub Filters */}
              <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                GitHub
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.hasGithub}
                onCheckedChange={(checked) =>
                  updateFilter("hasGithub", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Has GitHub
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.noGithub}
                onCheckedChange={(checked) =>
                  updateFilter("noGithub", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                No GitHub
              </DropdownMenuCheckboxItem>
              {/* Experience Filters */}
              <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                Experience
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.experienceRanges.novice}
                onCheckedChange={(checked) =>
                  updateExperienceFilter("novice", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                0-2 years
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.experienceRanges.intermediate}
                onCheckedChange={(checked) =>
                  updateExperienceFilter("intermediate", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                3-5 years
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.experienceRanges.expert}
                onCheckedChange={(checked) =>
                  updateExperienceFilter("expert", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                5+ years
              </DropdownMenuCheckboxItem>
              {/* Position Filters */}
              {uniquePositions.length > 0 && (
                <>
                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                    Position
                  </DropdownMenuLabel>
                  {uniquePositions.map(
                    (position) =>
                      position && (
                        <DropdownMenuCheckboxItem
                          key={position}
                          checked={filters.positions[position] || false}
                          onCheckedChange={(checked) =>
                            updatePositionFilter(position, !!checked)
                          }
                          className="text-black-500 dark:text-light-800"
                        >
                          {position}
                        </DropdownMenuCheckboxItem>
                      ),
                  )}
                </>
              )}
              {/* Reset Filters Button */}
              {activeFilterCount > 0 && (
                <>
                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs text-red-100 hover:bg-red-100/10 hover:text-red-200 dark:text-red-100"
                    onClick={onResetFilters}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Reset filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <input
              type="text"
              placeholder="Search applicants"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="border-gray h-10 w-full rounded-full border border-opacity-50 bg-inherit px-5 text-black focus:outline-none dark:text-white md:w-80"
            />
          </div>
        </div>
      </div>
      <ApplicantFiltersBadge
        filters={filters}
        setFilter={setFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
