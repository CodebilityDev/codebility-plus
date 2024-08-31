"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const createNewList = async (name: string, board_id: string) => {
    const supabase = getSupabaseServerActionClient();
    const { error } = await supabase.from("list")
    .insert({
        name,
        board_id
    })

    if (error) throw error;
}