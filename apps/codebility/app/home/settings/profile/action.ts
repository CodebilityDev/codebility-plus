"use server";

import { cachedUser } from "@/lib/server/supabase-action";
import {
  Codev,
  JobStatus,
  Position,
  WorkExperience,
  WorkSchedule,
} from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";


// Codev profile functions
export async function updateCodev(updatedData: Partial<Codev>) {
  try {
    const supabase = await createClientServerComponent();

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
    const supabase = await createClientServerComponent();
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
    const supabase = await createClientServerComponent();
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
    const supabase = await createClientServerComponent();
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
    const supabase = await createClientServerComponent();
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
    const supabase = await createClientServerComponent();
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");



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
      console.error(
        "Error deleting existing schedule:",
        deleteError.message || deleteError,
      );
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
      console.error(
        "Error inserting new schedule:",
        insertError.message || insertError,
      );
      throw new Error("Failed to insert new schedule");
    }

    return data[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating work schedule:", error.message);
    } else {
      console.error("Error updating work schedule:", error);
    }
    throw error;
  }
}

export async function getWorkSchedule(codevId: string) {
  try {
    const supabase = await createClientServerComponent();

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

export async function createJobStatus(jobStatus: Omit<JobStatus, "id">) {
  try {
    const supabase = await createClientServerComponent();
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("job_status")
      .insert({
        ...jobStatus,
        status: "active", // Set default status
        codev_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;
    return [data]; // Return as array to match expected format
  } catch (error) {
    console.error("Error creating job status:", error);
    throw error;
  }
}

export async function updateJobStatus(
  id: string,
  jobStatusData: Partial<JobStatus>,
) {
  try {
    const supabase = await createClientServerComponent();
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { data, error } = await supabase
      .from("job_status")
      .update({
        ...jobStatusData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
}

export async function deleteJobStatus(id: string) {
  try {
    const supabase = await createClientServerComponent();
    const user = await cachedUser();
    if (!user?.id) throw new Error("User not found");

    const { error } = await supabase
      .from("job_status")
      .delete()
      .eq("codev_id", user.id)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting job status:", error);
    throw new Error("Failed to delete job status");
  }
}

export async function getJobStatuses(codevId: string) {
  try {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("job_status")
      .select("*")
      .eq("codev_id", codevId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching job statuses:", error);
    throw error;
  }
}

export const getPositions = async (): Promise<{
  error: any;
  data: Position[] | null;
}> => {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase.from("positions").select("*");
  if (error) {
    console.error("Error fetching positions:", error);
    return { error, data: null };
  }

  return { error: null, data: data || null };
};
