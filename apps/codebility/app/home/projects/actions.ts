"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { Member, User } from "./_types/projects";

const deleteImageByPublicUrl = async (publicUrlOrFilePath: string) => {
  const supabase = getSupabaseServerComponentClient();
  const filePath = publicUrlOrFilePath?.split("/public/")[2];

  if (filePath) {
    const { error } = await supabase.storage
      .from("projects-image")
      .remove([`public/${filePath}`]);

    if (error) {
      console.error("Error deleting image:", error.message);
    }
  } else {
    console.error("Failed to extract file path from public URL");
  }
};

const uploadProjectImage = async (
  file: File,
  folderName: string,
  bucketName: string,
): Promise<string | null> => {
  try {
    if (!file) {
      console.error("No file provided for upload");
      return null;
    }
    console.log(
      "Uploading file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}.${extension}`;

    const supabase = await getSupabaseServerComponentClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderName}/${filename}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error(`Failed to upload ${file.name}:`, error.message);
      return null;
    }

    const { data: imageData } = supabase.storage
      .from("projects-image")
      .getPublicUrl(`public/${filename}`);

    return imageData?.publicUrl || null;
  } catch (error) {
    console.error("Error in upload image:", error);
    throw error;
  }
};

export const createProject = async (formData: FormData, members: User[] | any[]) => {
  const thumbnail = formData.get("thumbnail") as File | null;
  const project_name = formData.get("project_name") as string;
  const clientId = formData.get("clientId") as string;
  const team_leader_id = formData.get("team_leader_id") as string;
  const github_link = formData.get("github_link") as string;
  const live_link = formData.get("live_link") as string;
  const figma_link = formData.get("figma_link") as string;
  const summary = formData.get("summary") as string;

  const supabase = getSupabaseServerComponentClient();

  const membersData = members.map((member) => ({
    id: member.id,
    first_name: member.first_name,
    last_name: member.last_name,
    image_url: member.user.profile.image_url,
    position: member.main_position,
  }));

  let thumbnailPath = null;
  if (thumbnail) {
    thumbnailPath = await uploadProjectImage(
      thumbnail,
      "public",
      "projects-image",
    );
  }

  const newProject = {
    name: project_name,
    summary: summary || null,
    thumbnail: thumbnailPath,
    github_link: github_link || null,
    live_link: live_link || null,
    figma_link: figma_link || null,
    team_leader_id,
    client_id: clientId,
    members: membersData,
  };

  console.log("new project action: ", newProject);

  const { data, error } = await supabase
    .from("project")
    .insert(newProject)
    .single();

  if (error) {
    console.error("Error creating project:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/clients");
  return { success: true, data };
};

export const updateProject = async (id: string, formData: FormData) => {
  const thumbnail = formData.get("thumbnail") as File | null;
  const project_name = formData.get("project_name") as string;
  const clientId = formData.get("clientId") as string;
  const team_leader_id = formData.get("team_leader_id") as string;
  const github_link = formData.get("github_link") as string;
  const live_link = formData.get("live_link") as string;
  const figma_link = formData.get("figma_link") as string;
  const summary = formData.get("summary") as string;
  const status = formData.get("status") as string;

  const supabase = getSupabaseServerComponentClient();

  const { data: projectsData, error: projectsError } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (projectsError) {
    console.error("Error fetching project data:", projectsError.message);
    return { success: false, error: projectsError.message };
  }

  const updateProject = {
    name: project_name || projectsData.name,
    summary: summary || projectsData.summary,
    thumbnail: projectsData.thumbnail,
    github_link: github_link || projectsData.github_link,
    live_link: live_link || projectsData.live_link,
    figma_link: figma_link || projectsData.figma_link,
    status: status || projectsData.status,
    team_leader_id: team_leader_id || projectsData.team_leader_id,
    client_id: clientId || projectsData.client_id,
    members: projectsData.members,
  };

  if (thumbnail) {
    if (projectsData.thumbnail) {
      await deleteImageByPublicUrl(projectsData.thumbnail);
    }

    updateProject.thumbnail = await uploadProjectImage(
      thumbnail,
      "public",
      "projects-image",
    );
  }

  const { data: updateProjectsData, error: updateProjectsError } =
    await supabase.from("project").update(updateProject).eq("id", id).single();

  if (updateProjectsError) {
    console.error("Error updating project:", updateProjectsError.message);
    return { success: false, error: updateProjectsError.message };
  }

  revalidatePath("/home/projects");
  return { success: true, data: updateProjectsData };
};

export const updateProjectMembers = async (
  projectId: string,
  members: Member[],
) => {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("project")
    .update({ members })
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error updating project members:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/projects");
  return { success: true, data };
};

export const deleteProject = async (projectId: string) => {
  const supabase = getSupabaseServerComponentClient();

  const { data: projectData, error: projectError } = await supabase
    .from("project")
    .select("thumbnail")
    .eq("id", projectId)
    .single();

  if (projectError) {
    console.error("Error fetching project data:", projectError.message);
    return { success: false, error: projectError.message };
  }

  if (projectData.thumbnail) {
    await deleteImageByPublicUrl(projectData.thumbnail);
  }

  const { error } = await supabase
    .from("project")
    .delete()
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error deleting data:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/projects");
  return { success: true };
};
