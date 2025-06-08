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

export const addPost = async () => {
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

    // console.log("Fetched posts:", posts);

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export type addPostType = {
  title: string;
  content: string;
  author_id?: string;
  image_url?: string;
};
