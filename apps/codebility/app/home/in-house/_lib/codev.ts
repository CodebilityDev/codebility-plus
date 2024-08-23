export type InternalStatus = 
    | "AVAILABLE"
    | "DEPLOYED"
    | "TRAINING"
    | "VACATION"
    | "BUSY"
    | "CLIENTREADY"
    | "GRADUATED"
    | "FAILED";

export interface Project {
    id: string;
    name: string;
}

export interface Codev {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    address: string;
    about: string;
    main_position: string;
    internal_status: InternalStatus;
    projects: Project[];
    tech_stacks: string[];
    nda_status: string;
    job_status: string;
}