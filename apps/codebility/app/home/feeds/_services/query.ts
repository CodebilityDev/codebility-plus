"use server";

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
        post_comments (id),
        post_tags (
          tag_id,
          post_tags_lookup (
            name
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // compute counts + flatten tag structure
    const postsWithCounts = posts.map((post) => ({
      ...post,
      upvote_count: post.post_upvotes?.length ?? 0,
      comment_count: post.post_comments?.length ?? 0,
      tags: post.post_tags?.map((t) => ({
        tag_id: t.tag_id,
        name: t.post_tags_lookup?.name ?? null,
      })) ?? [],
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
  image_url?: string;

  author_id?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  };

  upvote_count?: number;
  comment_count?: number;

  tags: {
    tag_id: string;
    name: string | null;
  }[];
};

export const getPostTagsLookup = async () => {
  try {
    const supabase = await createClientServerComponent();

    const { data: tags, error } = await supabase
      .from("post_tags_lookup")
      .select(`id, name`)
      .order("name", { ascending: true });

    if (error) throw error;

    return tags;
  } catch (error) {
    console.error(error);
    throw error;
  }
};