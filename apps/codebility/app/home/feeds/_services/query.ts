"use server"

import { createClientServerComponent } from "@/utils/supabase/server";

export const getPosts = async () => {
  try {
    const supabase = await createClientServerComponent();

    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        author_id (
          id,
          first_name,
          last_name,
          image_url
        ),
        post_upvotes (id),
        post_comments (id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // compute upvote & comment counts
    const postsWithCounts = posts.map((post) => ({
      ...post,
      upvote_count: post.post_upvotes ? post.post_upvotes.length : 0,
      comment_count: post.post_comments ? post.post_comments.length : 0,
    }));

    return postsWithCounts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export type PostType = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  image_url?: string;
  upvote_count?: number;
  comment_count?: number;
};
