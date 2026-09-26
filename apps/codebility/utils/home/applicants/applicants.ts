import { baseColumns, waitlistColumns } from "@/constants/home/applicants/applicants";
import { NewApplicantType } from "@/types/home/applicants/applicants";
import { ColumnDef } from "@tanstack/react-table";

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
