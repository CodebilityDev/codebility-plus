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
        list_id: newListId,
        updated_at: new Date()
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
        pr_link,
        updated_at: new Date()
    })
    .eq("id", prevTask.id)

    if (error) throw new Error(error.message); 

    const newMembersId = (formData.get("membersId") ? formData.get("membersId")?.toString().split(","): []) as string[];
    const prevMembersId = prevTask.codev_task.map((codev_task) => codev_task.codev.id); // get previous task members id as array of string.

    let i = 0;
    while (newMembersId[i] || prevMembersId[i]) { // while there are still member id we can loop to.
        const newMemberId = newMembersId[i];
        const prevMemberId = prevMembersId[i];

        // if the prev and new id are the same, we wont make any update.
        if (newMemberId === prevMemberId) {
            i++;
            continue;
        }

        // if member is not in previous member, but in new member.
        const added = !prevMembersId.includes(newMemberId as string);

        // if member is in previous member, but in not new member.
        const removed = !newMembersId.includes(prevMemberId as string);
        
        if (added && newMemberId) {
            const { error } = await supabase.from("codev_task")
            .insert({
                codev_id: newMemberId,
                task_id: prevTask.id
            });

            if (error) throw error;
        }

        if (removed && prevMemberId) {
            const { error } = await supabase.from("codev_task")
            .delete()
            .match({
                codev_id: prevMemberId,
                task_id: prevTask.id
            });

            if (error) throw error;
        }
        
        i++;
    }
}

export const deleteTask = async (taskId: string) => {
    const supabase = getSupabaseServerActionClient();

    const { error: removeTaskOnHandError } = await supabase.from("codev")
    .update({
        task_on_hand_id: null
    }).eq("task_on_hand_id", taskId);

    if (removeTaskOnHandError) throw removeTaskOnHandError;

    const { error: deleteCodevTask } = await supabase.from("codev_task")
    .delete()
    .eq("task_id", taskId);

    if (deleteCodevTask) throw deleteCodevTask;

    const { error } = await supabase.from("task")
    .delete()
    .eq("id", taskId);

    if (error) throw error;
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