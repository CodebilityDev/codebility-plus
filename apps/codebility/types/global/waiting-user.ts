import type { Database } from "@/types/global/supabase";

type CodevRow = Database["public"]["Tables"]["codev"]["Row"];
type ApplicantWaitingRow = Pick<
  Database["public"]["Tables"]["applicant"]["Row"],
  | "id"
  | "codev_id"
  | "test_taken"
  | "fork_url"
  | "joined_discord"
  | "joined_messenger"
  | "created_at"
  | "updated_at"
>;

export type WaitingUser = Pick<
  CodevRow,
  | "id"
  | "first_name"
  | "display_position"
  | "application_status"
  | "rejected_count"
  | "date_applied"
> & {
  applicant: ApplicantWaitingRow | null;
};