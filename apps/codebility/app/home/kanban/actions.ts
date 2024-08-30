"use server"

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client"

export const createNewBoard = async (formData: FormData) => {
    const supabase = getSupabaseServerActionClient();
    const { error } = await supabase.from("board")
    .insert({
        name: formData.get("name"),
        project_id: formData.get("projectId")
    })

    if (error) throw error;
}