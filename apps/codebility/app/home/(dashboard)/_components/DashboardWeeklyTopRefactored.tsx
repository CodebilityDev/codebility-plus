"use client";

import React from "react";
import LeaderboardContainer from "@/components/leaderboard/LeaderboardContainer";

/**
 * Refactored WeeklyTop component using the new leaderboard architecture
 * 
 * This component replaces the previous 800+ line monolithic component with
 * a clean, maintainable, and modular approach that:
 * 
 * - Uses proper TypeScript types
 * - Implements error boundaries and loading states
 * - Provides consistent UI/UX across all leaderboard types
 * - Eliminates code duplication
 * - Follows modern React patterns with hooks and memoization
 * - Includes proper accessibility features
 * - Has responsive design built-in
 */
export default function DashboardWeeklyTop() {
  return (
    <LeaderboardContainer 
      autoRefresh={true}
      refreshInterval={30000} // 30 seconds
      maxResults={10}
    />
  );
}