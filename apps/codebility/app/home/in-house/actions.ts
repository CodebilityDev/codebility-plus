"use server";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const updateCodev = async (
  key: keyof Codev,
  value: any,
  { codevId }: { codevId: string },
) => {
  const supabase = getSupabaseServerActionClient();

  // Define keys and their corresponding target tables
  const keys = {
    projects: ["projects"],
    codev: [
      "internal_status",
      "nda_status",
      "availability_status",
      "application_status",
      "image_url",
      "email_address",
      "display_position",
      "role_id",
      "level",
      "tech_stacks",
    ],
  };

  // Dynamically find the target table
  const target = Object.keys(keys).find((table) =>
    keys[table as keyof typeof keys].includes(key),
  );

  if (!target) throw new Error(`Invalid codev info: ${key}`);

  if (target === "projects") {
    // 1) Delete all existing pivot rows for that codev
    await supabase.from("project_members").delete().eq("codev_id", codevId);

    // 2) Re-insert the new relationships
    for (let i = 0; i < value.length; i++) {
      await supabase.from("codev_project").insert({
        codev_id: codevId,
        project_id: value[i].id,
      });
    }
  } else {
    let newValue = value;

    if (target === "codev") {
      // Special handling for specific fields
      if (["internal_status", "availability_status"].includes(key)) {
        newValue = value.replace(/ /g, "").toUpperCase();
      }
    }

    const { error } = await supabase
      .from(target) // Dynamically select table
      .update({ [key]: newValue })
      .eq("id", codevId);

    if (error) throw error;
  }
};
