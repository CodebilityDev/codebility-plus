import { cacheLife, cacheTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { CodevsFeaturedProjects, ProjectRow } from "@/types/global/lib";


const PROJECT_SELECT = "id, name, description, main_image, status";
const FALLBACK_IMAGE = "/assets/images/index/projects-large.jpg";

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

  const rows = data as ProjectRow[];
  const slides = rows.map((project) =>
    resolveProjectImageUrl(project.main_image),
  );

  return {
    slides,
    projectCount: rows.length,
  };
}

export async function getCachedCodevsFeaturedProjects() {
  "use cache";
  cacheLife("hours");
  cacheTag("codevs-featured-projects");
  return getCodevsFeaturedProjects(createClientAnon());
}
