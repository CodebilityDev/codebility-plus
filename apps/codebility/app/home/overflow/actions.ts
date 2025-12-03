// actions.ts
"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Question 
export interface Question {
    id: string;
    title: string;
    content: string;
    author: {
        id: string;
        name: string;
        image_url: string | null;
    };
    tags: string[];
    images: string[];
    likes: number;
    comments: number;
    created_at: string;
    updated_at: string;
}

export async function fetchQuestions(): Promise<Question[]> {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
        .from('overflow_post')
        .select(`
            *,
            codev (
                id,
                first_name,
                last_name,
                image_url
            )
        `);


    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    if (!data || data.length === 0) {
        console.log('No data returned from database');
        return [];
    }

    const transformedQuestions: Question[] = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || '',
        content: item.question_details || '',
        author: {
            id: item.codev.id,
            name: `${item.codev.first_name} ${item.codev.last_name}`.trim(), // Added space
            image_url: item.codev.image_url,
        },
        tags: item.tags ? JSON.parse(item.tags) as string[] : [], // ← Type assertion
        images: item.image_url ? JSON.parse(item.image_url) as string[] : [], // ← Type assertion
        likes: item.likes || 0,
        comments: item.comments || 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
    }));

    return transformedQuestions;
}



// add questions
export interface PostQuestionData {
    title: string;
    content: string;
    tags: string[];
    images: string[]; 
    authorId: string;
}

// Helper function to convert base64 to File
function base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/png';
    const base64Data = arr.length > 1 ? arr[1] : arr[0];

    if (!base64Data) {
        throw new Error('Invalid base64 string');
    }

    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
// Helper function to upload image to Supabase Storage
async function uploadImageToStorage(supabase: any, base64Image: string, authorId: string): Promise<string | null> {
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const filename = `${authorId}_${timestamp}_${randomString}.png`;

        // Convert base64 to File
        const file = base64ToFile(base64Image, filename);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('codebility')
            .upload(`overflowPostImage/${filename}`, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        // Return the public URL
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/codebility/overflowPostImage/${filename}`;
    } catch (error) {
        console.error('Error in uploadImageToStorage:', error);
        return null;
    }
}

export async function postQuestion(data: PostQuestionData) {
    try {
        const supabase = await createClientServerComponent();

        // Upload all images and get their URLs
        const imageUploadPromises = data.images.map(base64Image =>
            uploadImageToStorage(supabase, base64Image, data.authorId)
        );

        const uploadedImageUrls = await Promise.all(imageUploadPromises);

        // Filter out any failed uploads (nulls)
        const validImageUrls = uploadedImageUrls.filter((url): url is string => url !== null);

        // Insert the question into overflow_post table
        const { data: insertedQuestion, error } = await supabase
            .from('overflow_post')
            .insert({
                codev_id: data.authorId,
                title: data.title,
                question_details: data.content,
                tags: JSON.stringify(data.tags),
                image_url: JSON.stringify(validImageUrls), // Store uploaded URLs
                likes: 0,
                comments: 0,
                fields: null,
            })
            .select(`
                id,
                codev_id,
                title,
                question_details,
                tags,
                image_url,
                likes,
                comments,
                created_at,
                updated_at,
                codev:codev_id (
                    id,
                    first_name,
                    last_name,
                    image_url
                )
            `)
            .single();

        if (error) {
            console.error('Error inserting question:', error);
            throw new Error('Failed to post question');
        }
          const authorData = insertedQuestion.codev?.[0];
        console.log('Inserted Question Result:', JSON.stringify(insertedQuestion, null, 2));

        // Transform the database response to match Question interface
        const question: Question = {
            id: insertedQuestion.id.toString(),
            title: insertedQuestion.title,
            content: insertedQuestion.question_details,
            author: {
              id: authorData?.id,
              name: `${authorData?.first_name ?? ''} ${authorData?.last_name ?? ''}`.trim(),
              image_url: authorData?.image_url ?? null,
            },
            tags: JSON.parse(insertedQuestion.tags || '[]') as string[],
            images: JSON.parse(insertedQuestion.image_url || '[]') as string[],
            likes: insertedQuestion.likes,
            comments: insertedQuestion.comments,
            created_at: insertedQuestion.created_at,
            updated_at: insertedQuestion.updated_at,
        };

        revalidatePath('/home/overflow');
        return { success: true, question };

    } catch (error) {
        console.error('Error in postQuestion:', error);
        return { success: false, error: 'Failed to post question' };
    }
}


// Add this interface and function to your actions.ts file

export interface UpdateQuestionData {
  question_id: string;
  title: string;
  content: string;
  tags: string[];
  images: string[]; // Mix of existing URLs and new base64 images
  authorId: string;
}

// Helper function to determine if a string is a base64 image or URL
function isBase64Image(str: string): boolean {
  return str.startsWith('data:image/');
}

// Update question function
export async function updateQuestion(data: UpdateQuestionData) {
  try {
    const supabase = await createClientServerComponent();

    // Fetch the current images from the database
    const { data: existingPost, error: fetchError } = await supabase
      .from('overflow_post')
      .select('image_url')
      .eq('id', data.question_id)
      .single();

    if (fetchError) {
      console.error('Error fetching existing post:', fetchError);
      return { success: false, error: 'Failed to fetch existing post' };
    }

    const previousImageUrls: string[] = existingPost.image_url
    ? (JSON.parse(existingPost.image_url) as string[])
    : [];


    const existingUrls: string[] = [];
    const newBase64Images: string[] = [];

    data.images.forEach((img) => {
      if (img.startsWith('data:image/')) {
        newBase64Images.push(img);
      } else {
        existingUrls.push(img);
      }
    });

    // Upload new images
    const newImageUploadPromises = newBase64Images.map(async (base64Image) => {
      try {
        const arr = base64Image.split(',');
        const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/png';
        const base64Data = arr.length > 1 ? arr[1] : arr[0];
        if (!base64Data) throw new Error('Invalid base64 image data');

        const bstr = atob(base64Data);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const file = new File([u8arr], `${data.authorId}_${Date.now()}.png`, {
          type: mime,
        });

        const path = `overflowPostImage/${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('codebility')
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          return null;
        }

        return `https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/${path}`;
      } catch (err) {
        console.error('Error uploading base64 image:', err);
        return null;
      }
    });

    const uploadedNewImageUrls = await Promise.all(newImageUploadPromises);
    const validNewImageUrls = uploadedNewImageUrls.filter((url): url is string => url !== null);

    const allImageUrls = [...existingUrls, ...validNewImageUrls];

    // Determine which images to delete
    const imagesToDelete = previousImageUrls.filter(
      (url) => !allImageUrls.includes(url)
    );

    for (const url of imagesToDelete) {
      try {
        const publicPath = url.split('/storage/v1/object/public/codebility/')[1];
        if (publicPath) {
          const { error: deleteError } = await supabase.storage
            .from('codebility')
            .remove([publicPath]);
          if (deleteError) {
            console.warn(`Failed to delete image: ${publicPath}`, deleteError);
          }
        }
      } catch (err) {
        console.warn(`Error deleting image: ${url}`, err);
      }
    }

    // Update the post
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('overflow_post')
      .update({
        title: data.title,
        question_details: data.content,
        tags: JSON.stringify(data.tags),
        image_url: JSON.stringify(allImageUrls),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(data.question_id))
      .select(`
        id,
        codev_id,
        title,
        question_details,
        tags,
        image_url,
        likes,
        comments,
        created_at,
        updated_at,
        codev:codev_id (
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating question:', updateError);
      return { success: false, error: `Database error: ${updateError.message}` };
    }

    const authorData = Array.isArray(updatedQuestion.codev)
      ? updatedQuestion.codev[0]
      : updatedQuestion.codev;

    const question: Question = {
      id: updatedQuestion.id.toString(),
      title: updatedQuestion.title,
      content: updatedQuestion.question_details,
      author: {
        id: authorData?.id || data.authorId,
        name: authorData
          ? `${authorData.first_name} ${authorData.last_name}`.trim()
          : 'Unknown User',
        image_url: authorData?.image_url || null,
      },
      tags: JSON.parse(updatedQuestion.tags || '[]') as string[],
      images: JSON.parse(updatedQuestion.image_url || '[]') as string[],
      likes: updatedQuestion.likes || 0,
      comments: updatedQuestion.comments || 0,
      created_at: updatedQuestion.created_at,
      updated_at: updatedQuestion.updated_at,
    };

    revalidatePath('/home/overflow');
    return { success: true, question };
  } catch (error) {
    console.error('Error in updateQuestion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update question',
    };
  }
}


// delete the post


export async function deletePostAndImages(postId: number) {
  const supabase = await createClientServerComponent();

  try {
    // 1. Fetch post by id to get image URLs
    const { data: post, error: fetchError } = await supabase
      .from("overflow_post")
      .select("image_url")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("Error fetching post:", fetchError);
      return { success: false, error: "Failed to fetch post" };
    }

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // 2. Parse image_url field (which is JSON array of strings)
    let imageUrls: string[] = [];
    if (post.image_url) {
      try {
        imageUrls = JSON.parse(post.image_url) as string[];
      } catch {
        console.warn("Invalid JSON in image_url, skipping image deletion");
      }
    }

    // 3. Delete images from storage
    for (const url of imageUrls) {
      try {
        // Extract storage path from public URL
        // Example URL: https://<project-ref>.supabase.co/storage/v1/object/public/codebility/overflowPostImage/filename.png
        // We need path: "overflowPostImage/filename.png"
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");

        // Expected format: /storage/v1/object/public/<bucket>/<path>
        // index of bucket = 5, so path from 6 to end = file path
        // e.g. pathParts[6..end]
        const bucket = pathParts[5];
        const filePath = pathParts.slice(6).join("/");

        if (!bucket || !filePath) {
          console.warn("Cannot parse storage path from URL:", url);
          continue;
        }

        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([filePath]);

        if (deleteError) {
          console.warn("Failed to delete file from storage:", filePath, deleteError);
        }
      } catch (e) {
        console.warn("Error deleting image URL:", url, e);
      }
    }

    // 4. Delete post from DB
    const { error: deletePostError } = await supabase
      .from("overflow_post")
      .delete()
      .eq("id", postId);

    if (deletePostError) {
      console.error("Failed to delete post:", deletePostError);
      return { success: false, error: "Failed to delete post" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deletePostAndImages:", error);
    return { success: false, error: "Internal error" };
  }
}



//Comments

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image_url: string | null;
  };
  likes: number;
  created_at: string;
  updated_at: string;
  post_id: string;
}

export interface PostCommentData {
  post_id: string;
  codev_id: string;
  comment: string;
}

// Fetch comments for a specific post
export async function fetchComments(postId: string): Promise<Comment[]> {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from('overflow_comments')
    .select(`
      id,
      comment,
      likes,
      created_at,
      updated_at,
      post_id,
      codev (
        id,
        first_name,
        last_name,
        image_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const transformedComments: Comment[] = data.map((item: any) => ({
    id: item.id.toString(),
    content: item.comment,
    author: {
      id: item.codev.id,
      name: `${item.codev.first_name} ${item.codev.last_name}`.trim(),
      image_url: item.codev.image_url,
    },
    likes: item.likes || 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
    post_id: item.post_id.toString(),
  }));

  return transformedComments;
}

// Post a new comment
export async function postComment(data: PostCommentData) {
  try {
    const supabase = await createClientServerComponent();

    console.log('Posting comment with data:', data);

    // Convert post_id to number for insertion
    const postIdNumber = parseInt(data.post_id);

    const { data: insertedComment, error } = await supabase
      .from('overflow_comments')
      .insert({
        codev_id: data.codev_id,
        post_id: postIdNumber,
        comment: data.comment,
      })
      .select(`
        id,
        comment,
        likes,
        created_at,
        updated_at,
        post_id,
        codev:codev_id (
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return { success: false, error: `Database error: ${error.message}` };
    }

    console.log('Inserted comment data:', insertedComment);

    // Handle codev data (could be array or object)
    const codevData = Array.isArray(insertedComment.codev) 
      ? insertedComment.codev[0] 
      : insertedComment.codev;

    const { data: postData, error: fetchError } = await supabase
    .from('overflow_post')
    .select('comments')
    .eq('id', postIdNumber)
    .single();

    if (fetchError) {
    console.error('Error fetching post:', fetchError);
    return;
    }

    const currentCount = postData?.comments ?? 0;

    // Update comment count in overflow_post
    const { error: updateError } = await supabase
        .from('overflow_post')
        .update({ comments: currentCount + 1 })
        .eq('id', postIdNumber);



    if (updateError) {
      console.error('Error updating comment count:', updateError);
      // Don't fail the whole operation if count update fails
    }

    const comment: Comment = {
      id: insertedComment.id.toString(),
      content: insertedComment.comment,
      author: {
        id: codevData?.id || data.codev_id,
        name: codevData 
          ? `${codevData.first_name} ${codevData.last_name}`.trim()
          : 'Unknown User',
        image_url: codevData?.image_url || null,
      },
      likes: insertedComment.likes || 0,
      created_at: insertedComment.created_at,
      updated_at: insertedComment.updated_at,
      post_id: insertedComment.post_id.toString(),
    };

    revalidatePath('/home/overflow');
    return { success: true, comment };
  } catch (error) {
    console.error('Error in postComment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to post comment' 
    };
  }
}

// // Toggle like on a comment
// export async function toggleCommentLike(commentId: string, increment: boolean) {
//   try {
//     const supabase = await createClientServerComponent();

//     const { data: currentComment, error: fetchError } = await supabase
//       .from('overflow_post_comment')
//       .select('likes')
//       .eq('id', commentId)
//       .single();

//     if (fetchError) {
//       console.error('Error fetching comment:', fetchError);
//       throw new Error('Failed to fetch comment');
//     }

//     const newLikes = increment 
//       ? (currentComment.likes || 0) + 1 
//       : Math.max((currentComment.likes || 0) - 1, 0);

//     const { error: updateError } = await supabase
//       .from('overflow_post_comment')
//       .update({ likes: newLikes })
//       .eq('id', commentId);

//     if (updateError) {
//       console.error('Error updating comment likes:', updateError);
//       throw new Error('Failed to update likes');
//     }

//     revalidatePath('/home/overflow');
//     return { success: true, likes: newLikes };
//   } catch (error) {
//     console.error('Error in toggleCommentLike:', error);
//     return { success: false, error: 'Failed to toggle like' };
//   }
// }




// comments
export interface UpdateCommentData {
  comment_id: string;
  comment: string;
}

// Add this function to your actions.ts file
export async function updateComment(data: UpdateCommentData) {
  try {
    const supabase = await createClientServerComponent();

    console.log('Updating comment with data:', data);

    // Convert comment_id to number for the query
    const commentIdNumber = parseInt(data.comment_id);

    // Update the comment
    const { data: updatedComment, error } = await supabase
      .from('overflow_comments')
      .update({
        comment: data.comment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentIdNumber)
      .select(`
        id,
        comment,
        likes,
        created_at,
        updated_at,
        post_id,
        codev:codev_id (
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return { success: false, error: `Database error: ${error.message}` };
    }

    console.log('Updated comment data:', updatedComment);

    // Handle codev data (could be array or object)
    const codevData = Array.isArray(updatedComment.codev) 
      ? updatedComment.codev[0] 
      : updatedComment.codev;

    const comment: Comment = {
      id: updatedComment.id.toString(),
      content: updatedComment.comment,
      author: {
        id: codevData?.id || '',
        name: codevData 
          ? `${codevData.first_name} ${codevData.last_name}`.trim()
          : 'Unknown User',
        image_url: codevData?.image_url || null,
      },
      likes: updatedComment.likes || 0,
      created_at: updatedComment.created_at,
      updated_at: updatedComment.updated_at,
      post_id: updatedComment.post_id.toString(),
    };

    revalidatePath('/home/overflow');
    return { success: true, comment };
  } catch (error) {
    console.error('Error in updateComment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update comment' 
    };
  }
}



// Delete a comment
export async function deleteComment(commentId: string) {
  try {
    const supabase = await createClientServerComponent();

    console.log('Deleting comment:', commentId);

    const commentIdNumber = parseInt(commentId);

    // First, get the post_id before deleting
    const { data: commentData, error: fetchError } = await supabase
      .from('overflow_comments')
      .select('post_id')
      .eq('id', commentIdNumber)
      .single();

    if (fetchError) {
      console.error('Error fetching comment:', fetchError);
      return { success: false, error: 'Failed to find comment' };
    }

    const postId = commentData.post_id;

    // Delete the comment
    const { error: deleteError } = await supabase
      .from('overflow_comments')
      .delete()
      .eq('id', commentIdNumber);

    if (deleteError) {
      console.error('Error deleting comment:', deleteError);
      return { success: false, error: 'Failed to delete comment' };
    }

    // Update comment count in overflow_post
    const { data: postData, error: postFetchError } = await supabase
      .from('overflow_post')
      .select('comments')
      .eq('id', postId)
      .single();

    if (!postFetchError && postData) {
      const currentCount = postData.comments ?? 0;
      await supabase
        .from('overflow_post')
        .update({ comments: Math.max(currentCount - 1, 0) })
        .eq('id', postId);
    }

    revalidatePath('/home/overflow');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteComment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete comment' 
    };
  }
}


// like for posts and comments 


// Toggle like for a post
export async function togglePostLike(postId: string, userId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Check if user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from("overflow_likes")
      .select("id")
      .eq("codev_id", userId)
      .eq("target_type", "post")
      .eq("target_id", postId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned (not an error in this case)
      throw checkError;
    }

    if (existingLike) {
      // Unlike: Delete the like
      const { error: deleteError } = await supabase
        .from("overflow_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) throw deleteError;

      // Decrement like count in overflow_post
      const { error: updateError } = await supabase.rpc("decrement_post_likes", {
        post_id: parseInt(postId),
      });

      if (updateError) throw updateError;

      return { success: true, action: "unliked", liked: false };
    } else {
      // Like: Insert new like
      const { error: insertError } = await supabase
        .from("overflow_likes")
        .insert({
          codev_id: userId,
          target_type: "post",
          target_id: parseInt(postId),
        });

      if (insertError) throw insertError;

      // Increment like count in overflow_post
      const { error: updateError } = await supabase.rpc("increment_post_likes", {
        post_id: parseInt(postId),
      });

      if (updateError) throw updateError;

      return { success: true, action: "liked", liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// Check if user has liked a post
export async function checkPostLike(postId: string, userId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("overflow_likes")
      .select("id")
      .eq("codev_id", userId)
      .eq("target_type", "post")
      .eq("target_id", postId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return { success: true, liked: !!data };
  } catch (error) {
    console.error("Error checking like:", error);
    return { success: false, liked: false };
  }
}

// Get all posts liked by a user (useful for initializing UI state)
export async function getUserLikedPosts(userId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("overflow_likes")
      .select("target_id")
      .eq("codev_id", userId)
      .eq("target_type", "post");

    if (error) throw error;

    const likedPostIds = data.map((like) => like.target_id.toString());
    return { success: true, likedPostIds };
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return { success: false, likedPostIds: [] };
  }
}
// Fetch comment likes for the logged-in user
export async function fetchCommentLikes(userId: string, questionId: string): Promise<string[]> {
  try {
    const supabase = await createClientServerComponent();

    // First get all comment IDs for this question
    const { data: comments, error: commentsError } = await supabase
      .from("overflow_comments")
      .select("id")
      .eq("post_id", questionId);

    if (commentsError) throw commentsError;
    if (!comments || comments.length === 0) return [];

    const commentIds = comments.map(c => c.id);

    // Fetch likes for these comments by this user
    const { data: likes, error: likesError } = await supabase
      .from("overflow_likes")
      .select("target_id")
      .eq("codev_id", userId)
      .eq("target_type", "comment")
      .in("target_id", commentIds);

    if (likesError) throw likesError;

    return likes ? likes.map(like => like.target_id.toString()) : [];
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return [];
  }
}

// Toggle like for a comment
export async function toggleCommentLike(commentId: string, userId: string) {
  try {
    const supabase = await createClientServerComponent();

    const { data: existingLike, error: checkError } = await supabase
      .from("overflow_likes")
      .select("id")
      .eq("codev_id", userId)
      .eq("target_type", "comment")
      .eq("target_id", parseInt(commentId))
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from("overflow_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase.rpc("decrement_comment_likes", {
        comment_id: parseInt(commentId),
      });

      if (updateError) throw updateError;

      return { success: true, action: "unliked", liked: false };
    } else {
      // Like
      const { error: insertError } = await supabase
        .from("overflow_likes")
        .insert({
          codev_id: userId,
          target_type: "comment",
          target_id: parseInt(commentId),
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase.rpc("increment_comment_likes", {
        comment_id: parseInt(commentId),
      });

      if (updateError) throw updateError;

      return { success: true, action: "liked", liked: true };
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return { success: false, error: "Failed to toggle comment like" };
  }
}


// social points

export const getSocialPoints = async (userId: string): Promise<number | null> => {
  const supabase = await createClientServerComponent();

  try {
    // Fetch user's points
    const { data, error } = await supabase.rpc(
      "calculate_overflow_social_points",
      { user_codev_id: userId },
    );

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Failed to fetch social points:", error);
    throw error;
  }
};