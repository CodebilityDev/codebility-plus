"use server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { deleteImage, getImagePath } from "@/utils/uploadImage";


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

    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", post_id)
      .single();  // single() because we expect only one row

    if (fetchError) throw fetchError;
    if (!postData) throw new Error("Post not found");

    const imageUrl = postData.image_url;

    const imagePath = await getImagePath(imageUrl);

    deleteImage(imagePath!);

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

export const editPost = async (
  id: number,
  title?: string,
  content?: string,
  image_url?: string,
  author_id?: number,
) => {
  try {
    const supabase = await createClientServerComponent();

    const { data: post, error } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", id)
      .single();

    if (error) throw error;

    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (author_id !== undefined) updates.author_id = author_id;
    if (image_url !== undefined) updates.image_url = image_url;

    const { data: updatedPost, error: editError } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select();

    if (editError) throw editError;

    // Delete previous image from bucket
    if (image_url) {
      const imagePath = await getImagePath(post.image_url);

    deleteImage(imagePath!);

    }

    return updatedPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
