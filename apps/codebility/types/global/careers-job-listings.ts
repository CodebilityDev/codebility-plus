import type { JobListing } from "@/types/global/job-listings";

export interface CareersJobListingsPage {
  jobs: JobListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  department: string;
  type: string;
  level: string;
}

export type CareersJobListingsInitial = CareersJobListingsPage & {
  departments: string[];
};
