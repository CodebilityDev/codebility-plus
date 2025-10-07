// Shared types for leaderboard components
export interface BaseLeader {
  codev_id: string;
  first_name: string;
}

export interface TechnicalLeader extends BaseLeader {
  total_points: number;
  latest_update?: string;
}

export interface SoftSkillsLeader extends BaseLeader {
  attendance_points: number;
  profile_points: number;
  total_points: number;
}

export interface ProjectLeader {
  project_id: string;
  project_name: string;
  total_points: number;
  member_count: number;
  skill_breakdown: Record<string, number>;
}

export type LeaderboardType = "technical" | "soft-skills" | "projects";
export type TimePeriod = "all" | "weekly" | "monthly";

export interface LeaderboardError {
  message: string;
  details?: string;
  code?: string;
}

export interface LeaderboardState {
  isLoading: boolean;
  error: LeaderboardError | null;
  lastUpdated?: Date;
}

export interface LeaderboardConfig {
  title: string;
  description: string;
  type: LeaderboardType;
  showTimeFilter?: boolean;
  showCategoryFilter?: boolean;
  maxResults?: number;
}