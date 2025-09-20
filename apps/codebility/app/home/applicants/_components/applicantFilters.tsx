import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, ChevronRight, Filter, X } from "lucide-react";
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
import { Input } from "@codevs/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@codevs/ui/collapsible";

import { ExperienceRanges } from "../_service/types";
import { ApplicantFilters } from "./applicantHeaders";

const ApplicantFiltersComponent = ({
  activeFilterCount,
  filters,
  uniquePositions,
  uniqueTechStacks,
  updateFilter,
  updateExperienceFilter,
  updatePositionFilter,
  updateTechStackFilter,
  updateDateRangeFilter,
  updateReminderFilter,
  updateTestStatusFilter,
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
    techStacks: {
      [key: string]: boolean;
    };
    testStatus: {
      taken: boolean;
      notTaken: boolean;
      overdue: boolean;
    };
    reminderCount: {
      none: boolean;
      low: boolean;
      medium: boolean;
      high: boolean;
    };
    applicationDate: {
      last7Days: boolean;
      last30Days: boolean;
      last90Days: boolean;
      custom: boolean;
      startDate: string;
      endDate: string;
    };
  };
  uniquePositions: string[];
  uniqueTechStacks: string[];
  updateFilter: (key: keyof ApplicantFilters, value: boolean) => void;
  updateExperienceFilter: (key: keyof ExperienceRanges, value: boolean) => void;
  updatePositionFilter: (key: string, value: boolean) => void;
  updateTechStackFilter: (key: string, value: boolean) => void;
  updateDateRangeFilter: (key: string, value: boolean | string) => void;
  updateReminderFilter: (key: string, value: boolean) => void;
  updateTestStatusFilter: (key: string, value: boolean) => void;
  onResetFilters: () => void;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    skills: false,
    status: false,
    dates: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersInSection = (section: string) => {
    switch (section) {
      case 'basic':
        return [filters.hasPortfolio, filters.noPortfolio, filters.hasGithub, filters.noGithub].filter(Boolean).length +
               [filters.experienceRanges.novice, filters.experienceRanges.intermediate, filters.experienceRanges.expert].filter(Boolean).length +
               Object.values(filters.positions).filter(Boolean).length;
      case 'skills':
        return Object.values(filters.techStacks).filter(Boolean).length;
      case 'status':
        return [filters.testStatus.taken, filters.testStatus.notTaken, filters.testStatus.overdue].filter(Boolean).length +
               [filters.reminderCount.none, filters.reminderCount.low, filters.reminderCount.medium, filters.reminderCount.high].filter(Boolean).length;
      case 'dates':
        return [filters.applicationDate.last7Days, filters.applicationDate.last30Days, filters.applicationDate.last90Days, filters.applicationDate.custom].filter(Boolean).length;
      default:
        return 0;
    }
  };
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
              <Badge className="ml-1 flex h-5 w-5 items-center justify-center bg-customBlue-500 p-0 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 w-80 border border-gray-300 bg-white">
          <DropdownMenuLabel className="text-black-500 dark:text-light-800">
            Filter applicants
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

          {/* Basic Filters Section */}
          <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Basic Filters
                </span>
                {getActiveFiltersInSection('basic') > 0 && (
                  <Badge className="h-5 w-5 bg-blue-500 p-0 text-xs text-white">
                    {getActiveFiltersInSection('basic')}
                  </Badge>
                )}
              </div>
              {expandedSections.basic ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {/* Portfolio Filters */}
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
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
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
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
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
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
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
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
            </CollapsibleContent>
          </Collapsible>

          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

          {/* Skills & Tech Section */}
          <Collapsible open={expandedSections.skills} onOpenChange={() => toggleSection('skills')}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Skills & Tech
                </span>
                {getActiveFiltersInSection('skills') > 0 && (
                  <Badge className="h-5 w-5 bg-blue-500 p-0 text-xs text-white">
                    {getActiveFiltersInSection('skills')}
                  </Badge>
                )}
              </div>
              {expandedSections.skills ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {uniqueTechStacks.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
                    Tech Stacks
                  </DropdownMenuLabel>
                  {uniqueTechStacks.slice(0, 8).map(
                    (techStack) =>
                      techStack && (
                        <DropdownMenuCheckboxItem
                          key={techStack}
                          checked={filters.techStacks[techStack] || false}
                          onCheckedChange={(checked) =>
                            updateTechStackFilter(techStack, !!checked)
                          }
                          className="text-black-500 dark:text-light-800"
                        >
                          {techStack}
                        </DropdownMenuCheckboxItem>
                      ),
                  )}
                  {uniqueTechStacks.length > 8 && (
                    <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
                      +{uniqueTechStacks.length - 8} more available...
                    </DropdownMenuLabel>
                  )}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>

          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

          {/* Status & Progress Section */}
          <Collapsible open={expandedSections.status} onOpenChange={() => toggleSection('status')}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Status & Progress
                </span>
                {getActiveFiltersInSection('status') > 0 && (
                  <Badge className="h-5 w-5 bg-blue-500 p-0 text-xs text-white">
                    {getActiveFiltersInSection('status')}
                  </Badge>
                )}
              </div>
              {expandedSections.status ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {/* Test Status Filters */}
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
                Test Status
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.testStatus.taken}
                onCheckedChange={(checked) =>
                  updateTestStatusFilter("taken", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Test taken
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.testStatus.notTaken}
                onCheckedChange={(checked) =>
                  updateTestStatusFilter("notTaken", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Test not taken
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.testStatus.overdue}
                onCheckedChange={(checked) =>
                  updateTestStatusFilter("overdue", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Test overdue
              </DropdownMenuCheckboxItem>

              {/* Reminder Count Filters */}
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
                Reminders Sent
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.reminderCount.none}
                onCheckedChange={(checked) =>
                  updateReminderFilter("none", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                0 reminders
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.reminderCount.low}
                onCheckedChange={(checked) =>
                  updateReminderFilter("low", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                1-2 reminders
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.reminderCount.medium}
                onCheckedChange={(checked) =>
                  updateReminderFilter("medium", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                3-5 reminders
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.reminderCount.high}
                onCheckedChange={(checked) =>
                  updateReminderFilter("high", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                5+ reminders
              </DropdownMenuCheckboxItem>
            </CollapsibleContent>
          </Collapsible>

          <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

          {/* Date Filters Section */}
          <Collapsible open={expandedSections.dates} onOpenChange={() => toggleSection('dates')}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Date Filters
                </span>
                {getActiveFiltersInSection('dates') > 0 && (
                  <Badge className="h-5 w-5 bg-blue-500 p-0 text-xs text-white">
                    {getActiveFiltersInSection('dates')}
                  </Badge>
                )}
              </div>
              {expandedSections.dates ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs px-3">
                Application Date
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.applicationDate.last7Days}
                onCheckedChange={(checked) =>
                  updateDateRangeFilter("last7Days", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Last 7 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.applicationDate.last30Days}
                onCheckedChange={(checked) =>
                  updateDateRangeFilter("last30Days", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Last 30 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.applicationDate.last90Days}
                onCheckedChange={(checked) =>
                  updateDateRangeFilter("last90Days", !!checked)
                }
                className="text-black-500 dark:text-light-800"
              >
                Last 90 days
              </DropdownMenuCheckboxItem>
            </CollapsibleContent>
          </Collapsible>

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
};

export default memo(ApplicantFiltersComponent);
