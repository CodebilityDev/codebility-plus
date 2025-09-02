"use server";

import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

interface JobListing {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  description: string;
  requirements: string[];
  salary_range?: string;
  remote?: boolean;
  status?: 'active' | 'closed' | 'draft';
  created_by?: string;
}

interface JobApplication {
  id?: string;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  cover_letter?: string;
  experience?: string;
  resume_url?: string;
  status?: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
}

export async function createJobListing(jobData: JobListing) {
  const supabase = await createClientServerComponent();

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("job_listings")
      .insert({
        ...jobData,
        created_by: user.id,
        status: jobData.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job listing:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/hire");
    revalidatePath("/careers");

    return { success: true, data };
  } catch (error) {
    console.error("Error in createJobListing:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateJobListing(id: string, jobData: Partial<JobListing>) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("job_listings")
      .update({
        ...jobData,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job listing:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/hire");
    revalidatePath("/careers");

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateJobListing:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteJobListing(id: string) {
  const supabase = await createClientServerComponent();

  try {
    const { error } = await supabase
      .from("job_listings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting job listing:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/hire");
    revalidatePath("/careers");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteJobListing:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getJobListings(status: 'active' | 'closed' | 'draft' = 'active') {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("job_listings")
      .select(`
        *,
        created_by_user:codev!created_by(id, first_name, last_name)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job listings:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getJobListings:", error);
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}

export async function getJobApplications(jobId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Error fetching job applications:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getJobApplications:", error);
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}


export async function deleteJobApplication(applicationId: string, jobId: string) {
  const supabase = await createClientServerComponent();
  try {

    const { data, error } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      console.error("Error deleting job application:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/home/hire/applications/${jobId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in deleteJobApplication:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}



export async function submitJobApplication(applicationData: JobApplication) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("job_applications")
      .insert(applicationData)
      .select()
      .single();

    if (error) {
      console.error("Error submitting job application:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/home/hire/applications/${applicationData.job_id}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error in submitJobApplication:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
) {
  const supabase = await createClientServerComponent();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", applicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/hire");

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}