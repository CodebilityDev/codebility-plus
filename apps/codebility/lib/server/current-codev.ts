import { cache } from "react";
import type { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";

/**
 * The signed-in codev row, read once per request.
 *
 * The /home layout renders both the sidebar and the client user store from
 * this, so a page load no longer pays for a server read plus a duplicate
 * client-side `auth.getUser()` + `codev` fetch during store hydration.
 */
export const getCurrentCodev = cache(async (): Promise<Codev | null> => {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("codev")
    .select("*")
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
// ponytail: JSON cannot carry a column that is genuinely non-JSON; hand-write a
// mapper if one is ever added.
function toPlainCodev(row: unknown): Codev {
  return JSON.parse(JSON.stringify(row)) as Codev;
}
