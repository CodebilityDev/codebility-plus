import type { Database } from "@/types/global/supabase";

type CodevRow = Database["public"]["Tables"]["codev"]["Row"];

export type CurrentUserProfile = Pick<
  CodevRow,
  | "id"
  | "first_name"
  | "last_name"
  | "email_address"
  | "image_url"
  | "role_id"
  | "application_status"
  | "internal_status"
  | "availability_status"
>;

export type NavbarUser = Pick<
  CodevRow,
  "first_name" | "last_name" | "email_address" | "image_url"
>;