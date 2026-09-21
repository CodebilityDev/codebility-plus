import { cache } from "react";
import type { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";

// Columns the shell and its consumers actually read. Every extra column is
// paid on every authenticated request.
const CURRENT_CODEV_COLUMNS =
  "id, first_name, last_name, username, email_address, image_url, role_id, internal_status, availability_status, display_position, promote_declined";

export type CurrentCodev = Pick<
  Codev,
  | "id"
  | "first_name"
  | "last_name"
  | "username"
  | "email_address"
  | "image_url"
  | "role_id"
  | "internal_status"
  | "availability_status"
  | "display_position"
  | "promote_declined"
>;

/**
 * The signed-in codev row, read once per request.
 *
 * The /home layout renders both the sidebar and the client user store from
 * this, so a page load no longer pays for a server read plus a duplicate
 * client-side `auth.getUser()` + `codev` fetch during store hydration.
 */
export const getCurrentCodev = cache(async (): Promise<CurrentCodev | null> => {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("codev")
    .select(CURRENT_CODEV_COLUMNS)
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching current codev:", error);
    return null;
  }

  return toPlainCodev(data);
});

// PostgREST returns real Dates for timestamptz columns, which React refuses to
// serialize across the Server -> Client boundary. JSON round-trip makes them
// ISO strings to match the Codev type.
function toPlainCodev(row: unknown): CurrentCodev {
  return JSON.parse(JSON.stringify(row)) as CurrentCodev;
}
