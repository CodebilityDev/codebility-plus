"use server"

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client"

export const createNewBoard = async (name: string, project_id: string) => {
    const supabase = getSupabaseServerActionClient();
    const { error } = await supabase.from("board")
    .insert({
        name,
        project_id
    })

    if (error) throw error;
    console.log(error);
}