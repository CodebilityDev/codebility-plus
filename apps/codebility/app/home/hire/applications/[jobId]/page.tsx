import { createClientServerComponent } from "@/utils/supabase/server";
import JobApplicationsClient from "./client-page";
import { redirect } from "next/navigation";

export default async function JobApplicationsPage({ params }: { params: { jobId: string } }) {
  const supabase = await createClientServerComponent();
  const { jobId } = params;

  // Fetch job details
  const { data: job, error: jobError } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    redirect('/home/hire');
  }

  // Fetch applications for this job
  const { data: applications, error: applicationsError } = await supabase
    .from('job_applications')
    .select('id, job_id, first_name, last_name, email, phone, linkedin, github, portfolio, years_of_experience, cover_letter, experience, resume_url, applied_at, status, notes')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  // Pass data to client component
  return (
    <JobApplicationsClient 
      jobId={jobId}
      jobTitle={job.title}
      applications={applications || []}
    />
  );
}