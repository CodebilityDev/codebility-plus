import type { applicantSchema } from "@/utils/applicant/waiting/waiting";
import type z from "zod";

export type ApplicantType = z.infer<typeof applicantSchema>;
