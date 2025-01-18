"use server";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

interface UpdateCodevParams {
  codevId: string;
  userId: string;
}

// Define which fields belong to which tables
const TABLE_MAPPINGS = {
  profile: [
    "first_name",
    "last_name",
    "email",
    "main_position",
    "image_url",
    "portfolio_url",
  ],
  codev: ["internal_status", "nda_status", "type"],
  projects: ["projects"],
} as const;

// Determine which table a field belongs to
function getTargetTable(key: keyof Codev) {
  return Object.entries(TABLE_MAPPINGS).find(([_, fields]) =>
    fields.includes(key),
  )?.[0];
}

// Handle project updates
async function handleProjectUpdate(
  supabase: any,
  codevId: string,
  projects: any[],
) {
  // Remove existing project associations
  await supabase.from("codev_project").delete().eq("codev_id", codevId);

  // Add new project associations
  if (projects && projects.length > 0) {
    const projectInserts = projects.map((project) => ({
      codev_id: codevId,
      project_id: project.id,
    }));

    const { error } = await supabase
      .from("codev_project")
      .insert(projectInserts);

    if (error) throw error;
  }
}

// Handle status and other field updates
async function handleFieldUpdate(
  supabase: any,
  table: string,
  field: string,
  value: any,
  userId: string,
) {
  // Normalize status values to uppercase without spaces
  const normalizedValue =
    table === "codev" && field.includes("status")
      ? value.replace(/ /g, "").toUpperCase()
      : value;

  const { error } = await supabase
    .from(table)
    .update({ [field]: normalizedValue })
    .eq("user_id", userId);

  if (error) throw error;
}

export async function updateCodev(
  key: keyof Codev,
  value: any,
  { codevId, userId }: UpdateCodevParams,
) {
  try {
    const supabase = getSupabaseServerActionClient();
    const table = getTargetTable(key);

    if (!table) {
      throw new Error(`Invalid field: ${key}`);
    }

    if (table === "projects") {
      await handleProjectUpdate(supabase, codevId, value);
    } else {
      await handleFieldUpdate(supabase, table, key, value, userId);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error updating codev ${key}:`, error);
    throw error;
  }
}
