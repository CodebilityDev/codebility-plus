"use server";

import { revalidatePath } from "next/cache";
import { Client, Codev, Project } from "@/types/home/codev";
import { deleteImage, getImagePath } from "@/utils/uploadImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface DbProjectMember {
  project: {
    id: string;
    name: string;
  };
  role: string;
  joined_at: string;
}

interface ProjectMemberData {
  codev_id: string;
  role: string;
}

export interface SimpleMemberData {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  display_position: string | null;
  image_url: string | null;
  role: string;
  joined_at: string;
}

interface ProjectMemberResponse {
  role: string;
  joined_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    display_position: string | null;
    image_url: string | null;
  };
}

interface DbProjectMemberResponse {
  role: string;
  joined_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    display_position: string | null;
    image_url: string | null;
  };
}

export async function createProject(
  formData: FormData,
  selectedMembers: Codev[],
  teamLeaderId: string,
) {
  const supabase = createClientComponentClient();

  try {
    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: formData.get("name"),
        description: formData.get("description"),
        github_link: formData.get("github_link"),
        website_url: formData.get("website_url"),
        figma_link: formData.get("figma_link"),
        client_id: formData.get("client_id"),
        start_date: formData.get("start_date"),
        project_category_id: formData.get("project_category_id")
          ? parseInt(formData.get("project_category_id") as string)
          : null,
        main_image: formData.get("main_image"),
        status: "pending",
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create project members including team leader
    const memberInserts = [
      // Add team leader
      {
        project_id: project.id,
        codev_id: teamLeaderId,
        role: "team_leader",
        joined_at: new Date().toISOString(),
      },
      // Add other members
      ...selectedMembers
        .filter((member) => member.id !== teamLeaderId)
        .map((member) => ({
          project_id: project.id,
          codev_id: member.id,
          role: "member",
          joined_at: new Date().toISOString(),
        })),
    ];

    const { error: membersError } = await supabase
      .from("project_members")
      .insert(memberInserts);

    if (membersError) throw membersError;

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
    // Parse project members data with type assertion
    const projectMembersData = formData.get("project_members");
    const projectMembers = projectMembersData
      ? (JSON.parse(projectMembersData as string) as ProjectMemberData[])
      : null;

    // Update project details
    const updateData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "project_members") {
        updateData[key] = value;
      }
    }

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select();

    if (projectError) throw projectError;

    // Handle project members and team leader
    if (projectMembers && Array.isArray(projectMembers)) {
      // First, get all current project members to compare
      const { data: existingMembers, error: membersError } = await supabase
        .from("project_members")
        .select("*")
        .eq("project_id", projectId);

      if (membersError) throw membersError;

      // Delete existing members
      const { error: deleteError } = await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) throw deleteError;

      // Insert updated members with proper roles
      const { error: insertError } = await supabase
        .from("project_members")
        .insert(
          projectMembers.map((member: ProjectMemberData) => ({
            project_id: projectId,
            codev_id: member.codev_id,
            role: member.role,
            joined_at: new Date().toISOString(),
          })),
        );

      if (insertError) throw insertError;
    }

    revalidatePath("/projects");
    return { success: true, data: projectData };
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
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData | null;
}> => {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = (await supabase
      .from("project_members")
      .select(
        `
        role,
        joined_at,
        codev:codev_id (
          id,
          first_name,
          last_name,
          email_address,
          display_position,
          image_url
        )
      `,
      )
      .eq("project_id", projectId)
      .eq("role", "team_leader")
      .single()) as { data: DbProjectMemberResponse | null; error: any };

    if (error) {
      console.error("Error fetching team lead:", error);
      return { error, data: null };
    }

    if (!data?.codev) {
      return { error: null, data: null };
    }

    const teamLead: SimpleMemberData = {
      id: data.codev.id,
      first_name: data.codev.first_name,
      last_name: data.codev.last_name,
      email_address: data.codev.email_address,
      display_position: data.codev.display_position,
      image_url: data.codev.image_url,
      role: data.role,
      joined_at: data.joined_at,
    };

    return { error: null, data: teamLead };
  } catch (error) {
    console.error("Unexpected error fetching team lead:", error);
    return { error, data: null };
  }
};

export const getMembers = async (
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData[] | null;
}> => {
  const supabase = createClientComponentClient();

  try {
    const { data, error } = (await supabase
      .from("project_members")
      .select(
        `
        role,
        joined_at,
        codev:codev_id (
          id,
          first_name,
          last_name,
          email_address,
          display_position,
          image_url
        )
      `,
      )
      .eq("project_id", projectId)
      .eq("role", "member")) as {
      data: ProjectMemberResponse[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching members:", error);
      return { error, data: null };
    }

    if (!data) {
      return { error: null, data: null };
    }

    const members = data.map((member) => ({
      id: member.codev.id,
      first_name: member.codev.first_name,
      last_name: member.codev.last_name,
      email_address: member.codev.email_address,
      display_position: member.codev.display_position,
      image_url: member.codev.image_url,
      role: member.role,
      joined_at: member.joined_at,
    }));

    return { error: null, data: members };
  } catch (error) {
    console.error("Unexpected error fetching members:", error);
    return { error, data: null };
  }
};

export const updateProjectMembers = async (
  projectId: string,
  members: Codev[],
  teamLeaderId: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

  try {
    // Delete existing members
    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    // Insert members with proper roles
    const memberInserts = members.map((member) => ({
      project_id: projectId,
      codev_id: member.id,
      role: member.id === teamLeaderId ? "team_leader" : "member",
      joined_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("project_members")
      .insert(memberInserts);

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
    project_members!codev_id (
      project:project_id (
        id,
        name
      ),
      role,
      joined_at
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

  return (
    data?.map((codev: any) => {
      // Transform projects array
      const projects = (codev.project_members || []).map(
        (pm: DbProjectMember) => {
          const project: Project & { role: string; joined_at: string } = {
            id: pm.project.id,
            name: pm.project.name,
            role: pm.role,
            joined_at: pm.joined_at,
          };
          return project;
        },
      );

      // Transform codev data
      return {
        ...codev,
        positions: codev.positions || [],
        tech_stacks: codev.tech_stacks || [],
        projects,
      } as Codev;
    }) || []
  );
};

export const getProjectClients = async (): Promise<Client[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company_logo");

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
