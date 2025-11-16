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
        post_upvotes (id)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // compute upvote count based on the joined array
    const postsWithUpvoteCount = posts.map((post) => ({
      ...post,
      upvote_count: post.post_upvotes ? post.post_upvotes.length : 0,
    }));

    return postsWithUpvoteCount;
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
};
