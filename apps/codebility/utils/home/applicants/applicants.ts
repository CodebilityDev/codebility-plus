import { z } from "zod";
import { baseColumns, waitlistColumns } from "@/constants/home/applicants/applicants";
import type { NewApplicantType } from "@/types/home/applicants/applicants";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * Get the appropriate columns for a specific tab
 * - Waitlist tab: includes Mobile Dev and Commitment columns
 * - All other tabs: only base columns
 */
export function getApplicantColumns(tab: string): ColumnDef<NewApplicantType>[] {
  if (tab === "waitlist") {
    // Insert waitlist columns before the reapply and actions columns
    const reapplyIndex = baseColumns.findIndex(col => col.id === "reapply");
    return [
      ...baseColumns.slice(0, reapplyIndex),
      ...waitlistColumns,
      ...baseColumns.slice(reapplyIndex),
    ];
  }

  return baseColumns;
}

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
})
