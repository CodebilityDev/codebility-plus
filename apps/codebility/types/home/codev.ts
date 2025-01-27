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
  hours_per_week?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkSchedule {
  id: string;
  codev_id: string;
  days_of_week: DayOfWeek[];
  start_time: string; // Time as string
  end_time: string; // Time as string
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
  internal_status?: InternalStatus;
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
  main_image?: string;
  website_url?: string;
  figma_link?: string;
  team_leader_id?: string;
  client_id?: string;
  members?: string[];
  project_category_id?: number;
  created_at?: string;
  updated_at?: string;
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

// New types based on schema
export interface CodevPoints {
  id: string; // UUID
  codev_id?: string; // UUID
  skill_category_id?: string; // UUID
  points: number; // Defaults to 0
}

export interface SkillCategory {
  id: string; // UUID
  name: string; // Required
  description?: string; // Optional
}

export interface Level {
  id: string; // UUID
  skill_category_id?: string; // UUID
  level: number; // Required
  min_points: number; // Required
  max_points?: number; // Optional
}

// Other related types
export interface Client {
  id: string; // UUID
  name: string;
  email?: string;
  phone_number?: string;
  industry?: string;
  company_name?: string;
  company_logo?: string;
  website?: string;
  status?: string; // Defaults to 'prospect'
  client_type?: string;
  country?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Contract {
  id: string; // UUID
  codev_id?: string; // UUID
  client_id?: string; // UUID
  payment_schedule?: string;
  payment_type?: string;
  status?: string; // Defaults to 'pending'
  contract_type?: string;
  payment_amount?: number;
  start_date: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KanbanBoard {
  id: string; // UUID
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KanbanColumn {
  id: string; // UUID
  board_id?: string; // UUID
  name: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string; // UUID
  title: string;
  description?: string;
  priority?: string;
  difficulty?: string;
  status?: string; // Defaults to 'pending'
  type?: string;
  due_date?: string;
  kanban_column_id?: string; // UUID
  codev_id?: string; // UUID
  created_by?: string; // UUID
  sidekick_ids?: string[]; // UUID array
  points?: number;
  is_archive?: boolean; // Defaults to false
  pr_link?: string;
  created_at?: string;
  updated_at?: string;
}
