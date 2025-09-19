"use server";

import { createClientServerComponent } from "@/utils/supabase/server";

export async function updateJobListing(
  jobId: string,
  data: {
    title: string;
    department: string;
    location: string;
    type: string;
    level: string;
    description: string;
    requirements: string[];
    salary_range: string | null;
    remote: boolean;
  }
) {
  try {
    const supabase = await createClientServerComponent();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user details to check role
    const { data: userData } = await supabase
      .from('codev')
      .select('id, role_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Check if user is admin (role_id 1 or 4)
    const isAdmin = userData.role_id === 1 || userData.role_id === 4;

    // Get the job to check ownership
    const { data: job } = await supabase
      .from('job_listings')
      .select('created_by')
      .eq('id', jobId)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Check permissions
    if (!isAdmin && job.created_by !== userData.id) {
      return { success: false, error: "You don't have permission to edit this job" };
    }

    // Update the job
    const { data: updatedJob, error } = await supabase
      .from('job_listings')
      .update({
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        level: data.level,
        description: data.description,
        requirements: data.requirements,
        salary_range: data.salary_range,
        remote: data.remote,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteJobListing(jobId: string) {
  try {
    const supabase = await createClientServerComponent();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user details to check role
    const { data: userData } = await supabase
      .from('codev')
      .select('id, role_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Check if user is admin (role_id 1 or 4)
    const isAdmin = userData.role_id === 1 || userData.role_id === 4;

    // Get the job to check ownership
    const { data: job } = await supabase
      .from('job_listings')
      .select('created_by')
      .eq('id', jobId)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Check permissions
    if (!isAdmin && job.created_by !== userData.id) {
      return { success: false, error: "You don't have permission to delete this job" };
    }

    // Delete the job
    const { error } = await supabase
      .from('job_listings')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}