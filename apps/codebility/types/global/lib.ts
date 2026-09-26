import type { Codev } from "@/types/global/codev";
import type { JobListing } from "@/types/global/job-listings";

export type JobListingRow = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobListing["type"];
  level: JobListing["level"];
  description: string;
  requirements: string[] | null;
  posted_date: string;
  salary_range: string | null;
  remote: boolean | null;
};

export type CodevsFeaturedProjects = {
  slides: string[];
  projectCount: number;
};

export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  main_image: string | null;
  status: string | null;
};

export type CodevsProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  internal_status: string | null;
  level: Record<string, number> | null;
  codev_points: Array<{
    id: string;
    skill_category_id: string;
    points: number;
  }> | null;
};

export type LandingAdminsData = {
  admins: Codev[];
  mentors: Codev[];
};

export type LandingInternsPage = {
  TEAM_MEMBERS: Array<{
    id: string;
    name: string;
    role: "Intern" | "Codev" | "Member";
    image?: string;
    display_position?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type LandingInternRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_position: string | null;
  image_url: string | null;
  role_id: number | null;
};

export type ProfilesListingRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  internal_status: string | null;
  application_status: string | null;
  level: Record<string, number> | null;
  years_of_experience: number | null;
  work_experience: Array<{ id: string }> | null;
  codev_points: Array<{
    id: string;
    skill_category_id: string;
    points: number;
  }> | null;
};

export type ServicesProjectCard = {
  id: string;
  name: string;
  main_image?: string;
  description?: string;
  website_url?: string;
  categories: Array<{ id: number; name: string }>;
};

export type ServicesProjectMember = {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  role?: string;
};

export type ServicesProjectDetail = ServicesProjectCard & {
  tagline?: string;
  key_features?: string[];
  github_link?: string;
  figma_link?: string;
  start_date?: string;
  end_date?: string;
  tech_stack?: string[];
  members: ServicesProjectMember[];
};

export type ServicesProjectsPage = {
  projects: ServicesProjectCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  category: string;
};

export type ListRow = {
  id: string;
  name: string;
  main_image: string | null;
  description: string | null;
  website_url: string | null;
  categories?: Array<{
    category_id?: number;
    projects_category?: { id: number; name: string } | null;
  }> | null;
};
