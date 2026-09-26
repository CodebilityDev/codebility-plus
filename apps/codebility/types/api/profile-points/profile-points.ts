import type { POINT_RULES } from "@/lib/api/profile-points/profile-points";

export type PointRuleName = keyof typeof POINT_RULES;

export type ArrayFieldName =
  | "tech_stacks"
  | "work_experience"
  | "education"
  | "positions";

export type ArrayPointRule = {
  pointsPerItem: number;
  maxItems: number;
  maxPoints: number;
  description: string;
};

export type ProfilePointsBreakdown = {
  category: string;
  points: number;
};

export type ProfileCompletionDetail = {
  completed: boolean;
  points: number;
  maxPoints: number;
  description?: string;
  itemCount?: number;
  maxItems?: number;
};

export type ProfilePointsResult = {
  totalPoints: number;
  maxPossiblePoints: number;
  completionPercentage: number;
  breakdown: ProfilePointsBreakdown[];
  completionDetails: Record<string, ProfileCompletionDetail>;
  dataCounts: {
    workExperiences: number;
    educationEntries: number;
    techSkills: number;
    positions: number;
  };
};
