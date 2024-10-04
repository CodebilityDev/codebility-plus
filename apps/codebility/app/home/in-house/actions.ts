"use server";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const updateCodev = async (
  key: keyof Codev,
  value: any,
  { codevId, userId }: { codevId: string; userId: string },
) => {
  const supabase = getSupabaseServerActionClient();
  const keys = {
    project: ["projects"],
    codev: ["internal_status", "nda_status", "type"],
    profile: ["main_position"],
  };

  // target table
  const target = Object.keys(keys).find((table) =>
    keys[table as keyof typeof keys].includes(key),
  );

  if (!target) throw new Error(`invalid codev info: ${key}`);

  if (target === "project") {
    await supabase.from("codev_project").delete().eq("codev_id", codevId);

    for (let i = 0; i < value.length; i++) {
      const { id } = value[i];

      await supabase.from("codev_project").insert({
        codev_id: codevId,
        project_id: id,
      });
    }
  } else {
    let newValue = value;

    if (target === "codev")
      // since all the data we are updating in codev table are status. and all status are enums.
      newValue = value.replace(/ /g, "").toUpperCase(); // we will transform all the new data to a constants naming convention.

    const { error } = await supabase
      .from(target)
      .update({ [key]: newValue })
      .eq("user_id", userId);
    if (error) throw error;
  }
};
