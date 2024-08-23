"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Codev } from "./_lib/codev"
import { cookies } from "next/headers";

export const updateCodev = async (key: keyof Codev, value: any, {codevId, userId}: {codevId: string, userId: string}) => {
    const supabase = createServerActionClient({cookies});
    const keys = {
        project: ["projects"],
        codev: ["internal_status","nda_status"],
        profile: ["main_position"]
    };
    
    const target = Object.keys(keys).find((table) => keys[table as keyof typeof keys].includes(key));
    
    if (!target) throw new Error(`invalid codev info: ${key}`);

    if (target === "project") {
        await supabase.from("codev_project")
        .delete()
        .eq("codev_id", codevId);
 
        for (let i = 0;i < value.length;i++) {
          const { id } = value[i];
 
          await supabase.from("codev_project")
          .insert({
             codev_id: codevId,
             project_id: id
          });
        }
    } else {
       const newValue = value.replace(/ /g,"").toUpperCase();
       const { error } = await supabase.from(target)
       .update({[key]: newValue})
       .eq("user_id", userId);

       if (error) throw error;
    }
}