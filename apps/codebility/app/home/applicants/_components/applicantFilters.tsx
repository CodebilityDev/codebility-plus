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
        <DropdownMenuContent className="dark:border-dark-400 dark:bg-dark-200 w-96 max-h-[70vh] overflow-y-auto border border-gray-300 bg-white">
          <div className="sticky top-0 bg-white dark:bg-dark-200 z-10 border-b border-gray-200 dark:border-gray-700 pb-3">
            <DropdownMenuLabel className="text-black-500 dark:text-light-800 text-base font-semibold">
              Filter Applicants
            </DropdownMenuLabel>
          </div>

          <div className="p-2 space-y-3">
            {/* Basic Filters Section */}
            <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Basic Filters
                  </span>
                  {getActiveFiltersInSection('basic') > 0 && (
                    <Badge className="h-6 w-6 bg-blue-500 p-0 text-xs text-white font-medium">
                      {getActiveFiltersInSection('basic')}
                    </Badge>
                  )}
                </div>
                {expandedSections.basic ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {/* Portfolio Filters */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Portfolio
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.hasPortfolio}
                          onChange={(e) => updateFilter("hasPortfolio", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Has portfolio</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.noPortfolio}
                          onChange={(e) => updateFilter("noPortfolio", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">No portfolio</span>
                      </label>
                    </div>
                  </div>

                  {/* GitHub Filters */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      GitHub
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.hasGithub}
                          onChange={(e) => updateFilter("hasGithub", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Has GitHub</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.noGithub}
                          onChange={(e) => updateFilter("noGithub", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">No GitHub</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Experience Filters */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Experience Level
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.experienceRanges.novice}
                        onChange={(e) => updateExperienceFilter("novice", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">0-2 years</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.experienceRanges.intermediate}
                        onChange={(e) => updateExperienceFilter("intermediate", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">3-5 years</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.experienceRanges.expert}
                        onChange={(e) => updateExperienceFilter("expert", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">5+ years</span>
                    </label>
                  </div>
                </div>

                {/* Position Filters */}
                {uniquePositions.length > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Positions
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {uniquePositions.map(
                        (position) =>
                          position && (
                            <label key={position} className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={filters.positions[position] || false}
                                onChange={(e) => updatePositionFilter(position, e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-700 dark:text-gray-300 truncate" title={position}>
                                {position}
                              </span>
                            </label>
                          ),
                      )}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Skills & Tech Section */}
            <Collapsible open={expandedSections.skills} onOpenChange={() => toggleSection('skills')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Skills & Tech
                  </span>
                  {getActiveFiltersInSection('skills') > 0 && (
                    <Badge className="h-6 w-6 bg-blue-500 p-0 text-xs text-white font-medium">
                      {getActiveFiltersInSection('skills')}
                    </Badge>
                  )}
                </div>
                {expandedSections.skills ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                {uniqueTechStacks.length > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Tech Stacks
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {uniqueTechStacks.slice(0, 15).map(
                        (techStack) =>
                          techStack && (
                            <label key={techStack} className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={filters.techStacks[techStack] || false}
                                onChange={(e) => updateTechStackFilter(techStack, e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-gray-700 dark:text-gray-300 truncate" title={techStack}>
                                {techStack}
                              </span>
                            </label>
                          ),
                      )}
                    </div>
                    {uniqueTechStacks.length > 15 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        +{uniqueTechStacks.length - 15} more technologies available
                      </div>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Status & Progress Section */}
            <Collapsible open={expandedSections.status} onOpenChange={() => toggleSection('status')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Status & Progress
                  </span>
                  {getActiveFiltersInSection('status') > 0 && (
                    <Badge className="h-6 w-6 bg-blue-500 p-0 text-xs text-white font-medium">
                      {getActiveFiltersInSection('status')}
                    </Badge>
                  )}
                </div>
                {expandedSections.status ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Test Status Filters */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Test Status
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.testStatus.taken}
                          onChange={(e) => updateTestStatusFilter("taken", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Test taken</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.testStatus.notTaken}
                          onChange={(e) => updateTestStatusFilter("notTaken", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Test not taken</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.testStatus.overdue}
                          onChange={(e) => updateTestStatusFilter("overdue", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Test overdue</span>
                      </label>
                    </div>
                  </div>

                  {/* Reminder Count Filters */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Reminders
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.reminderCount.none}
                          onChange={(e) => updateReminderFilter("none", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">0 reminders</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.reminderCount.low}
                          onChange={(e) => updateReminderFilter("low", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">1-2 reminders</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.reminderCount.medium}
                          onChange={(e) => updateReminderFilter("medium", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">3-5 reminders</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.reminderCount.high}
                          onChange={(e) => updateReminderFilter("high", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">5+ reminders</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Date Filters Section */}
            <Collapsible open={expandedSections.dates} onOpenChange={() => toggleSection('dates')}>
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Date Filters
                  </span>
                  {getActiveFiltersInSection('dates') > 0 && (
                    <Badge className="h-6 w-6 bg-blue-500 p-0 text-xs text-white font-medium">
                      {getActiveFiltersInSection('dates')}
                    </Badge>
                  )}
                </div>
                {expandedSections.dates ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Application Date
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.applicationDate.last7Days}
                        onChange={(e) => updateDateRangeFilter("last7Days", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Last 7 days</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.applicationDate.last30Days}
                        onChange={(e) => updateDateRangeFilter("last30Days", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Last 30 days</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.applicationDate.last90Days}
                        onChange={(e) => updateDateRangeFilter("last90Days", e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Last 90 days</span>
                    </label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Reset Filters Button */}
          {activeFilterCount > 0 && (
            <div className="sticky bottom-0 bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-gray-700 p-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                onClick={onResetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Reset all filters ({activeFilterCount})
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default memo(ApplicantFiltersComponent);
