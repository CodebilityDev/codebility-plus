export interface Position {
  id: bigint;
  name: string | null;
  description?: string;
}

export interface WorkExperience {
  id: string; // UUID
  codev_id: string; // UUID
  position: string;
  description: string;
  date_from: string; // Date as string
  date_to: string | null; // Nullable for "Present"
  company_name: string;
  location: string;
  profile_id?: string; // Optional
  is_present: boolean; // Non-optional boolean
}
export interface JobStatus {
  id: string;
  job_title: string;
  company_name: string;
  employment_type: string;
  description?: string | null;
  status?: string;
  salary_range?: string | null;
  work_setup: string; // Required in DB
  shift?: string | null;
  codev_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkSchedule {
  id: string;
  codev_id: string;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Codev {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number?: string;
  address?: string | null;
  about?: string | null;
  education?: Education[];
  position_id?: bigint;
  positions?: string[];
  display_position?: string;
  portfolio_website?: string | null;
  tech_stacks?: string[];
  image_url?: string | null;
  internal_status?: string;
  availability_status?: boolean;
  nda_status?: boolean;
  level?: Record<string, any>;
  application_status?: string;
  rejected_count?: number;
  facebook?: string | null;
  linkedin?: string | null;
  github?: string | null;
  discord?: string | null;
  projects?: Project[];
  work_experience?: WorkExperience[];
  created_at?: string;
  updated_at?: string;
  years_of_experience?: number;
  role_id?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date: string;
  end_date?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  team_leader_id?: string;
  client_id?: string;
  members?: string[];
  created_at?: string;
  updated_at?: string;
  project_category_id?: number;
}

export interface Education {
  id: string;
  codev_id?: string;
  institution: string;
  degree?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type InternalStatus =
  | "TRAINING"
  | "GRADUATED"
  | "BUSY"
  | "FAILED"
  | "AVAILABLE"
  | "DEPLOYED"
  | "VACATION"
  | "CLIENTREADY";
