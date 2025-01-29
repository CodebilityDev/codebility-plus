// actions.ts
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
    // Extract form data
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const github_link = formData.get("github_link")?.toString();
    const website_url = formData.get("website_url")?.toString();
    const figma_link = formData.get("figma_link")?.toString();
    const team_leader_id = formData.get("team_leader_id")?.toString();
    const client_id = formData.get("client_id")?.toString();
    const start_date = formData.get("start_date")?.toString();
    const project_category_id = formData.get("project_category_id")?.toString();
    const mainImage = formData.get("main_image") as File;

    if (!name || !start_date) {
      return { success: false, error: "Name and start date are required" };
    }

    // Handle image upload
    let main_image;
    if (mainImage) {
      const { publicUrl } = await uploadImage(mainImage, {
        bucket: "codebility",
        folder: "projectImage",
      });
      main_image = publicUrl;
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        github_link,
        website_url,
        figma_link,
        team_leader_id,
        client_id,
        start_date,
        project_category_id: project_category_id
          ? parseInt(project_category_id)
          : null,
        main_image,
        status: "active",
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Insert project members
    const membersToInsert = selectedMembers.map((member) => ({
      project_id: project.id,
      codev_id: member.id,
      role: "member", // Adjust as necessary
    }));

    const { error: membersError } = await supabase
      .from("project_members")
      .insert(membersToInsert);

    if (membersError) throw membersError;

    // Create default kanban board for project
    const { error: boardError } = await supabase.from("kanban_boards").insert({
      name: `${name} Board`,
      project_id: project.id,
      description: `Default board for ${name}`,
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
    // Get existing project
    const { data: existingProject, error: fetchError } = await supabase
      .from("projects")
      .select()
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    // Handle image update
    const newImage = formData.get("main_image") as File;
    let main_image = existingProject.main_image;

    if (newImage) {
      // Delete old image if exists
      if (existingProject.main_image) {
        const oldImagePath = getImagePath(existingProject.main_image);
        if (oldImagePath) {
          await deleteImage(oldImagePath, "projects");
        }
      }

      // Upload new image
      const { publicUrl } = await uploadImage(newImage, {
        bucket: "codebility",
        folder: "projects",
      });
      main_image = publicUrl;
    }

    // Update project
    const { data: project, error: updateError } = await supabase
      .from("projects")
      .update({
        name: formData.get("name")?.toString() || existingProject.name,
        description: formData.get("description")?.toString(),
        github_link: formData.get("github_link")?.toString(),
        website_url: formData.get("website_url")?.toString(),
        figma_link: formData.get("figma_link")?.toString(),
        team_leader_id: formData.get("team_leader_id")?.toString(),
        client_id: formData.get("client_id")?.toString(),
        main_image,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (updateError) throw updateError;

    revalidatePath("/projects");
    return { success: true, data: project };
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

    // Delete project
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

// Fetch a single team lead by ID
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

// Fetch multiple members by their IDs
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
      .select("*")
      .in("id", memberIds);

    if (error) {
      console.error("Error fetching members:", error);
      return { error, data: null };
    }

    return { error: null, data: data as Codev[] };
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
    const memberIds = members.map((member) => member.id);

    const { error } = await supabase
      .from("projects")
      .update({ members: memberIds })
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project members:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating project members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getProjectCodevs = async (filters = {}): Promise<Codev[]> => {
  const supabase = createClientComponentClient();

  let query = supabase.from("codev").select(
    `
      id,
      first_name,
      last_name,
      email_address,
      phone_number,
      address,
      about,
      positions,
      display_position,
      portfolio_website,
      tech_stacks,
      image_url,
      availability_status,
      nda_status,
      level,
      application_status,
      rejected_count,
      facebook,
      linkedin,
      github,
      discord,
      years_of_experience,
      internal_status,
      role_id,
      created_at,
      updated_at,
      education (
        id,
        codev_id,
        institution,
        degree,
        start_date,
        end_date,
        description
      ),
      work_experience (
        id,
        codev_id,
        position,
        description,
        date_from,
        date_to,
        company_name,
        location,
        is_present
      ),
      work_schedules (
        id,
        codev_id,
        days_of_week,
        start_time,
        end_time
      ),
      projects (
        id,
        name,
        description,
        status,
        start_date,
        end_date
      )
    `,
  );

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

  return data || [];
};

export const getProjectClients = async (): Promise<Client[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error("Error fetching Clients:", error);
    throw new Error("Failed to fetch Clients");
  }

  return data || [];
};
