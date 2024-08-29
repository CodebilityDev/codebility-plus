"use server";

import { formatToUnix } from "@/lib/format-date-time";
import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const updateUserSchedule = async ({
    startTime,
    endTime
}: {
    startTime: string,
    endTime: string
}, codevId: string) => {
    const supabase = getSupabaseServerActionClient();
    const { error } = await supabase.from("codev")
    .update({
        start_time: formatToUnix(startTime),
        end_time: formatToUnix(endTime)
    })
    .eq("id", codevId);

    console.log("update schedule error ", error);
}

export const startUserTimer = async (codevId: string) => {
    const supabase = getSupabaseServerActionClient();
    const currentDate = new Date();

    const { error } = await supabase.from("codev")
    .update({
        task_timer_start_at: currentDate
    }).eq("id", codevId)
    .select();

    console.log("start user timer error ",error);
}

const stopUserTimer = async (codevId: string) => {
    const supabase = getSupabaseServerActionClient();

    const { error } = await supabase.from("codev")
    .update({
        task_timer_start_at: null
    }).eq("id", codevId);

    console.log(error);
}

export const updateUserTaskOnHand = async (codevId: string, taskId: string) => {
    const supabase = getSupabaseServerActionClient();

    const { error } = await supabase.from("codev")
    .update({
        task_on_hand_id: taskId
    }).eq("id", codevId);

    if (error) throw error;

    await stopUserTimer(codevId);
}

export const logUserTime = async (formData: FormData) => {
    const supabase = getSupabaseServerActionClient();

    const codevId = formData.get("codevId") as string;
    const taskId = formData.get("taskId");

    const { data: codevData, error: fetchingCodevError } = await supabase.from("codev")
    .select("*")
    .eq("id", codevId)
    .single();

    if (fetchingCodevError) throw fetchingCodevError;

    const taskDuration = codevData.task && codevData.task.duration;
    const startTime = new Date(codevData?.task_timer_start_at);
    const endTime = new Date();
    const workedHours = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60;
    const excessHours = taskDuration && workedHours - taskDuration

    const { error } = await supabase.from("time_log")
    .insert({
        codev_id: codevId,
        task_id: taskId,
        time_start: startTime,
        time_end: endTime,
        worked_hours: workedHours,
        excess_hours: (excessHours && excessHours > 0) ? excessHours : 0
    })

    if (error) throw error;

    await stopUserTimer(codevId);
}