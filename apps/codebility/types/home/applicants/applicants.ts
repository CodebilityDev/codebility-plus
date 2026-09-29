import type { newApplicantsSchema } from "@/utils/home/applicants/applicants";
import type z from 'zod';
import type { ColumnDef, Table as ReactTable } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import type React from "react";

export type NewApplicantType = z.infer<typeof newApplicantsSchema>

export interface ExperienceRanges {
  novice: boolean; // 0-2 years
  intermediate: boolean; // 3-5 years
  expert: boolean; // 5+ years
}

export interface DataTableProps<TData extends NewApplicantType, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface ApplicantFilters {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
  techStacks: Record<string, boolean>;
  testStatus: {
    taken: boolean;
    notTaken: boolean;
    overdue: boolean;
  };
  reminderCount: {
    none: boolean;
    low: boolean;
    medium: boolean;
    high: boolean;
  };
  applicationDate: {
    last7Days: boolean;
    last30Days: boolean;
    last90Days: boolean;
    custom: boolean;
    startDate: string;
    endDate: string;
  };
}

export interface ApplicantMobileTableProps<TData extends NewApplicantType> {
  table: ReactTable<TData>;
}

export interface BoundaryProps {
  children: ReactNode;
}

export interface BoundaryState {
  hasError: boolean;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
  label: string;
}

export type StageState = "completed" | "current" | "pending" | "denied";

export interface DerivedStage {
  key: PipelineStageKey;
  label: string;
  state: StageState;
  /** ISO timestamp string for the stage, or null when unavailable. */
  timestamp: string | null;
}

export interface DerivedTimeline {
  stages: DerivedStage[];
  /** True when the application_status could not be matched to a stage. */
  statusUnrecognized: boolean;
}

export type PipelineStageKey =
  | "applying"
  | "testing"
  | "onboarding"
  | "waitlist";

export interface PipelineStageDefinition {
  /** Stable key matching the relevant application_status values. */
  key: PipelineStageKey;
  /** Human-readable label rendered in the timeline. */
  label: string;
  /** Sequential order position (ascending). */
  order: number;
}

export interface ApplicantActionButtonProps {
  applicant: NewApplicantType;
}

export interface ApplicantEmailActionProps {
  applicants: NewApplicantType[];
}

export interface ApplicantFiltersComponentProps {
  activeFilterCount: number;
  filters: {
    hasPortfolio: boolean;
    noPortfolio: boolean;
    hasGithub: boolean;
    noGithub: boolean;
    experienceRanges: {
      novice: boolean;
      intermediate: boolean;
      expert: boolean;
    };
    positions: Record<string, boolean>;
    techStacks: Record<string, boolean>;
    testStatus: {
      taken: boolean;
      notTaken: boolean;
      overdue: boolean;
    };
    reminderCount: {
      none: boolean;
      low: boolean;
      medium: boolean;
      high: boolean;
    };
    applicationDate: {
      last7Days: boolean;
      last30Days: boolean;
      last90Days: boolean;
      custom: boolean;
      startDate: string;
      endDate: string;
    };
  };
  uniquePositions: string[];
  uniqueTechStacks: string[];
  updateFilter: (key: keyof ApplicantFilters, value: boolean) => void;
  updateExperienceFilter: (key: keyof ExperienceRanges, value: boolean) => void;
  updatePositionFilter: (key: string, value: boolean) => void;
  updateTechStackFilter: (key: string, value: boolean) => void;
  updateDateRangeFilter: (key: string, value: boolean | string) => void;
  updateReminderFilter: (key: string, value: boolean) => void;
  updateTestStatusFilter: (key: string, value: boolean) => void;
  onResetFilters: () => void;
}

export interface ApplicantFiltersBadgeProps {
  filters: ApplicantFilters;
  setFilter: React.Dispatch<React.SetStateAction<ApplicantFilters>>;
  onFilterChange: (filters: ApplicantFilters) => void;
}

export interface ApplicantFilterHeadersProps {
  applicants: NewApplicantType[];
  setApplicants: React.Dispatch<React.SetStateAction<NewApplicantType[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}

export interface ApplicantListsProps {
  applicants: NewApplicantType[];
}

export interface ApplicantProcessTimelineProps {
  applicant: NewApplicantType;
}

export interface ApplicantProfileColSecProps {
  applicant: NewApplicantType;
  row: Row<NewApplicantType>;
}

// Helper Components
export interface ApplicantProfileModalSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface ApplicantReapplyTimeProps {
  applicant: NewApplicantType;
  isMobile?: boolean;
}

export interface ApplicantRowActionButtonProps {
  applicants: NewApplicantType[];
  onActionComplete?: () => void;
}

export interface ApplicantSortersProps {
  sortOptions: SortOption[];
  onAddSort: (field: string, label: string) => void;
  onRemoveSort: (field: string) => void;
  onToggleSortDirection: (field: string) => void;
  onReorderSorts: (sortOptions: SortOption[]) => void;
  resetSort: () => void;
}

export interface ApplicantTechStackProps {
  applicant: NewApplicantType;
}

export interface ApplicantTestTimeRemainingProps {
  applicant: NewApplicantType;
  isMobile?: boolean;
}

export interface TimelineBodyProps { applicant: NewApplicantType }

export interface ApplicantModalContextValue {
  isModalOpen: boolean;
  selectedApplicant: NewApplicantType | null;
  openModal: (applicant: NewApplicantType) => void;
  closeModal: () => void;
}

export interface ApplicantModalProviderProps {
  children: ReactNode;
}

export interface ApplicantsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface ErrorProps { error: Error & { digest?: string }; reset: () => void }
