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
    const CastInstruction = {
        number: ["points", "duration"],
        enum: ["priority"]
    };

    const {
        projectId: project_id,
        listId: list_id,
        title,
        duration,
        points,
        priority,
        type,   
        category,   
        description,
    } = castType(formData, CastInstruction);
   
    const supabase = getSupabaseServerActionClient();
    
    const { data: tasks, error: fetchingTasksError } = await supabase.from("task")
    .select("*")
    .eq("project_id", project_id);
    
    if (fetchingTasksError) throw fetchingTasksError;
    
    const { data, error } = await supabase.from("task")
    .insert({
        number: tasks.length + 1,
        project_id,
        list_id,
        title,
        duration,
        category,
        points,
        priority_level: priority,
        type,
        description
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

export const updateTask = async (formData: FormData, prevTask: Task) => {
    const CastInstruction = {
        number: ["points", "duration"],
        enum: ["priority"]
    };

    const {
        title,
        category,
        duration,
        points,
        priority,
        type,
        description,
        pr_link
    } = castType(formData, CastInstruction);
    
    const supabase = getSupabaseServerActionClient();

    const { error } = await supabase.from("task")
    .update({
        title,
        category,
        duration,
        points,
        priority_level: priority,
        type,
        description,
        pr_link
    })
    .eq("id", prevTask.id)

    if (error) throw new Error(error.message); 
}


/**
 * 
 * @param data - A form data that will be converted to object literal. 
 * @param CastInstruction - Collection of types that tells how data type will change.
 * 
 * @returns {object} - An object literal that contains similar data of data parameter, but have some of its
 * data casted (data type is changed to other type).
 */
function castType(data: FormData, CastInstruction: Record<string, string[]>) {
    const castedData: Record<string, any> = {}; // get value as an literal object {key: value}.

    for ( let [key, value] of data.entries()) {
        let newValue: any = value;

        switch (true) { // use to look for the type of the current data.
            case CastInstruction["number"] && CastInstruction["number"]?.includes(key): // if number
                newValue = Number(newValue);
                break;
            case CastInstruction["enum"] && CastInstruction["enum"]?.includes(key): // if enum
                newValue = newValue.toString().toUpperCase(); // enum value are typically uppercased(e.g ENUM,VALUE).
                break;
        }
        
        castedData[key] = newValue;
    }

    return castedData;
}