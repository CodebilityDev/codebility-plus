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

type AddPostParams = {
  title: string;
  content: string;
  author_id?: string | null;
  image_url?: string | null;
  content_image_ids?: string[] | null;
  tag_ids?: number[] | null;
};

export const addPost = async ({
  title,
  content,
  author_id,
  image_url,
  content_image_ids,
  tag_ids,
}: AddPostParams) => {
  try {
    const supabase = await createClientServerComponent();

    // 1. Insert the post
    const { data: newPosts, error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
          ...(author_id !== undefined && { author_id }),
          ...(image_url !== undefined && { image_url }),
        },
      ])
      .select("id, title, content, author_id, image_url")
      .single();

    if (insertError) throw insertError;

    const newPost = newPosts;

    // 2. If content_image_ids exist, update their post_id
    if (content_image_ids && content_image_ids.length > 0) {
      const { error: updateError } = await supabase
        .from("post_content_images")
        .update({ post_id: newPost.id })
        .in("id", content_image_ids);

      if (updateError) {
        console.error("Failed to update post_content_images:", updateError);
        throw updateError;
      }
    }

    // 3. If tag_ids exist, create rows in post_tags
    if (tag_ids && tag_ids.length > 0) {
      const { error: tagError } = await supabase
        .from("post_tags")
        .insert(
          tag_ids.map((tag_id) => ({
            post_id: newPost.id,
            tag_id,
          }))
        );

      if (tagError) {
        console.error("Failed to insert post_tags:", tagError);
        throw tagError;
      }
    }

    return newPost;
  } catch (error) {
    console.error("Error in addPost:", error);
    throw error;
  }
};

export const deletePost = async (post_id: string) => {
  try {
    //delete content images
    await deletePostContentImages (post_id);

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

type EditPostParams = {
  id: string;
  title?: string;
  content?: string;
  author_id?: string | null;
  image_url?: string | null;
  content_image_ids?: string[] | null;
  tag_ids?: number[] | null;
};

export const editPost = async ({
  id,
  title,
  content,
  author_id,
  image_url,
  content_image_ids,
  tag_ids,
}: EditPostParams) => {
  try {
    const supabase = await createClientServerComponent();

    // 1. Fetch existing post for old image cleanup
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Build update payload
    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (author_id !== undefined) updates.author_id = author_id;
    if (image_url !== undefined) updates.image_url = image_url;
    if (image_url === null) updates.image_url = null;

    // 3. Update post
    const { data: updatedPosts, error: editError } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (editError) throw editError;

    const updatedPost = updatedPosts;

    // 4. Update post_content_images (attach uploaded images to this post)
    if (content_image_ids && content_image_ids.length > 0) {
      const { error: updateError } = await supabase
        .from("post_content_images")
        .update({ post_id: id })
        .in("id", content_image_ids);

      if (updateError) {
        console.error("Failed to update post_content_images:", updateError);
        throw updateError;
      }
    }

    // 5. Delete previous image from bucket if replaced
    if (post.image_url && post.image_url !== image_url) {
      const imagePath = await getImagePath(post.image_url);
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }

    // 6. Edit post_tags
    if (tag_ids) {
      // Fetch existing tags for this post
      const { data: existingTags, error: fetchTagsError } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", id);

      if (fetchTagsError) throw fetchTagsError;

      const existingTagIds = existingTags?.map((t) => t.tag_id) ?? [];

      // Tags to add
      const tagsToAdd = tag_ids.filter((t) => !existingTagIds.includes(t));
      if (tagsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from("post_tags")
          .insert(tagsToAdd.map((tag_id) => ({ post_id: id, tag_id })));

        if (addError) throw addError;
      }

      // Tags to remove
      const tagsToRemove = existingTagIds.filter((t) => !tag_ids.includes(t));
      if (tagsToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("post_tags")
          .delete()
          .eq("post_id", id)
          .in("tag_id", tagsToRemove);

        if (removeError) throw removeError;
      }
    }

    return updatedPost;
  } catch (error) {
    console.error("Error editing post:", error);
    throw error;
  }
};

export const AddPostUpvote = async (postId: string, userId: string) => {
  try {
    const supabase = await createClientServerComponent();

    const { data: postUpvote, error: fetchError } = await supabase
      .from("post_upvotes")
      .select("*")
      .eq("post_id", postId)
      .eq("upvoter_id", userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Avoid duplicate upvotes
    if (postUpvote) {
      return { message: "User has already upvoted this post." };
    }

    // Add post upvote
    const { data: newUpvote, error: insertError } = await supabase
    .from("post_upvotes")
    .insert([{ post_id: postId, upvoter_id: userId }])
    .select()
    .single();

    if (insertError) throw insertError;

    return newUpvote;
  } catch (error) {
    console.error("Failed to add upvote:", error);
    throw error;
  }
};

export const removePostUpvote = async (postId: string, userId: string) => {
   try {
    const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("post_upvotes")
    .delete()
    .eq("post_id", postId)
    .eq("upvoter_id", userId);

  if (error) throw error;


  } catch (error) {
    console.error("Failed to remove upvote:", error);
    throw error;
  }
};

export const hasUserUpvoted = async (postId: string, userId: string): Promise<boolean> => {
    try {
    const supabase = await createClientServerComponent();

    const { data: postUpvote, error } = await supabase
      .from("post_upvotes")
      .select("*")
      .eq("post_id", postId)
      .eq("upvoter_id", userId)
      .maybeSingle();

    if (error) throw error;

    if (postUpvote) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const countUpvotes = async (postId: string): Promise<number> => {
    try {
    const supabase = await createClientServerComponent();

    const { count, error } = await supabase
      .from("post_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) throw error;

    if (count) return count
    else return 0;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

interface UploadPostContentImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

const defaultOptions: UploadPostContentImageOptions = {
  bucket: "codebility",
  folder: "postImage/content",
  cacheControl: "3600",
  upsert: true,
};

export async function uploadPostContentImage(
  file: File,
) {
  const supabase = await createClientServerComponent();

  try {
    const { bucket, folder } = defaultOptions;

    // Generate a cleaner file path
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Upload image to storage
    const { error: uploadError } = await supabase.storage
      .from(bucket!)
      .upload(filePath, file, {
        cacheControl: defaultOptions.cacheControl || "3600",
        upsert: defaultOptions.upsert ?? true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket!)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    const imageUrl = publicUrlData.publicUrl.toString();

    // Insert new row and return it
    const { data: insertedRows, error: insertError } = await supabase
      .from("post_content_images")
      .insert({ image_url: imageUrl })
      .select("id, image_url") // select to return inserted data
      .single(); // because we're inserting one row

    if (insertError) {
      console.error("Failed to insert post_content_images row:", insertError);
      throw insertError;
    }

    return {
      id: insertedRows.id,
      image_url: insertedRows.image_url,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}


export async function deletePostContentImages(
  post_id: string,
  bucket: string = "codebility",
) {
  const supabase = await createClientServerComponent();

  try {
    // 1. Get all image URLs for this post
    const { data: images, error: fetchError } = await supabase
      .from("post_content_images")
      .select("image_url")
      .eq("post_id", post_id);

    if (fetchError) throw fetchError;
    if (!images || images.length === 0) {
      return false; // no images to delete
    }

    // 2. Extract storage file paths (await async getImagePath)
    const filePaths = (
      await Promise.all(images.map((img) => getImagePath(img.image_url)))
    ).filter((p): p is string => !!p); // remove nulls

    if (filePaths.length === 0) return false;

    // 3. Delete from storage bucket
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    console.error("Image deletion failed:", error);
    throw error;
  }
}

export const getSocialPoints = async (userId: string): Promise<number | null> => {
  const supabase = await createClientServerComponent();

  try {
    // Fetch user's points
    const { data, error } = await supabase.rpc(
      "calculate_social_points",
      { codev_id: userId },
    );

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Failed to fetch social points:", error);
    throw error;
  }
};

export async function createComment(
  post_id: string,
  commenter_id: string,
  content: string,
) {
  const supabase = await createClientServerComponent();

try {
    const { data, error } = await supabase
      .from("post_comments")
      .insert([{ post_id, commenter_id, content }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Comment creation failed:", error);
    throw error;
  }
}

export async function getPostComments(post_id: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select(`
        id,
        content,
        created_at,
        commenter: commenter_id!inner (
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .eq("post_id", post_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Failed to fetch post comments:", error);
    throw error;
  }
}

export async function deletePostComment(comment_id: string) {
  const supabase = await createClientServerComponent();

  try {
    const { error } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", comment_id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Failed to delete post comment:", error);
    throw error;
  }
}
