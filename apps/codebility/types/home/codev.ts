export interface Position {
  id: bigint;
  name: string | null;
  description?: string;
}

export interface WorkExperience {
  id: string; // UUID (required)
  codev_id: string; // UUID (required)
  position: string; // (required)
  description?: string; // optional in DB
  date_from: string; // Date as string (required)
  date_to: string | null; // Nullable for "Present"
  company_name: string; // (required)
  location: string; // (required)
  profile_id?: string; // Optional
  is_present: boolean; // New field we'll add
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

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEKDAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

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
  positions: string[];
  display_position?: string;
  portfolio_website?: string | null;
  tech_stacks: string[];
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
  projects: Project[];
  work_experience?: WorkExperience[];
  created_at?: string;
  updated_at?: string;
  years_of_experience?: number;
  role_id?: number;
  mentor_id?: string;
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

export interface PaymentScedule {
  weekly: string;
  biWeekly: string;
  monthy: string;
  onCompletion: string;
}
export interface ContractType {
  partTime: string;
  fullTime: string;
  freelance: string;
  projectBased: string;
}
export interface PaymentType {
  hourly: string;
  monthly: string;
  fixedPrice: string;
}
export interface StatusType {
  active: string;
  terminated: string;
  completed: string;
  pending: string;
}
export interface Contract {
  id: string; // UUID
  codev_id?: string; // UUID
  client_id?: string; // UUID
  payment_schedule?: PaymentScedule;
  payment_type?: PaymentType;
  status?: string; // Defaults to 'pending'
  contract_type?: ContractType;
  payment_amount?: number;
  start_date: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KanbanBoardType {
  id: string; // UUID
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KanbanColumnType {
  id: string; // UUID
  board_id?: string; // UUID
  name: string;
  position: number;
  created_at?: string;
  updated_at?: string;
  tasks?: Task[];
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

export interface ExtendedTask extends Task {
  initialColumnId?: string;
}

export interface Roles {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  orgchart?: boolean;
  settings?: boolean;
  resume?: boolean;
  services?: boolean;
  permissions?: boolean;
  roles?: boolean;
  projects?: boolean;
  clients?: boolean;
  inhouse?: boolean;
  applicants?: boolean;
  interns?: boolean;
  time_tracker?: boolean;
  kanban?: boolean;
  dashboard?: boolean;
}
