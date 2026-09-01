import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchUserDraftCount(
  supabase: SupabaseClient,
  projectId: string,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("task_drafts")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("created_by", userId);

  if (error) {
    console.error("Error counting drafts:", error);
    return 0;
  }

  return count ?? 0;
}
