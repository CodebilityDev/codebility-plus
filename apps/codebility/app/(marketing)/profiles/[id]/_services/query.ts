"use server";

import { createClientServerComponent } from "@/utils/supabase/server";

export const getMemberRatingScore = async (memberId: string): Promise<number> => {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .rpc("calculate_member_rating_score", { member_uuid: memberId })
      .single();

    if (error) throw error;

    // unwrap the actual numeric value from the returned object
    const score =
      typeof data === "number" ? data : (data as any)?.calculate_member_rating_score;

    return score ?? 0; // default to 0 if null or undefined
  } catch (error) {
    console.error("Error fetching member score:", error);
    return 0; // fail gracefully
  }
};


export interface ProjectInfo {
  project_id: string;
  name: string;
  main_image: string | null;
}

export const getMemberProjects = async (memberId: string): Promise<ProjectInfo[]> => {
  try {
    const supabase = await createClientServerComponent();

    // Step 1: Get all project_ids for the member
    const { data: memberProjects, error: memberError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("codev_id", memberId);

    if (memberError) throw memberError;
    if (!memberProjects || memberProjects.length === 0) return [];

    const projectIds = memberProjects.map((row) => row.project_id);
    
    

    // Step 2: Fetch project info for those IDs
    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id, name, main_image") // Use actual column names
      .in("id", projectIds);

    if (projectError) throw projectError;
    if (!projects) return [];

    // Map to the ProjectInfo shape
    const result: ProjectInfo[] = projects.map((p) => ({
      project_id: p.id,
      name: p.name,
      main_image: p.main_image,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching member projects:", error);
    return [];
  }
};