"use client";

import React, { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@codevs/ui/tabs";
import { LeaderboardType, TimePeriod } from "@/types/leaderboard";

interface LeaderboardFiltersProps {
  // Leaderboard type controls
  currentType: LeaderboardType;
  onTypeChange: (type: LeaderboardType) => void;
  availableTypes?: LeaderboardType[];
  
  // Time period controls
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  showTimeFilter?: boolean;
  
  // Category controls (for technical leaderboard)
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showCategoryFilter?: boolean;
  
  // UI customization
  className?: string;
  compact?: boolean;
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Frontend Developer": "data-[state=active]:bg-customBlue-600 data-[state=active]:text-white",
    "Backend Developer": "data-[state=active]:bg-green-600 data-[state=active]:text-white",
    "UI/UX Designer": "data-[state=active]:bg-purple-600 data-[state=active]:text-white",
    "Mobile Developer": "data-[state=active]:bg-orange-600 data-[state=active]:text-white",
    "QA Engineer": "data-[state=active]:bg-indigo-600 data-[state=active]:text-white",
    "Full Stack Developer": "data-[state=active]:bg-purple-600 data-[state=active]:text-white",
    "Admin": "data-[state=active]:bg-red-600 data-[state=active]:text-white",
    "Marketing": "data-[state=active]:bg-pink-600 data-[state=active]:text-white"
  };
  return colorMap[category] || "data-[state=active]:bg-gray-600 data-[state=active]:text-white";
};

const getCategoryInitial = (category: string): string => {
  const initialMap: Record<string, string> = {
    "Frontend Developer": "FE",
    "Backend Developer": "BE", 
    "UI/UX Designer": "UI",
    "Mobile Developer": "MD",
    "QA Engineer": "QA",
    "Full Stack Developer": "FS",
    "Admin": "AD",
    "Marketing": "MK"
  };
  return initialMap[category] || category.substring(0, 2).toUpperCase();
};

const LeaderboardFilters = memo<LeaderboardFiltersProps>(({
  currentType,
  onTypeChange,
  availableTypes = ["technical", "projects", "soft-skills"],
  timePeriod,
  onTimePeriodChange,
  showTimeFilter = false,
  categories,
  selectedCategory,
  onCategoryChange,
  showCategoryFilter = false,
  className = "",
  compact = false
}) => {
  return (
    <div className={`space-y-4 ${className}`} role="region" aria-label="Leaderboard filters">
      {/* Leaderboard Type Tabs */}
      <div className="flex gap-4 mb-4">
        <Tabs
          value={currentType}
          onValueChange={(value: LeaderboardType) => onTypeChange(value)}
          className="w-fit"
          aria-label="Select leaderboard type"
        >
          <TabsList className="grid h-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit grid-cols-3">
            {availableTypes.includes("technical") && (
              <TabsTrigger
                value="technical"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-customBlue-600 data-[state=active]:text-white"
              >
                <span className="mr-1">⭐</span>
                <span className={compact ? "sm:inline hidden" : ""}>{compact ? "Tech" : "Technical"}</span>
              </TabsTrigger>
            )}
            {availableTypes.includes("projects") && (
              <TabsTrigger
                value="projects"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <span className="mr-1">🏆</span>
                <span className={compact ? "sm:inline hidden" : ""}>{compact ? "Proj" : "Projects"}</span>
              </TabsTrigger>
            )}
            {availableTypes.includes("soft-skills") && (
              <TabsTrigger
                value="soft-skills"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <span className="mr-1">👥</span>
                <span className={compact ? "sm:inline hidden" : ""}>{compact ? "Soft" : "Soft Skills"}</span>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className={`flex ${compact ? "flex-col gap-2" : "gap-4"}`}>
        {/* Time Period Filter */}
        {showTimeFilter && (
          <Select
            value={timePeriod}
            onValueChange={(value: TimePeriod) => onTimePeriodChange(value)}
          >
            <SelectTrigger className={compact ? "w-full" : "w-[120px]"}>
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Category Filter (Technical Skills Only) */}
        {showCategoryFilter && categories.length > 0 && (
          <Tabs
            value={selectedCategory}
            onValueChange={onCategoryChange}
            className="flex-1"
          >
            <TabsList className={`h-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex ${
              compact ? "flex-wrap" : "overflow-x-auto"
            } gap-1`}>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${getCategoryColor(category)} ${
                    compact ? "text-xs" : ""
                  }`}
                >
                  {compact ? getCategoryInitial(category) : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>
    </div>
  );
});

LeaderboardFilters.displayName = "LeaderboardFilters";

export default LeaderboardFilters;