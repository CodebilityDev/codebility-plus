export interface Position {
  id: bigint; // Changed from string to bigint to match DB
  name: string | null; // Made nullable to match DB
  description?: string;
}

export interface WorkExperience {
  id: string; // UUID
  codev_id: string; // UUID, required in DB
  position: string; // Character varying in DB
  date_from: string; // Start date
  date_to: string | null; // End date, nullable for "Present"
  description?: string; // Optional description
  company_name: string; // Company name, added field
  location: string; // Location, added field
  profile_id?: string; // UUID, optional
  is_present?: boolean; // Optional flag for "Up to Present"
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

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface Codev {
  id: string; // UUID
  first_name: string; // Required
  last_name: string; // Required
  email_address: string; // Required
  phone_number?: string;
  address?: string;
  about?: string;
  education?: string; // Changed to match DB - it's a text field, not an array
  positions?: string[]; // Changed to ARRAY type
  display_position?: string;
  portfolio_website?: string;
  tech_stacks?: string[]; // ARRAY type
  image_url?: string;
  job_status?: string;
  internal_status?: string; // Default: 'TRAINING'
  availability_status?: boolean; // Default: true
  nda_status?: boolean; // Default: false
  level?: Record<string, any>; // JSONB
  application_status?: string; // Default: 'pending'
  rejected_count?: number; // Default: 0
  facebook?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  projects?: string[]; // ARRAY type
  created_at?: string; // timestamp
  updated_at?: string; // timestamp
  years_of_experience?: number; // Default: 0
  role_id?: number;
}

export interface Project {
  id: string; // UUID
  name: string; // Required
  description?: string;
  status?: string; // Default: 'active'
  start_date: string; // Required date
  end_date?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  team_leader_id?: string; // UUID
  client_id?: string; // UUID
  members?: string[]; // Added: UUID ARRAY
  created_at?: string; // timestamp
  updated_at?: string; // timestamp
  project_category_id?: number;
}

export interface Education {
  id: string; // UUID
  codev_id?: string; // UUID
  institution: string; // Required
  degree?: string;
  start_date?: string; // date
  end_date?: string; // date
  description?: string;
  created_at?: string; // timestamp
  updated_at?: string; // timestamp
}

// Updated to match the database's internal_status default
export type InternalStatus =
  | "TRAINING" // Default value in DB
  | "GRADUATED"
  | "BUSY"
  | "FAILED"
  | "AVAILABLE"
  | "DEPLOYED"
  | "VACATION"
  | "CLIENTREADY";
