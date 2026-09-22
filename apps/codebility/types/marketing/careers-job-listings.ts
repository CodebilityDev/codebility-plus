import type { JobListing } from "@/app/(marketing)/careers/_types/job-listings";

export type CareersJobListingsPage = {
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
};

export type CareersJobListingsInitial = CareersJobListingsPage & {
  departments: string[];
};
