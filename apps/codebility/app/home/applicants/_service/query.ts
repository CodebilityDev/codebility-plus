import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { newApplicantsSchema, NewApplicantType } from "./types";

export default async function getNewApplicants(): Promise<NewApplicantType[]> {
    try {
        const supabase = getSupabaseServerActionClient();

        const { data: newApplicants, error } = await supabase
            .from("codev")
            .select(`*,
                applicant (*)
                `)
            .not("application_status", "eq", "passed")

        if (error) {
            console.error("Error fetching new applicants:", error);
            return []
        }

        const parsedNewApplicants = newApplicantsSchema.array().safeParse(newApplicants);

        if (parsedNewApplicants.error) {
            console.error("Error parsing new applicants:", parsedNewApplicants.error);
            return []
        }

        return parsedNewApplicants.data
    } catch (error) {
        console.error("Error fetching new applicants:", error);
        return []
    }
}