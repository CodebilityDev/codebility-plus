"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import type { PostType } from "@/types/feeds";

export const getPosts = async (): Promise<PostType[]> => {
  try {
    const supabase = await createClientServerComponent();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // The viewer's own upvotes are per-user and absent from the post rows, so
    // they are resolved once here. Each card used to issue its own
    // hasUserUpvoted round trip on mount.
    const upvotedIds = new Set<string>(
      user
        ? ((
            await supabase
              .from("post_upvotes")
              .select("post_id")
              .eq("upvoter_id", user.id)
          ).data?.map((row) => row.post_id) ?? [])
        : [],
    );

    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        id,
        created_at,
        title,
        content,
        image_url,
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

    // The explicit column list above mirrors PostType; an untyped builder
    // cannot infer it, so widen here rather than at each caller.
    const rows = posts as unknown as (PostType & {
      post_upvotes?: { id: string }[];
      post_comments?: { id: string }[];
      post_tags?: { tag_id: string; post_tags_lookup?: { name: string | null } }[];
    })[];

    return rows.map((post) => ({
      ...post,
      upvote_count: post.post_upvotes?.length ?? 0,
      comment_count: post.post_comments?.length ?? 0,
      has_upvoted: upvotedIds.has(post.id),
      tags:
        post.post_tags?.map((t) => ({
          tag_id: t.tag_id,
          name: t.post_tags_lookup?.name ?? null,
        })) ?? [],
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
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
