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

export async function updateApplicationStatus(
  applicationId: string,
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired"
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

    // Get the application to check job ownership
    const { data: application } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('id', applicationId)
      .single();

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    // Get the job to check ownership
    const { data: job } = await supabase
      .from('job_listings')
      .select('created_by')
      .eq('id', application.job_id)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Check permissions
    if (!isAdmin && job.created_by !== userData.id) {
      return { success: false, error: "You don't have permission to update this application" };
    }

    // Update the application status
    const { data: updatedApplication, error } = await supabase
      .from('job_applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedApplication };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteJobApplication(applicationId: string, jobId: string) {
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
      return { success: false, error: "You don't have permission to delete this application" };
    }

    // Delete the application
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', applicationId);

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

export async function updateJobListingStatus(
  jobId: string, 
  status: "active" | "closed" | "draft"
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
      .select('created_by, status')
      .eq('id', jobId)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Check permissions
    if (!isAdmin && job.created_by !== userData.id) {
      return { success: false, error: "You don't have permission to update this job" };
    }

    // Update the job status
    const { data: updatedJob, error } = await supabase
      .from('job_listings')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error("Update status error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}