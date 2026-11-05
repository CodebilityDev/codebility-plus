import type { POINT_RULES } from "@/lib/global/profile-points";

export type PointRuleName = keyof typeof POINT_RULES;

export type ArrayFieldName =
  | "tech_stacks"
  | "work_experience"
  | "education"
  | "positions";

export interface ArrayPointRule {
  pointsPerItem: number;
  maxItems: number;
  maxPoints: number;
  description: string;
}

export interface ProfilePointsBreakdown {
  category: string;
  points: number;
}

export interface ProfileCompletionDetail {
  completed: boolean;
  points: number;
  maxPoints: number;
  description?: string;
  itemCount?: number;
  maxItems?: number;
}

export interface ProfilePointsResult {
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
}
export interface ProfileCompletionSummary {
  profileSections: {
    basicInfo: { completed: boolean; points: number; maxPoints: number };
    socialLinks: { completed: boolean; points: number; maxPoints: number };
    professionalInfo: { completed: boolean; points: number; maxPoints: number };
  };
  datacounts: ProfilePointsResult["dataCounts"];
}

export interface ProfilePointsData extends ProfilePointsResult {
  success: boolean;
  pointsCount: number;
  points: ProfilePointsBreakdown[];
  summary: ProfileCompletionSummary;
}

export function profilePointsResponse(
  result: ProfilePointsResult,
  points: ProfilePointsBreakdown[],
): ProfilePointsData {
  const d = result.completionDetails;
  const at = (key: string) => d[key]?.points ?? 0;
  const done = (key: string) => d[key]?.completed ?? false;

  return {
    ...result,
    success: true,
    pointsCount: points.length,
    points,
    summary: {
      profileSections: {
        basicInfo: {
          completed: done("image_url") || done("about") || done("phone_number"),
          points: at("image_url") + at("about") + at("phone_number") + at("address"),
          maxPoints: 12,
        },
        socialLinks: {
          completed:
            done("github") || done("linkedin") || done("portfolio_website"),
          points:
            at("github") +
            at("linkedin") +
            at("portfolio_website") +
            at("facebook") +
            at("discord"),
          maxPoints: 11,
        },
        professionalInfo: {
          completed:
            done("tech_stacks") ||
            done("work_experience") ||
            done("education"),
          points:
            at("tech_stacks") +
            at("work_experience") +
            at("education") +
            at("positions") +
            at("years_of_experience"),
          maxPoints: 104,
        },
      },
      datacounts: result.dataCounts,
    },
  };
}

export function earnedPoints(
  data: ProfilePointsData | null | undefined,
  category: string,
): number {
  if (!data) return 0;
  return data.points.find((entry) => entry.category === category)?.points ?? 0;
}