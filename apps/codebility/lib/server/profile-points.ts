import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Profile-completion scoring rules. `points` fields are all-or-nothing, while
 * `pointsPerItem` fields score per row up to `maxItems`/`maxPoints`.
 */
const POINT_RULES = {
  image_url: {
    points: 5,
    maxPoints: 5,
    isOneTime: true,
    description: "Profile photo upload",
  },
  about: {
    points: 3,
    maxPoints: 3,
    isOneTime: true,
    minLength: 50,
    description: "About section (minimum 50 characters)",
  },
  phone_number: {
    points: 2,
    maxPoints: 2,
    isOneTime: true,
    description: "Phone number",
  },
  address: {
    points: 2,
    maxPoints: 2,
    isOneTime: true,
    description: "Complete address",
  },
  github: {
    points: 2,
    maxPoints: 2,
    isOneTime: true,
    description: "GitHub profile link",
  },
  linkedin: {
    points: 2,
    maxPoints: 2,
    isOneTime: true,
    description: "LinkedIn profile link",
  },
  facebook: {
    points: 1,
    maxPoints: 1,
    isOneTime: true,
    description: "Facebook profile link",
  },
  discord: {
    points: 1,
    maxPoints: 1,
    isOneTime: true,
    description: "Discord username",
  },
  portfolio_website: {
    points: 5,
    maxPoints: 5,
    isOneTime: true,
    description: "Portfolio website",
  },
  tech_stacks: {
    pointsPerItem: 2,
    maxPoints: 20,
    maxItems: 10,
    isOneTime: false,
    description: "Technical skills (2 points each, max 10 skills)",
  },
  work_experience: {
    pointsPerItem: 8,
    maxPoints: 40,
    maxItems: 5,
    isOneTime: false,
    description: "Work experience (8 points each, max 5 experiences)",
  },
  education: {
    pointsPerItem: 6,
    maxPoints: 24,
    maxItems: 4,
    isOneTime: false,
    description: "Education entries (6 points each, max 4 entries)",
  },
  positions: {
    pointsPerItem: 3,
    maxPoints: 15,
    maxItems: 5,
    isOneTime: false,
    description: "Job positions/roles (3 points each, max 5 positions)",
  },
  years_of_experience: {
    points: 5,
    maxPoints: 5,
    isOneTime: true,
    description: "Years of experience field",
  },
} as const;

export const MAX_PROFILE_POINTS: number = Object.values(POINT_RULES).reduce(
  (total, rule) => total + rule.maxPoints,
  0,
);

type PointRuleName = keyof typeof POINT_RULES;
type ArrayFieldName =
  | "tech_stacks"
  | "work_experience"
  | "education"
  | "positions";
type ArrayPointRule = {
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

function isFieldFilled(value: unknown, fieldName?: PointRuleName) {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;

    const rule = fieldName ? POINT_RULES[fieldName] : undefined;
    if (rule && "minLength" in rule) return trimmed.length >= rule.minLength;

    return true;
  }

  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function calculateArrayPoints(
  items: unknown[] | null | undefined,
  rule: ArrayPointRule,
) {
  if (!items || !Array.isArray(items) || items.length === 0) return 0;

  const itemCount = Math.min(items.length, rule.maxItems);
  return Math.min(itemCount * rule.pointsPerItem, rule.maxPoints);
}

const CODEV_PROFILE_SELECT =
  "id, image_url, tech_stacks, about, phone_number, address, " +
  "github, facebook, linkedin, discord, portfolio_website, " +
  "positions, years_of_experience";

async function fetchCodevProfile(supabase: SupabaseClient, codevId: string) {
  const { data, error } = await supabase
    .from("codev")
    .select(CODEV_PROFILE_SELECT)
    .eq("id", codevId)
    .single();

  if (error || !data) {
    if (error) console.error("Error fetching codev profile data:", error);
    return null;
  }

  return data as unknown as Record<string, unknown>;
}

/**
 * Computes profile-completion points for a codev. Read-only: it never touches
 * the `profile_points` table, so render paths can call it without side effects.
 *
 * Pass `codev` when the row has already been fetched (the /home dashboard has
 * it) to skip a redundant query.
 */
export async function computeProfilePoints(
  supabase: SupabaseClient,
  codevId: string,
  codev?: Record<string, unknown> | null,
): Promise<ProfilePointsResult | null> {
  const [codevData, workResult, educationResult] = await Promise.all([
    codev ?? fetchCodevProfile(supabase, codevId),
    supabase.from("work_experience").select("id").eq("codev_id", codevId),
    supabase.from("education").select("id").eq("codev_id", codevId),
  ]);

  if (!codevData) return null;

  const workExperiences = workResult.data ?? [];
  const educationData = educationResult.data ?? [];

  const breakdown: ProfilePointsBreakdown[] = [];
  const completionDetails: Record<string, ProfileCompletionDetail> = {};
  let totalPoints = 0;

  for (const [field, rule] of Object.entries(POINT_RULES)) {
    if (!rule.isOneTime || !(field in codevData)) continue;
    if (!("points" in rule)) continue;

    if (isFieldFilled(codevData[field], field as PointRuleName)) {
      breakdown.push({ category: field, points: rule.points });
      totalPoints += rule.points;
      completionDetails[field] = {
        completed: true,
        points: rule.points,
        maxPoints: rule.maxPoints,
      };
    } else {
      completionDetails[field] = {
        completed: false,
        points: 0,
        maxPoints: rule.maxPoints,
        description: rule.description,
      };
    }
  }

  const arrayFields: Array<{
    field: ArrayFieldName;
    items: unknown[] | null | undefined;
  }> = [
    { field: "tech_stacks", items: codevData.tech_stacks as unknown[] | null },
    { field: "work_experience", items: workExperiences },
    { field: "education", items: educationData },
    { field: "positions", items: codevData.positions as unknown[] | null },
  ];

  for (const { field, items } of arrayFields) {
    const rule = POINT_RULES[field] as ArrayPointRule;
    const points = calculateArrayPoints(items, rule);

    if (points > 0) {
      breakdown.push({ category: field, points });
      totalPoints += points;
    }

    completionDetails[field] = {
      completed: points > 0,
      points,
      maxPoints: rule.maxPoints,
      itemCount: Array.isArray(items) ? items.length : 0,
      maxItems: rule.maxItems,
      description: rule.description,
    };
  }

  return {
    totalPoints,
    maxPossiblePoints: MAX_PROFILE_POINTS,
    completionPercentage: Math.round((totalPoints / MAX_PROFILE_POINTS) * 100),
    breakdown,
    completionDetails,
    dataCounts: {
      workExperiences: workExperiences.length,
      educationEntries: educationData.length,
      techSkills: Array.isArray(codevData.tech_stacks)
        ? codevData.tech_stacks.length
        : 0,
      positions: Array.isArray(codevData.positions)
        ? codevData.positions.length
        : 0,
    },
  };
}

/**
 * Replaces the persisted `profile_points` rows with a freshly computed breakdown.
 * Returns the insert error, if any.
 */
export async function persistProfilePoints(
  supabase: SupabaseClient,
  codevId: string,
  breakdown: ProfilePointsBreakdown[],
) {
  const { error: deleteError } = await supabase
    .from("profile_points")
    .delete()
    .eq("codev_id", codevId);

  if (deleteError) {
    console.error("Error deleting old profile points:", deleteError);
  }

  if (breakdown.length === 0) return null;

  const { error } = await supabase.from("profile_points").insert(
    breakdown.map((entry) => ({
      codev_id: codevId,
      category: entry.category,
      points: entry.points,
    })),
  );

  return error;
}
