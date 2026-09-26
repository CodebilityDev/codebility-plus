import z from 'zod';
import { ColumnDef, Table as ReactTable } from "@tanstack/react-table";
import { ReactNode } from "react";


export const newApplicantsSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.string(),
    phone_number: z.string().nullable(),
    address: z.string().nullable(),
    about: z.string().nullable(),
    positions: z.array(z.string()).nullable(),
    display_position: z.string().nullable(),
    portfolio_website: z.string().nullable(),
    tech_stacks: z.array(z.string()).nullable(),
    image_url: z.string().nullable(),
    availability_status: z.boolean(),
    nda_status: z.boolean().nullable(),
    level: z.record(z.any()).nullable(),
    application_status: z.string(),
    rejected_count: z.number(),
    facebook: z.string().nullable(),
    linkedin: z.string().nullable(),
    github: z.string().nullable(),
    discord: z.string().nullable(),
    years_of_experience: z.number(),
    role_id: z.number().nullable(),
    internal_status: z.string(),
    mentor_id: z.string().nullable(),
    nda_signature: z.string().nullable(),
    nda_document: z.string().nullable(),
    nda_signed_at: z.string().nullable(),
    nda_request_sent: z.boolean().nullable(),
    date_applied: z.string().datetime({ offset: true }).nullable(),
    applicant: z.object({
        id: z.string(),
        codev_id: z.string(),
        test_taken: z.string().datetime({ offset: true }).nullable(),
        fork_url: z.string().nullable(),
        reminded_count: z.number().min(0).nullable(),
        last_reminded_date: z.string().datetime({ offset: true }).nullable(),
        quiz_score: z.number().nullable(),
        quiz_total: z.number().nullable(),
        quiz_passed: z.boolean().nullable(),
        quiz_completed_at: z.string().datetime({ offset: true }).nullable(),
        can_do_mobile: z.boolean().nullable(),
        commitment_signed_at: z.string().datetime({ offset: true }).nullable(),
        waitlist_entered_at: z.string().datetime({ offset: true }).nullable().optional(),
        signature_data: z.string().nullable(),
        created_at: z.string().datetime({ offset: true }),
        updated_at: z.string().datetime({ offset: true }),
    }).nullable(),
    created_at: z.string().datetime({ local: true }),
    updated_at: z.string().datetime({ local: true }),
})

export type NewApplicantType = z.infer<typeof newApplicantsSchema>

export type ExperienceRanges = {
  novice: boolean; // 0-2 years
  intermediate: boolean; // 3-5 years
  expert: boolean; // 5+ years
};

export interface DataTableProps<TData extends NewApplicantType, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type ApplicantFilters = {
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
};

export interface ApplicantMobileTableProps<TData extends NewApplicantType> {
  table: ReactTable<TData>;
}

export interface BoundaryProps {
  children: ReactNode;
}

export interface BoundaryState {
  hasError: boolean;
}

export type SortOption = {
  field: string;
  direction: "asc" | "desc";
  label: string;
};

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
