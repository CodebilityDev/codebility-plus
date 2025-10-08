// Enhanced Profile Points Types

export interface ProfilePointRule {
  points?: number;
  pointsPerItem?: number;
  maxPoints: number;
  maxItems?: number;
  isOneTime: boolean;
  minLength?: number;
  description: string;
}

export interface ProfilePointsConfig {
  [key: string]: ProfilePointRule;
}

export interface CompletionDetail {
  completed: boolean;
  points: number;
  maxPoints: number;
  itemCount?: number;
  maxItems?: number;
  description?: string;
}

export interface ProfileSectionSummary {
  completed: boolean;
  points: number;
  maxPoints: number;
}

export interface ProfilePointsResponse {
  success: boolean;
  totalPoints: number;
  maxPossiblePoints: number;
  completionPercentage: number;
  pointsCount: number;
  points: any[];
  breakdown: ProfilePointInsert[];
  completionDetails: Record<string, CompletionDetail>;
  summary: {
    profileSections: {
      basicInfo: ProfileSectionSummary;
      socialLinks: ProfileSectionSummary;
      professionalInfo: ProfileSectionSummary;
    };
    datacounts: {
      workExperiences: number;
      educationEntries: number;
      techSkills: number;
      positions: number;
    };
  };
}

export interface ProfilePointInsert {
  codev_id: string;
  category: string;
  points: number;
}

// Profile Points Categories
export const PROFILE_CATEGORIES = {
  BASIC_INFO: ['image_url', 'about', 'phone_number', 'address'],
  SOCIAL_LINKS: ['github', 'linkedin', 'portfolio_website', 'facebook', 'discord'],
  PROFESSIONAL: ['tech_stacks', 'work_experience', 'education', 'positions', 'years_of_experience']
} as const;

// Point rewards for common actions
export const POINT_REWARDS = {
  PROFILE_PHOTO: 5,
  ABOUT_SECTION: 3,
  CONTACT_INFO: 2,
  SOCIAL_LINK: 2,
  PORTFOLIO: 5,
  TECH_SKILL: 2,
  WORK_EXPERIENCE: 8,
  EDUCATION: 6,
  POSITION: 3,
  YEARS_EXPERIENCE: 5
} as const;