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

    console.log(error);
}