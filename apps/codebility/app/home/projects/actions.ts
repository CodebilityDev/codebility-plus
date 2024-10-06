"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { User } from "./_types/projects";

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

// export async function DeleteProjectMembers(e: FormData, newMembers: User[]) {
//   const supabase = getSupabaseServerComponentClient();

//   const user_id_search = e.get("userId")?.toString();

//   if (!user_id_search) return;

//   // Step 1: Fetch the existing project data (including members)
//   const { data: projectData, error } = await supabase
//     .from("projects")
//     .select("members")
//     .eq("id", user_id_search)
//     .single();

//   if (error) {
//     console.error("Error fetching project:", error.message);
//     return;
//   }

//   // Step 2: Parse the existing members (if they are stored as a JSON string)
//   let existingMembers: User[] = [];
//   if (projectData?.members) {
//     existingMembers = projectData.members.map((member: string) =>
//       JSON.parse(member),
//     );
//   }

//   // Step 3: Determine the IDs of members to remove
//   const idsToRemove = newMembers.map((member) => member.id);

//   // Filter out members whose IDs are in the `idsToRemove` array
//   const updatedMembers = existingMembers.filter(
//     (member) => !idsToRemove.includes(member.id),
//   );

//   // Step 4: Stringify the updated members array before updating the project
//   const updatedMembersStringified = updatedMembers.map((member) =>
//     JSON.stringify(member),
//   );

//   // Step 5: Update the project with the filtered members
//   const { error: updateError } = await supabase
//     .from("projects")
//     .update({ members: updatedMembersStringified })
//     .eq("id", user_id_search);

//   if (updateError) {
//     console.error("Error updating project:", updateError.message);
//     return;
//   }

//   console.log("Members successfully updated in the project!");
//   // Optional: Revalidate path or perform other actions
//   revalidatePath("/home/projects");
// }

// export async function InsertTeamLeader(e: FormData, newMembers: User[]) {
//   const supabase = getSupabaseServerComponentClient();

//   const user_id_search = e.get("userId")?.toString();

//   if (!user_id_search) return;

//   // Step 1: Fetch the existing project data (including members)
//   const { data: projectData, error } = await supabase
//     .from("projects")
//     .select("members")
//     .eq("id", user_id_search)
//     .single();

//   if (error) {
//     console.error("Error fetching project:", error.message);
//     return;
//   }

//   // Step 2: Parse the existing members (if they are stored as a JSON string)
//   let existingMembers: User[] = [];
//   if (projectData?.members) {
//     existingMembers = projectData.members.map((member: string) =>
//       JSON.parse(member),
//     );
//   }

//   // Step 3: Filter out new members that are already in the existing members
//   const updatedMembers = [
//     ...existingMembers,
//     ...newMembers
//       .filter(
//         (newMember) =>
//           !existingMembers.some(
//             (existingMember) => existingMember.id === newMember.id,
//           ),
//       )
//       .map((member) => ({
//         id: member.id,
//         first_name: member.first_name,
//         last_name: member.last_name,
//         image_url: member.image_url,
//         position: member.main_position,
//       })),
//   ];

//   // Step 4: Stringify the updated members array before updating the project
//   const updatedMembersStringified = updatedMembers.map((member) =>
//     JSON.stringify(member),
//   );

//   // Step 5: Update the project with the new members
//   const { error: updateError } = await supabase
//     .from("projects")
//     .update({ members: updatedMembersStringified })
//     .eq("id", user_id_search);

//   if (updateError) {
//     console.error("Error updating project:", updateError.message);
//     return;
//   }

//   console.log("Members successfully added to the project!");
//   revalidatePath("/home/projects");
// }

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

export const createProject = async (formData: FormData, members: User[]) => {
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
    image_url: member.image_url,
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
    status: "Pending",
    team_leader_id,
    client_id: clientId,
    members: membersData,
  };

  console.log("new project action: ", newProject);

  const { data, error } = await supabase
    .from("projects")
    .insert(newProject)
    .single();

  if (error) {
    console.error("Error creating projects:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/clients");
  return { success: true, data };
};

export const updateProject = async (
  id: string,
  formData: FormData,
  members: User[],
) => {
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
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectsError) {
    console.error("Error fetching projects data:", projectsError.message);
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
    members: members || projectsData.members, // note wala pang add members
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
    await supabase.from("projects").update(updateProject).eq("id", id).single();

  if (updateProjectsError) {
    console.error("Error updating project:", updateProjectsError.message);
    return { success: false, error: updateProjectsError.message };
  }

  revalidatePath("/home/projects");
  return { success: true, data: updateProjectsData };
};

export const deleteProject = async (projectId: string) => {
  const supabase = getSupabaseServerComponentClient();

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
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
    .from("projects")
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
