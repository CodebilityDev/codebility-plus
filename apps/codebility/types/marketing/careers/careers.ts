import type { CareersJobListingsInitial } from "@/types/global/careers-job-listings";
import { JobListing } from "@/types/global/job-listings";
import { applicationSchema } from "@/utils/marketing/careers/careers";
import { z } from "zod";

export interface CareerPath {
  id: string;
  level: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  iconBg: string;
  iconColor: string;
  dotColor: string;
}

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing | null;
}

export interface JobListingsPaginationProps {
  initialData: CareersJobListingsInitial;
  pageSize: number;
}

export type JobListingsShellProps = {
  pageSize: number;
  initialData?: CareersJobListingsInitial | null;
  loading?: boolean;
};
