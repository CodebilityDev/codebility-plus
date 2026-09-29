import type { Codev, WorkExperience } from "@/types/global/codev";
import type { ProfilesListingPage } from "@/types/global/profiles-listing";

export interface ProfilesIdPageProps {
  params: Promise<{ id: string }>;
}

export type LevelMap = Record<string, number>;

export interface ProfileContentProps {
  codev: Codev;
  availableSchedule: NonNullable<Codev["work_schedules"]>[number] | null;
}

export interface ProjectInfo {
  project_id: string;
  name: string;
  main_image: string | null;
}

export interface ProjectListProps {
  projects: ProjectInfo[];
}

export interface StarRatingProps {
  rating: number; 
  maxStars?: number;
  size?: number; 
}

export interface ProfilesListPaginationProps {
  initialData: ProfilesListingPage;
  pageSize: number;
}

export interface ProfilesListShellProps {
  pageSize: number;
  initialData?: ProfilesListingPage | null;
  loading?: boolean;
}

export interface ProfileDetailMeta {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
}

export interface ProfileDetailRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  portfolio_website: string | null;
  about: string | null;
  github: string | null;
  linkedin: string | null;
  tech_stacks: string[] | null;
  availability_status: boolean | null;
  nda_status: boolean | null;
  level: Record<string, number> | null;
  headline: string | null;
  education: Codev["education"];
  work_experience: WorkExperience[] | null;
  work_schedules: Codev["work_schedules"];
  codev_points: Codev["codev_points"];
}

export interface AnimatedProfilesGridProps {
  codevs: ProfilesListingPage["codevs"];
  animationKey: string;
}

export interface ProfileProjectsContentProps { codevId: string }

export interface ProfileProjectsSectionProps {
  codevId: string;
}

export interface ProfileRatingContentProps { codevId: string }

export interface ProfileRatingSectionProps { codevId: string }

export interface ProfileProjectsSkeletonProps { count?: number }

export interface ProfilesGridProps {
  codevs: ProfilesListingPage["codevs"];
  animationKey: string;
}

export interface ProfilesListRemoteProps {
  position: string;
  page: number;
  pageSize: number;
  initialData: ProfilesListingPage;
}

export interface ProfilesListGridProps {
  position: string;
  page: number;
  pageSize: number;
  initialData: ProfilesListingPage;
}

export interface ProfilesListSkeletonProps { count?: number }

export interface ProfilesPaginationSlotProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
