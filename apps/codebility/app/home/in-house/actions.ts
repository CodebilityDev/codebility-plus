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

    } else {
       const newValue = value.replace(/ /g,"").toUpperCase();
       const { error } = await supabase.from(target)
       .update({[key]: newValue})
       .eq("user_id", userId);

       if (error) throw error;
    }
}