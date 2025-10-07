"use client";

import React, { useState, memo } from "react";
import { Box } from "@/components/shared/dashboard";
import { Trophy, Users, Star } from "lucide-react";
import { LeaderboardType, TimePeriod } from "@/types/leaderboard";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import LeaderboardFilters from "./LeaderboardFilters";
import LeaderboardTable from "./LeaderboardTable";
import LeaderboardError from "./LeaderboardError";
import LeaderboardLoading from "./LeaderboardLoading";

interface LeaderboardContainerProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  maxResults?: number;
}

const LeaderboardContainer = memo<LeaderboardContainerProps>(({
  className = "",
  autoRefresh = false,
  refreshInterval = 30000,
  maxResults = 10
}) => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("technical");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");

  const {
    data,
    categories,
    state,
    refetch,
    setCategory,
    setTimePeriod
  } = useLeaderboard({
    type: leaderboardType,
    timePeriod,
    limit: maxResults,
    autoRefresh,
    refreshInterval
  });

  const getLeaderboardIcon = () => {
    switch (leaderboardType) {
      case "soft-skills":
        return <Users className="h-5 w-5 text-white" />;
      case "projects":
        return <Trophy className="h-5 w-5 text-white" />;
      default:
        return <Star className="h-5 w-5 text-white" />;
    }
  };

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case "soft-skills":
        return "Soft Skills Leaderboard";
      case "projects":
        return "Projects Leaderboard";
      default:
        return "Technical Leaderboard";
    }
  };

  const getLeaderboardDescription = () => {
    switch (leaderboardType) {
      case "soft-skills":
        return "Consistency & collaboration";
      case "projects":
        return "Team performance & collaboration";
      default:
        return "Technical skills & expertise";
    }
  };

  const getHeaderGradient = () => {
    switch (leaderboardType) {
      case "soft-skills":
        return "from-emerald-400 to-teal-500";
      case "projects":
        return "from-purple-400 to-indigo-500";
      default:
        return "from-yellow-400 to-orange-500";
    }
  };

  const getTitleGradient = () => {
    switch (leaderboardType) {
      case "soft-skills":
        return "from-emerald-600 to-teal-600";
      case "projects":
        return "from-purple-600 to-indigo-600";
      default:
        return "from-purple-600 to-blue-600";
    }
  };

  const handleTypeChange = (newType: LeaderboardType) => {
    setLeaderboardType(newType);
  };

  const handleTimePeriodChange = (newPeriod: TimePeriod) => {
    setTimePeriod(newPeriod);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const shouldShowTimeFilter = leaderboardType === "technical" || leaderboardType === "projects";
  const shouldShowCategoryFilter = leaderboardType === "technical" && categories.length > 0;

  if (state.isLoading && data.length === 0) {
    return (
      <Box className={`flex w-full flex-1 flex-col gap-6 ${className}`}>
        <LeaderboardLoading 
          type={leaderboardType} 
          rowCount={maxResults}
          showHeader={true}
        />
      </Box>
    );
  }

  return (
    <Box className={`flex w-full flex-1 flex-col gap-6 ${className}`}>
      <div className="relative flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getHeaderGradient()}`}>
              {getLeaderboardIcon()}
            </div>
            <div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${getTitleGradient()} bg-clip-text text-transparent`}>
                🏆 {getLeaderboardTitle()}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getLeaderboardDescription()}
                {state.lastUpdated && (
                  <span className="ml-2 text-xs">
                    • Updated {state.lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {leaderboardType === "technical" ? (
              <>
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Top Performers</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-emerald-500" />
                <span>Team Leaders</span>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <LeaderboardFilters
          currentType={leaderboardType}
          onTypeChange={handleTypeChange}
          timePeriod={timePeriod}
          onTimePeriodChange={handleTimePeriodChange}
          showTimeFilter={shouldShowTimeFilter}
          categories={categories}
          selectedCategory={categories.length > 0 ? categories[0] : ""}
          onCategoryChange={handleCategoryChange}
          showCategoryFilter={shouldShowCategoryFilter}
        />

        {/* Content */}
        {state.error ? (
          <LeaderboardError 
            error={state.error} 
            onRetry={refetch}
          />
        ) : data.length === 0 && !state.isLoading ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Data Available
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {leaderboardType === "projects" 
                    ? "Projects will appear here once team members earn technical skill points!"
                    : `No ${leaderboardType.replace("-", " ")} data available yet.`
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <LeaderboardTable
            type={leaderboardType}
            data={data}
            isLoading={state.isLoading}
            maxRows={maxResults}
          />
        )}
      </div>
    </Box>
  );
});

LeaderboardContainer.displayName = "LeaderboardContainer";

export default LeaderboardContainer;