"use server";
import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";
import { deleteImage, getImagePath } from "@/utils/uploadImage";
import { createPostSchema, editPostSchema } from "@/utils/validations/feeds";
import { ZodError } from "zod";
import type { UserMention } from "@/types/feeds";
import { createNotificationAction } from "@/actions/notifications/notification.actions";
import { requireUser } from "@/lib/server/auth-guard";


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
    return null;
  }

  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("name")
    .eq("id", userRole.id)
    .single();

  if (roleError || !role) {
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

export const addPost = async (payload: AddPostParams) => {
  try {
    // Identity comes from the session, never from the caller. `author_id` in the
    // payload is deliberately ignored: accepting it let any caller attribute a
    // post to another user.
    const { user } = await requireUser();

    const parsed = createPostSchema.parse(payload);

    const {
      title,
      content,
      image_url,
      content_image_ids,
      tag_ids,
    } = parsed;

    const supabase = await createClientServerComponent();

    // 1. Insert the post
    const { data: newPosts, error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
          author_id: user.id,
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

      if (updateError) throw updateError;
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

      if (tagError) throw tagError;
    }

    revalidatePath("/home/feeds");
    return newPost;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.errors[0]?.message ?? "Invalid post data");
    }
    throw error;
  }
};

/**
 * Authorizes a write against a post the caller must own (admins may moderate).
 *
 * Feeds are not project-scoped, so `requireProjectMember` does not apply here.
 * Ownership is the right check: a member may only touch their own posts.
 */
async function requirePostOwner(
  supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
  postId: string,
) {
  const { user, roleId } = await requireUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (error || !post) {
    throw new Error("Post not found");
  }

  // role_id 1 is admin, matching the bypass used across auth-guard.
  if (post.author_id !== user.id && roleId !== 1) {
    throw new Error("Forbidden");
  }

  return { user, roleId, post };
}

export const deletePost = async (post_id: string) => {
  try {
    const supabase = await createClientServerComponent();

    await requirePostOwner(supabase, post_id);

    await deletePostContentImages(post_id);

    const { data: postData, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", post_id)
      .single();

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

    revalidatePath("/home/feeds");
    return data;
  } catch (error) {
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

export const editPost = async (payload: EditPostParams) => {
  try {
    const parsed = editPostSchema.parse(payload);

    const {
      id,
      title,
      content,
      image_url,
      content_image_ids,
      tag_ids,
    } = parsed;

    const supabase = await createClientServerComponent();

    // Ownership first, and `author_id` from the payload is ignored so an edit
    // cannot reassign authorship to another user.
    await requirePostOwner(supabase, id);

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

      if (updateError) throw updateError;
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
      const { data: existingTags, error: fetchTagsError } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", id);

      if (fetchTagsError) throw fetchTagsError;

      const existingTagIds = existingTags?.map((t) => t.tag_id) ?? [];

      const tagsToAdd = tag_ids.filter((t) => !existingTagIds.includes(t));
      if (tagsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from("post_tags")
          .insert(tagsToAdd.map((tag_id) => ({ post_id: id, tag_id })));

        if (addError) throw addError;
      }

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

    revalidatePath("/home/feeds");
    return updatedPost;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.errors[0]?.message ?? "Invalid post data");
    }
    throw error;
  }
};

export const AddPostUpvote = async (postId: string) => {
  try {
    // Upvoter identity from the session; the parameter it used to take let any
    // caller cast or clear votes on another user's behalf.
    const { user } = await requireUser();
    const supabase = await createClientServerComponent();

    const { data: postUpvote, error: fetchError } = await supabase
      .from("post_upvotes")
      .select("id")
      .eq("post_id", postId)
      .eq("upvoter_id", user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (postUpvote) {
      return { message: "User has already upvoted this post." };
    }

    const { data: newUpvote, error: insertError } = await supabase
      .from("post_upvotes")
      .insert([{ post_id: postId, upvoter_id: user.id }])
      .select()
      .single();

    if (insertError) throw insertError;

    revalidatePath("/home/feeds");
    return newUpvote;
  } catch (error) {
    throw error;
  }
};

export const removePostUpvote = async (postId: string) => {
  try {
    const { user } = await requireUser();
    const supabase = await createClientServerComponent();

    const { error } = await supabase
      .from("post_upvotes")
      .delete()
      .eq("post_id", postId)
      .eq("upvoter_id", user.id);

    if (error) throw error;

    revalidatePath("/home/feeds");
  } catch (error) {
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

    return count ?? 0;
  } catch (error) {
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

export async function uploadPostContentImage(file: File) {
  const supabase = await createClientServerComponent();

  try {
    const { bucket, folder } = defaultOptions;

    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket!)
      .upload(filePath, file, {
        cacheControl: defaultOptions.cacheControl || "3600",
        upsert: defaultOptions.upsert ?? true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket!)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    const imageUrl = publicUrlData.publicUrl.toString();

    const { data: insertedRows, error: insertError } = await supabase
      .from("post_content_images")
      .insert({ image_url: imageUrl })
      .select("id, image_url")
      .single();

    if (insertError) throw insertError;

    return {
      id: insertedRows.id,
      image_url: insertedRows.image_url,
    };
  } catch (error) {
    throw error;
  }
}

export async function deletePostContentImages(
  post_id: string,
  bucket: string = "codebility",
) {
  const supabase = await createClientServerComponent();

  try {
    const { data: images, error: fetchError } = await supabase
      .from("post_content_images")
      .select("image_url")
      .eq("post_id", post_id);

    if (fetchError) throw fetchError;
    if (!images || images.length === 0) return false;

    const filePaths = (
      await Promise.all(images.map((img) => getImagePath(img.image_url)))
    ).filter((p): p is string => !!p);

    if (filePaths.length === 0) return false;

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    throw error;
  }
}

export const getSocialPoints = async (userId: string): Promise<number | null> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase.rpc(
      "calculate_social_points",
      { codev_id: userId },
    );

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export async function deletePostComment(comment_id: string) {
  const { user, roleId } = await requireUser();
  const supabase = await createClientServerComponent();

  try {
    // Ownership check: comments are not project-scoped, so only the author
    // (or an admin) may delete. Previously any caller could delete any comment.
    const { data: comment, error: fetchError } = await supabase
      .from("post_comments")
      .select("commenter_id")
      .eq("id", comment_id)
      .single();

    if (fetchError || !comment) {
      throw new Error("Comment not found");
    }

    if (comment.commenter_id !== user.id && roleId !== 1) {
      throw new Error("Forbidden");
    }

    const { error } = await supabase
      .from("post_comments")
      .delete()
      .eq("id", comment_id);

    if (error) throw error;

    revalidatePath("/home/feeds");
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export const hasReachedDailyPostLimit = async (limit = 2) => {
  try {
    // Own posts only; the parameter it used to take let a caller probe or
    // sidestep another user's daily limit.
    const { user } = await requireUser();
    const supabase = await createClientServerComponent();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id)
      .gte("created_at", twentyFourHoursAgo);

    if (error) throw error;

    return (count ?? 0) >= limit;
  } catch (error) {
    throw error;
  }
};

export const hasNotPostedYet = async () => {
  try {
    const { user } = await requireUser();
    const supabase = await createClientServerComponent();

    const { count, error } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", user.id);

    if (error) throw error;

    return (count ?? 0) === 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Search for users by username, first name, or last name
 */
export async function searchUsers(query: string): Promise<UserMention[]> {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("codev")
      .select("id, username, first_name, last_name, image_url, headline")
      .or(
        `username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`
      )
      .not("username", "is", null)
      .limit(10);

    if (error) throw error;

    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Create comment with mention support using existing notification system
 */
export async function createComment(
  post_id: string,
  content: string,
  mentions: string[] = []
) {
  // Commenter identity from the session, not the caller.
  const { user } = await requireUser();
  const commenter_id = user.id;

  const supabase = await createClientServerComponent();

  try {
    // 1. Create the comment
    const { data: comment, error: commentError } = await supabase
      .from("post_comments")
      .insert([{ post_id, commenter_id, content }])
      .select()
      .single();

    if (commentError) throw commentError;

    // 2. Process mentions
    if (mentions.length > 0) {
      const { data: mentionedUsers, error: userError } = await supabase
        .from("codev")
        .select("id, username, first_name, last_name")
        .in("username", mentions);

      if (!userError && mentionedUsers && mentionedUsers.length > 0) {
        // 3. Insert comment mentions
        const mentionRecords = mentionedUsers.map((user) => ({
          comment_id: comment.id,
          mentioned_user_id: user.id,
        }));

        await supabase.from("comment_mentions").insert(mentionRecords);

        // 4. Notify only other users — skip self-mentions
        const usersToNotify = mentionedUsers.filter(
          (user) => user.id !== commenter_id
        );

        for (const user of usersToNotify) {
          try {
            await createNotificationAction({
              recipientId: user.id,
              senderId: commenter_id,
              title: "Feeds: New Mention",
              message: `${user.first_name}, you were mentioned in a comment`,
              type: "user",
              priority: "normal",
              actionUrl: `/home/feeds?post=${post_id}#comment-${comment.id}`,
              metadata: {
                mention_type: "comment",
                post_id: post_id,
                comment_id: comment.id,
                commenter_id: commenter_id,
                comment_preview: content.substring(0, 50),
              },
              projectId: undefined,
              jobId: undefined,
            });
          } catch {
            // Notification failure should not block comment creation
          }
        }
      }
    }

    revalidatePath("/home/feeds");
    return comment;
  } catch (error) {
    throw error;
  }
}

/**
 * Get post comments with mention data
 */
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
        ),
        comment_mentions (
          mentioned_user:mentioned_user_id (
            id,
            username,
            first_name,
            last_name,
            image_url,
            headline
          )
        )
      `)
      .eq("post_id", post_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const commentsWithMentions = data?.map((comment) => ({
      ...comment,
      mentions: comment.comment_mentions?.map((m) => m.mentioned_user) || [],
    }));

    return commentsWithMentions;
  } catch (error) {
    throw error;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClientServerComponent();

  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("read", false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    throw error;
  }
}