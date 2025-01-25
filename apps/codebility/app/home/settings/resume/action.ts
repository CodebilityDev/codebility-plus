"use server";

import { cachedUser } from "@/lib/server/supabase-action";
import { Codev, WorkExperience, WorkSchedule } from "@/types/home/codev";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

const supabase = getSupabaseServerComponentClient();

// Codev profile functions
export async function updateCodev(updatedData: Partial<Codev>) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("codev")
      .update({
        ...updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating codev:", error);
    throw new Error("Failed to update profile");
  }
}

export async function updateSocialLinks(socialData: {
  facebook?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  portfolio_website?: string;
}) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("codev")
      .update({
        ...socialData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating social links:", error);
    throw new Error("Failed to update social links");
  }
}

// Work experience functions
export async function createWorkExperience(
  workExp: Omit<WorkExperience, "id">,
) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("work_experience")
      .insert({
        ...workExp,
        codev_id: user.id,
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating work experience:", error);
    throw new Error("Failed to create work experience");
  }
}

export async function updateWorkExperience(
  id: string,
  expData: Partial<WorkExperience>,
) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("work_experience")
      .update(expData)
      .eq("codev_id", user.id)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating work experience:", error);
    throw new Error("Failed to update work experience");
  }
}

export async function deleteWorkExperience(id: string) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { error } = await supabase
      .from("work_experience")
      .delete()
      .eq("codev_id", user.id)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting work experience:", error);
    throw new Error("Failed to delete work experience");
  }
}

export async function updateWorkSchedule(
  schedule: Omit<WorkSchedule, "id" | "created_at" | "updated_at">,
) {
  try {
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const supabase = getSupabaseServerComponentClient();

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const sanitizedDays = schedule.days_of_week.filter((day) =>
      validDays.includes(day),
    );

    if (sanitizedDays.length === 0) {
      throw new Error("Invalid days_of_week provided");
    }

    // Delete existing schedule for this user
    const { error: deleteError } = await supabase
      .from("work_schedules")
      .delete()
      .eq("codev_id", user.id);

    if (deleteError) {
      console.error("Error deleting existing schedule:", deleteError);
      throw new Error("Failed to delete existing schedule");
    }

    console.log("Insert Payload:", {
      codev_id: user.id,
      days_of_week: sanitizedDays,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });

    // Insert the new schedule
    const { data, error: insertError } = await supabase
      .from("work_schedules")
      .insert({
        codev_id: user.id,
        days_of_week: sanitizedDays,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      })
      .select();

    if (insertError) {
      console.error("Error inserting new schedule:", insertError);
      throw new Error("Failed to insert new schedule");
    }

    return data[0];
  } catch (error) {
    console.error("Error updating work schedule:", error.message || error);
    throw error;
  }
}

export async function getWorkSchedule(codevId: string) {
  try {
    const supabase = getSupabaseServerComponentClient();

    const { data, error } = await supabase
      .from("work_schedules")
      .select("*")
      .eq("codev_id", codevId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching work schedule:", error);
    throw error;
  }
}
