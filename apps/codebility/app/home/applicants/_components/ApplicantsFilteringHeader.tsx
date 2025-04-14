"use client";

import Search from "@/Components/shared/dashboard/Search";
import { Button } from "@/Components/ui/button";
import { Codev } from "@/types/home/codev";
import { ChevronDown, Filter, SortDesc, X } from "lucide-react";

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

import { ExperienceRanges, Filters } from "./ApplicantsPageClient";

interface ApplicantsFilteringHeaderProps {
  applicants: Codev[];
  searchTerm: string;
  filters: Filters;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  activeFilterCount: number;
  uniquePositions: string[];
  onSearch: (term: string) => void;
  onFilterChange: (filters: Filters) => void;
  onToggleSort: (field: string) => void;
  onResetFilters: () => void;
}

const ApplicantsFilteringHeader = ({
  applicants,
  searchTerm,
  filters,
  sortField,
  sortDirection,
  activeFilterCount,
  uniquePositions,
  onSearch,
  onFilterChange,
  onToggleSort,
  onResetFilters,
}: ApplicantsFilteringHeaderProps) => {
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
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="flex gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-black-500 dark:border-dark-300 dark:bg-dark-200 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
            >
              <SortDesc className="h-4 w-4" />
              <span>Sort</span>
              {sortField && <ChevronDown className="ml-1 h-3 w-3" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 min-w-[140px] border border-gray-300 bg-white">
            <DropdownMenuLabel className="text-black-500 dark:text-light-800">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
            <DropdownMenuItem
              className={`flex justify-between ${
                sortField === "name"
                  ? "text-blue-500 dark:text-blue-300"
                  : "text-black-500 dark:text-light-800"
              }`}
              onClick={() => onToggleSort("name")}
            >
              Name
              {sortField === "name" && (
                <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`flex justify-between ${
                sortField === "position"
                  ? "text-blue-500 dark:text-blue-300"
                  : "text-black-500 dark:text-light-800"
              }`}
              onClick={() => onToggleSort("position")}
            >
              Position
              {sortField === "position" && (
                <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`flex justify-between ${
                sortField === "experience"
                  ? "text-blue-500 dark:text-blue-300"
                  : "text-black-500 dark:text-light-800"
              }`}
              onClick={() => onToggleSort("experience")}
            >
              Experience
              {sortField === "experience" && (
                <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
              onCheckedChange={(checked) => updateFilter("noGithub", !!checked)}
              className="text-black-500 dark:text-light-800"
            >
              No GitHub
            </DropdownMenuCheckboxItem>

            {/* Assessment Filters */}
            <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
            <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
              Assessment
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.assessmentSent}
              onCheckedChange={(checked) =>
                updateFilter("assessmentSent", !!checked)
              }
              className="text-black-500 dark:text-light-800"
            >
              Assessment sent
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.assessmentNotSent}
              onCheckedChange={(checked) =>
                updateFilter("assessmentNotSent", !!checked)
              }
              className="text-black-500 dark:text-light-800"
            >
              Assessment not sent
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
            {uniquePositions.length > 0 &&
              Object.keys(filters.positions).length > 0 && (
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
      </div>

      {/* Search Component */}
      <Search
        onSubmit={onSearch}
        placeholder="Search applicants"
        initialValue={searchTerm}
      />
    </div>
  );
};

export default ApplicantsFilteringHeader;
