"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { headers } from "next/headers";

export const createNewList = async (name: string, board_id: string) => {
    const supabase = getSupabaseServerActionClient();
    const { error } = await supabase.from("list")
    .insert({
        name,
        board_id
    })

    if (error) throw error;
}

export const createNewTask = async (formData: FormData) => {
    const title = formData.get("title");
    const category = formData.get("category");
    const duration = Number(formData.get("duration"));
    const points = Number(formData.get("points") || 0);
    const priority = formData.get("priority");
    const type = formData.get("type");
    const membersId = formData.get("membersId");
    const description = formData.get("description");
    const projectId = formData.get("projectId");
    const listId = formData.get("listId");

    console.log(listId);

    const supabase = getSupabaseServerActionClient();

    const { data } = await supabase.from("task")
    .select("*")
    .eq("list_id", listId);
}