import { User } from "./user";

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
    projects: Project[];
    tech_stacks: string[];
    nda_status: string;
    job_status: string;
    portfolio_website: string;

    user?: User; // for relational data type
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