"use server";
import { createClientServerComponent } from "@/utils/supabase/server";


export const getUserRole = async (userId: Number | null): Promise<string | null> => {
  if (!userId) {
    return null;
  }

  const supabase = await createClientServerComponent();

  const { data: userRole, error } = await supabase
    .from("roles")
    .select("id")
    .eq("id", userId)
    .single();

  if (error || !userRole) {
    console.error("Failed to fetch user role ID:", error);
    return null;
  }
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("name")
    .eq("id", userRole.id)
    .single();

  if (roleError || !role) {
    console.error("Failed to fetch role name:", roleError);
    return null;
  }

  return role.name;
};

export const addPost = async ( title, content, author_id?, image_url?) => {
  try {
    const supabase = await createClientServerComponent();

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
          ...(author_id !== undefined && { author_id }),
          ...(image_url !== undefined && { image_url }),
        }
      ])
      .select();
    if (error) throw error;

    return newPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePost = async (post_id: number) => {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};