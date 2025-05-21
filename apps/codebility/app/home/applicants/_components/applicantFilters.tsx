import React from "react";
import { Button } from "@/Components/ui/button";
import { Filter, X } from "lucide-react";
import { move } from "react-big-calendar";

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

import { ExperienceRanges } from "../_service/types";
import { ApplicantFilters } from "./applicantHeaders";

export default function ApplicantFiltersComponent({
  activeFilterCount,
  filters,
  uniquePositions,
  updateFilter,
  updateExperienceFilter,
  updatePositionFilter,
  onResetFilters,
}: {
  activeFilterCount: number;
  filters: {
    hasPortfolio: boolean;
    noPortfolio: boolean;
    hasGithub: boolean;
    noGithub: boolean;
    experienceRanges: {
      novice: boolean;
      intermediate: boolean;
      expert: boolean;
    };
    positions: {
      [key: string]: boolean;
    };
  };
  uniquePositions: string[];
  updateFilter: (key: keyof ApplicantFilters, value: boolean) => void;
  updateExperienceFilter: (key: keyof ExperienceRanges, value: boolean) => void;
  updatePositionFilter: (key: string, value: boolean) => void;
  onResetFilters: () => void;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex w-full items-center gap-1 border-gray-300 bg-white sm:w-fit"
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
            onCheckedChange={(checked) => updateFilter("hasGithub", !!checked)}
            className="text-black-500 dark:text-light-800"
          >
            Has GitHub
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.noGithub}
            onCheckedChange={(checked) => updateFilter("noGithub", !!checked)}
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
    </>
  );
}
