"use server";

import { formatToUnix } from "@/lib/format-date-time";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { z } from "zod";

export const updateUserSchedule = async (
  {
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  },
  codevId: string,
) => {
  const supabase = getSupabaseServerActionClient();
  const { error } = await supabase
    .from("codev")
    .update({
      start_time: formatToUnix(startTime),
      end_time: formatToUnix(endTime),
    })
    .eq("id", codevId);

  if (error) throw error;
};

export const startUserTimer = async (codevId: string) => {
  const supabase = getSupabaseServerActionClient();
  const currentDate = new Date();

  const { error } = await supabase
    .from("codev")
    .update({
      task_timer_start_at: currentDate,
    })
    .eq("id", codevId)
    .select();

  console.log("start user timer error ", error);
};

const stopUserTimer = async (codevId: string) => {
  const supabase = getSupabaseServerActionClient();

  const { error } = await supabase
    .from("codev")
    .update({
      task_timer_start_at: null,
    })
    .eq("id", codevId);

  console.log(error);
};

export const logUserTime = async (formData: FormData) => {
  const supabase = getSupabaseServerActionClient();

  const codevId = formData.get("codevId") as string;
  const taskId = formData.get("taskId");

  const { data: codevData, error: fetchingCodevError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", codevId)
    .single();

  // it means that task is not yet being started so we don't log the time spent on that task.
  if (codevData?.task_timer_start_at === null) return;

  if (fetchingCodevError) throw fetchingCodevError;

  const taskDuration = codevData.task && codevData.task.duration;
  const startTime = new Date(codevData?.task_timer_start_at);
  const endTime = new Date();
  const workedHours =
    (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60;
  const excessHours = taskDuration && workedHours - taskDuration;

  const { error } = await supabase.from("time_log").insert({
    codev_id: codevId,
    task_id: taskId,
    time_start: startTime,
    time_end: endTime,
    worked_hours: workedHours,
    excess_hours: excessHours && excessHours > 0 ? excessHours : 0,
  });

  if (error) throw error;

  await stopUserTimer(codevId);
};

export const updateUserTaskOnHand = async (codevId: string, taskId: string) => {
  const supabase = getSupabaseServerActionClient();

  const formData = new FormData();
  formData.append("codevId", codevId);
  formData.append("taskId", taskId);

  await logUserTime(formData);

  const { error } = await supabase
    .from("codev")
    .update({
      task_on_hand_id: taskId,
    })
    .eq("id", codevId);

  if (error) throw error;
};


export const updateUserAvailabilityStatus = async ({
  userId,
  status
}: {
  userId: string,
  status: boolean
}
) => {
  try {
    const supabase = getSupabaseServerActionClient();

    const { error } = await supabase
      .from("codev")
      .update({
        availability_status: status,
      })
      .eq("id", userId);

    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

export const fetchUserAvailabilityStatus = async (userId: string) => {
  try {
    const supabase = getSupabaseServerActionClient();

    const { data, error } = await supabase
      .from("codev")
      .select("availability_status")
      .eq("id", userId)
      .single();

    if (error) throw error;

    const status = z.boolean().safeParse(data?.availability_status);

    if (status.error) throw status.error;

    return status.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchUserInternalStatus = async (userID: string) => {
  try {
    const supabase = getSupabaseServerActionClient();

    const { data, error } = await supabase
      .from("codev")
      .select("internal_status")
      .eq("id", userID)
      .single();

    if (error) throw error;

    const statusSchema = z.enum(["TRAINING", "GRADUATED", "WORKING"]);
    const parsed = statusSchema.safeParse(data?.internal_status);

    if (!parsed.success) throw parsed.error;

    return parsed.data; 
  } catch (error) {
    console.error("Error in fetchUserInternalStatus:", error);
    throw error;
  }
};