"use server";

import { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";



export const updateCodev = async (
  key: keyof Codev,
  value: any,
  { codevId }: { codevId: string },
) => {
  const supabase = await createClientServerComponent();

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

  if (!target) {
    throw new Error(`Invalid codev info: ${key}`);
  }

  if (target === "projects") {
    // 1) Delete all existing pivot rows for that codev
    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("codev_id", codevId);

    if (deleteError) throw deleteError;

    // 2) Re-insert the new relationships
    for (let i = 0; i < value.length; i++) {
      const project = value[i];

      // If your 'project_members' table requires 'role' (not nullable),
      // ensure you're providing it here. Example fallback 'Developer'.
      const insertPayload = {
        codev_id: codevId,
        project_id: project.id,
        role: project.role || "member",
      };

      const { error: insertError } = await supabase
        .from("project_members")
        .insert(insertPayload);

      if (insertError) throw insertError;
    }
  } else {
    // Handle standard update to the 'codev' table
    let newValue = value;

    if (
      target === "codev" &&
      ["internal_status", "availability_status"].includes(key)
    ) {
      // Example: convert spaces to no-space uppercase
      newValue = String(newValue).replace(/\s+/g, "").toUpperCase();
    }

    const { error } = await supabase
      .from(target) // 'codev'
      .update({ [key]: newValue })
      .eq("id", codevId);

    if (error) throw error;
  }
};
