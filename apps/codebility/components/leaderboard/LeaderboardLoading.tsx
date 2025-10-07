"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { Trophy, Users, Star } from "lucide-react";
import { LeaderboardType } from "@/types/leaderboard";

interface LeaderboardLoadingProps {
  type: LeaderboardType;
  rowCount?: number;
  showHeader?: boolean;
  className?: string;
}

const LeaderboardLoading: React.FC<LeaderboardLoadingProps> = ({
  type,
  rowCount = 10,
  showHeader = true,
  className = ""
}) => {
  const getIcon = () => {
    switch (type) {
      case "soft-skills":
        return <Users className="h-5 w-5 text-emerald-500" />;
      case "projects":
        return <Trophy className="h-5 w-5 text-purple-500" />;
      default:
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "soft-skills":
        return "Loading Soft Skills Leaderboard...";
      case "projects":
        return "Loading Projects Leaderboard...";
      default:
        return "Loading Technical Leaderboard...";
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "soft-skills":
        return "from-emerald-900 to-teal-800";
      case "projects":
        return "from-purple-900 to-indigo-800";
      default:
        return "from-gray-900 to-gray-800";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-pulse">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {getTitle()}
            </h3>
            <p className="text-sm text-gray-500">
              Fetching the latest rankings...
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className={`bg-gradient-to-r ${getHeaderColor()} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 bg-white/20" />
              <Skeleton className="h-6 w-24 bg-white/20" />
              <Skeleton className="h-6 w-20 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rowCount }, (_, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              {/* Rank */}
              <div className="flex items-center gap-3 min-w-[80px]">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-4" />
              </div>

              {/* Name/Title */}
              <div className="flex-1 mx-4">
                <Skeleton className="h-5 w-32" />
              </div>

              {/* Points/Details */}
              <div className="flex items-center gap-2 min-w-[120px] justify-end">
                {type === "soft-skills" ? (
                  // Soft skills breakdown
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col items-center min-w-[35px]">
                      <Skeleton className="h-3 w-8 mb-1" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                    <div className="flex flex-col items-center min-w-[35px]">
                      <Skeleton className="h-3 w-8 mb-1" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                    <div className="flex flex-col items-center min-w-[45px]">
                      <Skeleton className="h-3 w-10 mb-1" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-1 w-6 rounded-full" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular points with progress bar
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-2 w-16 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator at bottom */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 flex items-center justify-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
          <span className="text-xs text-gray-500">Loading data...</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardLoading;