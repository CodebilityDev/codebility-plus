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
    }).eq("id", codevId);

    console.log(error);
}