import type { UserSchema } from "@/utils/applicant/profile/profile";
import type { Codev, Education, WorkExperience, JobStatus, WorkSchedule } from "@/types/global/codev";
import type React from "react";
import type z from "zod";
import type { StaticImageData } from "next/image";


export interface EarnedCategories {
  earnedCategories: string[];
}

export interface AboutProps {
  data: Codev;
}

export interface FormValues {
  about: string;
}

export interface ProfilePointEntry { category: string; points: number }

export interface ContactInfoProps {
  earnedCategories: string[];
  data: {
    id?: string;
    facebook?: string | null;
    linkedin?: string | null;
    github?: string | null;
    discord?: string | null;
    portfolio_website?: string | null;
    phone_number?: string | null;
  };
}

export interface ContactInfoFormValues {
  facebook?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  portfolio_website?: string;
  phone_number?: string;
}

export interface EducationProps {
  data: Education[];
  codevId?: string;
  earnedCategories: string[];
}

export type EditModePerItem = Record<string, boolean>;

export interface EducationFormProps {
  education: Education;
  handleUpdateEducation: (
    itemNo: number,
    name: string,
    value: string | boolean,
  ) => void;
  itemNo: number;
  totalNo: number;
  editModePerItem: React.MutableRefObject<EditModePerItem>;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteEducation: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

export interface ExperienceProps {
  data: WorkExperience[];
  codevId?: string;
  earnedCategories: string[];
}

export interface ExperienceFormProps {
  experience: WorkExperience;
  handleUpdateExperience: (
    itemNo: number,
    name: string,
    value: string | boolean,
  ) => void;
  itemNo: number;
  totalNo: number;
  editModePerItem: React.MutableRefObject<EditModePerItem>;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteExperience: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

export interface JobStatusProps {
  data: JobStatus[];
}

export interface JobStatusFormProps {
  jobStatus: JobStatus;
  handleUpdateJobStatus: (
    itemNo: number,
    name: keyof JobStatus,
    value: string | boolean,
  ) => void;
  itemNo: number;
  editModePerItem: EditModePerItem;
  handleEditModePerItem: (itemNo: number, editable: boolean) => void;
  handleDeleteJobStatus: (itemNo: number, id: string) => void;
  isLoadingMain: boolean;
}

export interface PeriodSelectorProps {
  period: Period;
   
  setPeriod: (m: Period) => void;
  date: Date | undefined;
   
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
  disabled?: boolean;
}

export interface PersonalInfoProps {
  data: Codev;
}

export interface PersonalInfoFormValues {
  first_name: string;
  last_name: string;
  address: string | undefined;
  display_position: string | undefined;
  years_of_experience: number;
  headline: string | undefined;
}

export interface PhotoProps {
  earnedCategories: string[];
  data: {
    id?: string;
    image_url: string | null;
  };
}

// Types for profile points data
export interface ProfilePointsData {
  totalPoints: number;
  maxPossiblePoints: number;
  completionPercentage: number;
  completionDetails: Record<string, {
    completed: boolean;
    points: number;
    maxPoints: number;
    description?: string;
    itemCount?: number;
    maxItems?: number;
  }>;
  summary: {
    profileSections: {
      basicInfo: { points: number; maxPoints: number; completed: boolean };
      socialLinks: { points: number; maxPoints: number; completed: boolean };
      professionalInfo: { points: number; maxPoints: number; completed: boolean };
    };
    datacounts: {
      workExperiences: number;
      educationEntries: number;
      techSkills: number;
      positions: number;
    };
  };
}

export interface SkillsProps {
  earnedCategories: string[];
  data: {
    id?: string;
    tech_stacks?: string[] | null;
    level?: Record<string, any> | null;
  };
}

export interface TechStackStore {
  stack: string[];
  setStack: (stack: string[]) => void;
}

export interface TimePickerProps {
  date?: Date;
  period: Period;
   
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
   
  setDate: (date: Date | undefined) => void;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export interface GetValidNumberConfig { max: number; min?: number; loop?: boolean }

export interface GetValidArrowNumberConfig {
  min: number;
  max: number;
  step: number;
}

export type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";

export type Period = "AM" | "PM";

export interface TimeScheduleProps {
  data?: WorkSchedule | null;
}

export interface ProfilePointsCompletionDetail {
  completed?: boolean;
  points?: number;
}

export interface ProfilePointsSection {
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
  points: unknown[] | null;
  breakdown: unknown;
  completionDetails: Record<string, ProfilePointsCompletionDetail>;
  summary: {
    profileSections: {
      basicInfo: ProfilePointsSection;
      socialLinks: ProfilePointsSection;
      professionalInfo: ProfilePointsSection;
    };
    datacounts: {
      workExperiences: number;
      educationEntries: number;
      techSkills: number;
      positions: number;
    };
  };
}

export interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export type User = z.infer<typeof UserSchema>;

export interface ApplicantProfileLayoutProps {
  children: React.ReactNode;
}

export interface ProfileCompletionGuideBadgeProps {
  children?: React.ReactNode;
  variant?: "secondary" | "outline" | "success" | "warning";
  className?: string;
}

// Modern Progress Bar Component
export interface ProgressBarProps { 
  percentage: number; 
  className?: string;
  showLabel?: boolean;
  size?: "small" | "default" | "large";
}

// Section Progress Component
export interface SectionProgressProps { 
  title: string; 
  points: number; 
  maxPoints: number; 
  icon: any;
  completed: boolean;
}

export interface UploadPhotoModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  setAvatar: React.Dispatch<React.SetStateAction<string | StaticImageData>>;
}