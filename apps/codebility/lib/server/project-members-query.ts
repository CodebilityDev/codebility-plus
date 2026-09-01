import type { SupabaseClient } from "@supabase/supabase-js";

import type { SimpleMemberData } from "@/app/home/projects/actions";

export async function fetchProjectMembers(
  supabase: SupabaseClient,
  projectId: string,
): Promise<SimpleMemberData[]> {
  const { data: projectMembers, error: pmError } = await supabase
    .from("project_members")
    .select("codev_id, role, joined_at")
    .eq("project_id", projectId)
    .eq("role", "member");

  if (pmError) {
    console.error("Error fetching project members:", pmError);
    throw pmError;
  }

  if (!projectMembers?.length) {
    return [];
  }

  const codevIds = projectMembers.map((pm) => pm.codev_id);

  const { data: codevs, error: codevError } = await supabase
    .from("codev")
    .select("id, first_name, last_name, email_address, display_position, image_url")
    .in("id", codevIds);

  if (codevError) {
    console.error("Error fetching codev details:", codevError);
    throw codevError;
  }

  return projectMembers
    .map((pm) => {
      const codev = codevs?.find((c) => c.id === pm.codev_id);
      if (!codev) {
        console.warn(`Missing codev record for member: ${pm.codev_id}`);
        return null;
      }

      return {
        id: codev.id,
        first_name: codev.first_name,
        last_name: codev.last_name,
        email_address: codev.email_address,
        display_position: codev.display_position,
        image_url: codev.image_url,
        role: pm.role,
        joined_at: pm.joined_at,
      };
    })
    .filter(Boolean) as SimpleMemberData[];
}
