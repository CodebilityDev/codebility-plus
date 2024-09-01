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
    const priority_level = formData.get("priority") && formData.get("priority")?.toString().toUpperCase(); // enums are upper case.
    const type = formData.get("type");
    const membersId = formData.get("membersId");
    const description = formData.get("description");
    const project_id = formData.get("projectId");
    const list_id = formData.get("listId");

    const supabase = getSupabaseServerActionClient();

    const { data: tasks, error: fetchingTasksError } = await supabase.from("task")
    .select("*")
    .eq("project_id", project_id);

    if (fetchingTasksError) throw fetchingTasksError;

    const { error } = await supabase.from("task")
    .insert({
        project_id,
        list_id,
        number: tasks.length + 1,
        title,
        type,
        description,
        category,
        duration,
        points,
        priority_level
    })

    if (error) throw error;

}