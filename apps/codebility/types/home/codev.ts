export interface Position {
  id: string;
  name: string;
  description?: string;
}

export interface Codev {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  address: string | null;
  about: string | null;
  education: Education[]; // Education is now relational data
  positions: Position[]; // Array of Position objects
  display_position: string; // Main position to display
  portfolio_website: string;
  tech_stacks: string[];
  image_url: string | null;
  availability_status: boolean;
  job_status: string | null; // Should match `job_status` table
  nda_status: boolean;
  level: Record<string, any>; // JSONB data
  application_status: "applying" | "passed" | "failed";
  rejected_count: number;
  facebook_link: string;
  linkedin: string;
  github: string;
  discord: string;
  projects: Project[]; // Relational data for projects
  created_at: string; // Timestamps
  updated_at: string;
  years_of_experience: number;
  role_id: number; // References `roles` table
  internal_status: InternalStatus; // Field for internal status

  // Relational data
  experiences?: WorkExperience[]; // Array of WorkExperience
  socials?: Record<string, string | null>; // Optional for social links
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: "active" | "completed";
  start_date?: string;
  end_date?: string | null;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  team_leader_id?: string; // UUID reference to codev
  client_id?: string; // UUID reference to clients
}

export interface Education {
  id: string;
  codev_id: string;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
  description: string | null;
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
