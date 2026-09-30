import type { CareersJobListingsInitial } from "@/types/global/careers-job-listings";
import type { JobListing } from "@/types/global/job-listings";
import type { applicationSchema } from "@/utils/marketing/careers/careers";
import type { z } from "zod";
import type { workplaceCultureData, techCategories } from "@/constants/marketing/careers/careers";
import type React from "react";


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

export interface CareersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface JobListingsBlockProps {
  searchParams: CareersPageProps["searchParams"];
}

export interface JobListingsSectionProps {
  searchParams: CareersPageProps["searchParams"];
}

export interface JobListingsShellProps {
  pageSize: number;
  initialData: CareersJobListingsInitial | null;
}

export interface CareerGrowthCardProps {
  path: CareerPath;
  index: number;
}

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

export interface CultureCardProps {
  item: (typeof workplaceCultureData)[0];
}

export interface JobCardProps {
  job: JobListing;
  onApply: (job: JobListing) => void;
}

export interface JobListingsPaginationSlotProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface JobListingsSkeletonProps { count?: number }

export interface TechBadgeProps { name: string; className: string }

export interface TechCategoryCardProps {
  category: (typeof techCategories)[0];
}