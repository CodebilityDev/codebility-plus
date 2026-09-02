import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientAnon } from "@/utils/supabase/anon";

const PROJECT_SELECT = "id, name, description, main_image, status";
const FALLBACK_IMAGE = "/assets/images/index/projects-large.jpg";

export type CodevsFeaturedProjects = {
  slides: string[];
  projectCount: number;
};

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  main_image: string | null;
  status: string | null;
};

function resolveProjectImageUrl(mainImage: string | null | undefined): string {
  if (!mainImage?.trim()) {
    return FALLBACK_IMAGE;
  }

  let imageUrl = mainImage.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (imageUrl.startsWith("public/")) {
    imageUrl = `${supabaseUrl}/storage/v1/object/public/services-image/${imageUrl}`;
  } else if (imageUrl.startsWith("public")) {
    imageUrl = `${supabaseUrl}/storage/v1/object/public/services-image/${imageUrl}`;
  } else if (!imageUrl.startsWith("http")) {
    imageUrl = `${supabaseUrl}/storage/v1/object/public/services-image/${imageUrl}`;
  }

  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export async function getCodevsFeaturedProjects(
  supabase: SupabaseClient,
): Promise<CodevsFeaturedProjects | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase query error (codevs-featured-projects):", error);
    return null;
  }

  const rows = (data ?? []) as ProjectRow[];
  const slides = rows.map((project) =>
    resolveProjectImageUrl(project.main_image),
  );

  return {
    slides,
    projectCount: rows.length,
  };
}

export const getCachedCodevsFeaturedProjects = unstable_cache(
  async () => getCodevsFeaturedProjects(createClientAnon()),
  ["codevs-featured-projects"],
  { revalidate: 3600, tags: ["codevs-featured-projects"] },
);
