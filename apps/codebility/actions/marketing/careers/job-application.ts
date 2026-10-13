"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { ApplicationFormData } from "@/types/marketing/careers/careers";

export async function submitJobApplication(
  jobId: string,
  data: ApplicationFormData,
  resume: File | null,
) {
  const supabase = await createClientServerComponent();

  let resumeUrl: string | null = null;

  if (resume) {
    const fileExtension = resume.name.split(".").pop() ?? "";
    const fileName = `${data.email.replace("@", "_")}_${Date.now()}.${fileExtension}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("codebility")
      .upload(filePath, resume, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Resume upload error:", uploadError);
      return { error: "Failed to upload resume" };
    }

    resumeUrl = filePath;
  }

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    linkedin: data.linkedIn ?? null,
    github: data.github ?? null,
    portfolio: data.portfolio ?? null,
    years_of_experience: parseInt(data.yearsOfExperience),
    cover_letter: data.coverLetter,
    experience: data.experience,
    resume_url: resumeUrl,
    status: "pending",
    notes: data.referredBy
      ? `Referred by: ${data.referredBy}`
      : "Direct Application",
  });

  if (error) {
    console.error("Job application insert error:", error);
    return { error: "Failed to submit application" };
  }

  return { error: null };
}
