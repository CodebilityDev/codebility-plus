import { User } from "./user";

interface WorkExperience {
    position: string;
    company: string;
    date_from: string;
    date_to: string;
    description: string;
}

export interface Codev {
    id: string;
    email: string;
    user_id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    address: string;
    about: string;
    contact: string;
    education: string;
    socials: Record<string, string | null>;
    main_position: string;
    internal_status: InternalStatus;
    tech_stacks: string[];
    nda_status: string;
    job_status: string;
    portfolio_website: string;
    
    // for relational data type
    user?: User;
    projects: Project[];
    work_experience?: WorkExperience;
}
  
export interface Project {
    id: string;
    name: string;
}
  
export type InternalStatus = 
      | "AVAILABLE"
      | "DEPLOYED"
      | "TRAINING"
      | "VACATION"
      | "BUSY"
      | "CLIENTREADY"
      | "GRADUATED"
      | "FAILED";