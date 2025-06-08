"use server"

import { createClientServerComponent } from "@/utils/supabase/server";

export const getPosts = async () => {
  try {
    const supabase = await createClientServerComponent();

    console.log("TEST 1");
  
    const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      author_id(
        first_name,
        last_name,
        image_url
      )
      `).order('created_at', { ascending: false });

    if (error) throw error;

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export type PostType = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  author_id?: {
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  image_url?: string;
  upvoters_id?: string[];
};
