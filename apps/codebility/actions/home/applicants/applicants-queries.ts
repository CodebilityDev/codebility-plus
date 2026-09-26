"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import { NewApplicantType } from "@/types/home/applicants/applicants";
import { newApplicantsSchema } from "@/utils/home/applicants/applicants";

export async function getNewApplicants(): Promise<NewApplicantType[]> {
  try {
    const supabase = await createClientServerComponent();

    const { data: newApplicants, error } = await supabase
      .from("codev")
      .select(`*,
                applicant (*)
                `)
      .not("application_status", "eq", "passed")
      .order("date_applied", { ascending: false });

    if (error) {
      console.error("Error fetching new applicants:", error);
      return [];
    }

    const parsedNewApplicants = newApplicantsSchema.array().safeParse(newApplicants);

    if (parsedNewApplicants.error) {
      console.error("Error parsing new applicants:", parsedNewApplicants.error);
      return [];
    }

    return parsedNewApplicants.data;
  } catch (error) {
    console.error("Error fetching new applicants:", error);
    return [];
  }
}
