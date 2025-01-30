"use server";

import { revalidatePath } from "next/cache";
import { Client, Codev } from "@/types/home/codev";
import { deleteImage, getImagePath, uploadImage } from "@/utils/uploadImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function createProject(
  formData: FormData,
  selectedMembers: Codev[],
) {
  const supabase = createClientComponentClient();

  try {
    // Extract member IDs
    const memberIds = selectedMembers.map((member) => member.id);

    // Create project with member IDs
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: formData.get("name"),
        description: formData.get("description"),
        github_link: formData.get("github_link"),
        website_url: formData.get("website_url"),
        figma_link: formData.get("figma_link"),
        team_leader_id: formData.get("team_leader_id"),
        client_id: formData.get("client_id"),
        start_date: formData.get("start_date"),
        project_category_id: formData.get("project_category_id")
          ? parseInt(formData.get("project_category_id") as string)
          : null,
        main_image: formData.get("main_image"),
        status: "pending",
        members: memberIds, // Add members array here
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create project members in project_members table
    if (memberIds.length > 0) {
      const { error: membersError } = await supabase
        .from("project_members")
        .insert(
          memberIds.map((memberId) => ({
            project_id: project.id,
            codev_id: memberId,
            role: "member",
            joined_at: new Date().toISOString(),
          })),
        );

      if (membersError) throw membersError;
    }

    // Create default kanban board
    const { error: boardError } = await supabase.from("kanban_boards").insert({
      name: `${project.name} Board`,
      project_id: project.id,
      description: `Default board for ${project.name}`,
    });

    if (boardError) throw boardError;

    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = createClientComponentClient();

  try {
    // Convert form data to object
    const updateData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key === "members") {
        // Parse members string back to array
        updateData[key] = JSON.parse(value as string);
      } else {
        updateData[key] = value;
      }
    }

    // Ensure members is an array
    if (!Array.isArray(updateData.members)) {
      updateData.members = [];
    }

    const { data, error } = await supabase
      .from("projects")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        // Ensure members is cast to uuid[]
        members: updateData.members || [],
      })
      .eq("id", projectId)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(projectId: string) {
  const supabase = createClientComponentClient();

  try {
    // Get project data first to handle image deletion
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select()
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    // Delete project image if exists
    if (project.main_image) {
      const imagePath = getImagePath(project.main_image);
      if (imagePath) {
        await deleteImage(imagePath, "projects");
      }
    }

    // Delete project (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) throw deleteError;

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export const getTeamLead = async (
  teamLeaderId: string,
): Promise<{
  error: any;
  data: Codev | null;
}> => {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from("codev")
      .select("*")
      .eq("id", teamLeaderId)
      .single();

    if (error) {
      console.error("Error fetching team lead:", error);
      return { error, data: null };
    }

    return { error: null, data: data as Codev };
  } catch (error) {
    console.error("Unexpected error fetching team lead:", error);
    return { error, data: null };
  }
};

export const getMembers = async (
  memberIds: string[],
): Promise<{
  error: any;
  data: Codev[] | null;
}> => {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = await supabase
      .from("codev")
      .select(
        `
        id,
        first_name,
        last_name,
        email_address,
        display_position,
        image_url,
        positions,
        tech_stacks,
        projects (
          id,
          name
        )
      `,
      )
      .in("id", memberIds);

    if (error) {
      console.error("Error fetching members:", error);
      return { error, data: null };
    }

    // Transform the data to match Codev type
    const transformedData = data?.map((member) => ({
      ...member,
      positions: member.positions || [],
      tech_stacks: member.tech_stacks || [],
      projects: member.projects || [],
    }));

    return { error: null, data: transformedData as Codev[] };
  } catch (error) {
    console.error("Unexpected error fetching members:", error);
    return { error, data: null };
  }
};

export const updateProjectMembers = async (
  projectId: string,
  members: Codev[],
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

  try {
    // Start a transaction by deleting existing members
    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    // Insert new members with proper role and joined_at
    const { error: insertError } = await supabase
      .from("project_members")
      .insert(
        members.map((member) => ({
          project_id: projectId,
          codev_id: member.id,
          role: "member",
          joined_at: new Date().toISOString(),
        })),
      );

    if (insertError) throw insertError;

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error updating project members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getProjectCodevs = async (filters = {}): Promise<Codev[]> => {
  const supabase = createClientComponentClient();

  let query = supabase.from("codev").select(`
    id,
    first_name,
    last_name,
    email_address,
    image_url,
    positions,
    tech_stacks,
    display_position,
    internal_status,
    projects (
      id
    )
  `);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Codevs:", error);
    throw new Error("Failed to fetch Codevs");
  }

  return (data as Codev[]) || [];
};

export const getProjectClients = async (): Promise<Client[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, company_name, company_logo");

  if (error) {
    console.error("Error fetching Clients:", error);
    throw new Error("Failed to fetch Clients");
  }

  return data || [];
};

export const getProjectCategories = async () => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("projects_category")
    .select("id, name, description");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data || [];
};
