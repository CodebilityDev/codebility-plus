"use server";

import { Task } from "@/types/home/task";
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

export const createNewTask = async (formData: FormData) => {
    const title = formData.get("title");
    const category = formData.get("category");
    const duration = Number(formData.get("duration"));
    const points = Number(formData.get("points") || 0);
    const priority_level = formData.get("priority") && formData.get("priority")?.toString().toUpperCase(); // enums are upper case.
    const type = formData.get("type");
    const description = formData.get("description");
    const project_id = formData.get("projectId");
    const list_id = formData.get("listId");
    
    const supabase = getSupabaseServerActionClient();
    
    const { data: tasks, error: fetchingTasksError } = await supabase.from("task")
    .select("*")
    .eq("project_id", project_id);
    
    if (fetchingTasksError) throw fetchingTasksError;
    
    const { data, error } = await supabase.from("task")
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
    .select()
    .single();
        
    if (error) throw error;
   
    const membersId = (formData.get("membersId") ? formData.get("membersId")?.toString().split(","): []) as string[];

    for (let codev_id of membersId) {
        const { error } = await supabase.from("codev_task")
        .insert({
            codev_id,
            task_id: data.id
        });

        if (error) throw error;
    }
}

export const updateTaskListId = async (taskId: string, newListId: string) => {
    const supabase = getSupabaseServerActionClient();

    const { data, error } = await supabase.from("task")
    .update({
        list_id: newListId
    })
    .eq("id", taskId)
    .select(`
        *,
        codev_task(
          codev(
            *,
            user(
              *,
              profile(*)
            )
          )
        )     
    `)
    .single();

    if (error) throw error;

    data.initial_list_id = data.list_id;
    return data;
}

export const updateTask = async (formData: FormData, prevData: Task) => {
    const updatedData: Record<string, any> = {}; // get updated value as an literal object {key: value}.

    for ( let [key, value] of formData.entries()) {
        const prevValue = prevData[key as keyof typeof prevData];
        if (prevValue && value === prevValue) continue; // if no changes found we, no update require.
        updatedData[key] = value;
    }

}