import { cache } from "react";
import type { CurrentUserProfile } from "@/types/global/current-user";
import { createClientServerComponent } from "@/lib/global/supabase-server";

/**
 * The signed-in codev row, read once per request.
 *
 * Server-only. Client components reach it through the
 * `getCurrentCodevAction` server action so that pages never read cookies
 * during render (which would force the whole route to render dynamically).
 */
export const getCurrentCodev = cache(
  async (): Promise<CurrentUserProfile | null> => {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("codev")
    .select(
      "id, first_name, last_name, email_address, image_url, role_id, application_status, internal_status, availability_status",
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching current codev:", error);
    return null;
  }

    return data;
  },
);