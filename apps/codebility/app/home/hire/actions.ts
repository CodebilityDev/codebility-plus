"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Helper function to create service role client for admin operations
function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.DB_SERVICE_ROLE;
  
  if (!url || !key) {
    console.error("Missing environment variables:", { 
      hasUrl: !!url, 
      hasKey: !!key 
    });
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return { success: false, error: "Unauthorized - Please log in again" };
    }

    // Get user details to check role
    const { data: userData, error: userError } = await supabase
      .from('codev')
      .select('id, role_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { success: false, error: "User not found" };
    }

    // Check if user is admin (role_id 1 or 4)
    const isAdmin = userData.role_id === 1 || userData.role_id === 4;

    // Get the job to check ownership
    const { data: job, error: jobError } = await supabase
      .from('job_listings')
      .select('created_by')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      console.error("Job fetch error:", jobError);
      return { success: false, error: "Job not found" };
    }

    // Check permissions
    if (!isAdmin && job.created_by !== userData.id) {
      return { success: false, error: "You don't have permission to edit this job" };
    }

    // Use service role client for admin operations to bypass RLS
    let updateClient;
    try {
      updateClient = isAdmin ? createServiceRoleClient() : supabase;
    } catch (serviceError) {
      console.error("Service role client error:", serviceError);
      // Fallback to regular client if service role fails
      updateClient = supabase;
    }

    // Update the job
    const { data: updatedJob, error } = await updateClient
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
      return { success: false, error: `Failed to update: ${error.message}` };
    }

    return { success: true, data: updatedJob };
  } catch (error) {
    console.error("Server action error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function deleteJobListing(jobId: string) {
  try {
    console.log("Delete job started for ID:", jobId);
    
    const supabase = await createClientServerComponent();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return { success: false, error: "Unauthorized - Please log in again" };
    }

    console.log("User authenticated:", user.id);

    // Get user details to check role
    const { data: userData, error: userError } = await supabase
      .from('codev')
      .select('id, role_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      console.error("User fetch error:", userError);
      return { success: false, error: "User not found" };
    }

    console.log("User data:", { id: userData.id, role_id: userData.role_id });

    // Check if user is admin (role_id 1 or 4)
    const isAdmin = userData.role_id === 1 || userData.role_id === 4;
    console.log("Is admin:", isAdmin);

    // Use service role client for admin operations to bypass RLS
    let queryClient;
    let deleteClient;
    try {
      if (isAdmin) {
        const serviceClient = createServiceRoleClient();
        queryClient = serviceClient;
        deleteClient = serviceClient;
        console.log("Using service role client for admin");
      } else {
        queryClient = supabase;
        deleteClient = supabase;
        console.log("Using regular client");
      }
    } catch (serviceError) {
      console.error("Service role client error:", serviceError);
      queryClient = supabase;
      deleteClient = supabase;
      console.log("Fallback to regular client");
    }

    // Get the job to check ownership - use service role client if admin
    const { data: jobs, error: jobError } = await queryClient
      .from('job_listings')
      .select('id, created_by, title, status')
      .eq('id', jobId);

    console.log("Job query result:", { jobs, error: jobError });

    if (jobError) {
      console.error("Job fetch error:", jobError);
      return { success: false, error: `Database error: ${jobError.message}` };
    }

    if (!jobs || jobs.length === 0) {
      console.error("No job found with ID:", jobId);
      return { success: false, error: `Job not found (ID: ${jobId})` };
    }

    if (jobs.length > 1) {
      console.error("Multiple jobs found with same ID:", jobs);
      return { success: false, error: "Data integrity error: Multiple jobs found" };
    }

    const job = jobs[0];
    console.log("Job found:", { id: job.id, title: job.title, status: job.status, created_by: job.created_by });

    // Check permissions - only for non-admin users
    if (!isAdmin && job.created_by !== userData.id) {
      console.log("Permission denied: User is not admin and not job creator");
      return { success: false, error: "You don't have permission to delete this job" };
    }

    console.log("Permission check passed");

    // First, delete related job applications (cascade delete)
    console.log("Deleting related applications...");
    const { error: applicationsDeleteError } = await deleteClient
      .from('job_applications')
      .delete()
      .eq('job_id', jobId);

    if (applicationsDeleteError) {
      console.error("Applications delete error:", applicationsDeleteError);
      // Continue anyway, might not have applications
    } else {
      console.log("Applications deleted successfully");
    }

    // Delete the job
    console.log("Deleting job listing...");
    const { error: deleteError } = await deleteClient
      .from('job_listings')
      .delete()
      .eq('id', jobId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return { success: false, error: `Failed to delete: ${deleteError.message}` };
    }

    console.log("Job deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
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

    // Use service role client for admin operations to bypass RLS
    const updateClient = isAdmin ? createServiceRoleClient() : supabase;

    // Update the application status
    const { data: updatedApplication, error } = await updateClient
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

    // Use service role client for admin operations to bypass RLS
    const deleteClient = isAdmin ? createServiceRoleClient() : supabase;

    // Delete the application
    const { error } = await deleteClient
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

    // Use service role client for admin operations to bypass RLS
    const updateClient = isAdmin ? createServiceRoleClient() : supabase;

    // Update the job status
    const { data: updatedJob, error } = await updateClient
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