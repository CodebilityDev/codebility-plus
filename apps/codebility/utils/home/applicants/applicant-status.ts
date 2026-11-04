import { APPLICANT_STATUSES } from "@/constants/home/applicants/statuses";
import type { ApplicantStatus } from "@/types/home/applicants/applicants";

export function parseApplicantStatus(value: string | undefined): ApplicantStatus {
  return APPLICANT_STATUSES.find((status) => status === value) ?? "applying";
}
