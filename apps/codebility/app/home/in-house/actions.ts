"use server";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const updateCodev = async (
  key: keyof Codev,
  value: any,
  { codevId }: { codevId: string },
) => {
  const supabase = getSupabaseServerActionClient();

  const keys = {
    projects: ["projects"],
    codev: [
      "internal_status",
      "nda_status",
      "availability_status",
      "application_status",
      "image_url",
      "email_address",
    ],
    profile: ["display_position", "role_id", "level", "tech_stacks"],
  };

  // Determine the target table based on the key
  const target = Object.keys(keys).find((table) =>
    keys[table as keyof typeof keys].includes(key),
  );

  if (!target) throw new Error(`Invalid codev info: ${key}`);

  if (target === "projects") {
    // Existing project update logic
    await supabase.from("codev_project").delete().eq("codev_id", codevId);

    for (let i = 0; i < value.length; i++) {
      const { id: projectId } = value[i];

      const { error } = await supabase.from("codev_project").insert({
        codev_id: codevId,
        project_id: projectId,
      });

      if (error) throw error;
    }
  } else {
    let newValue = value;

    if (target === "codev") {
      // Special handling for specific fields
      if (key === "internal_status" || key === "availability_status") {
        newValue = value.replace(/ /g, "").toUpperCase();
      }
    }

    const { error } = await supabase
      .from("codev")
      .update({ [key]: newValue })
      .eq("id", codevId);

    if (error) throw error;
  }
};
