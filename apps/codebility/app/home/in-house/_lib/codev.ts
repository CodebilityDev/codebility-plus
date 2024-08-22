export type InternalStatus = 
    | "AVAILABLE"
    | "DEPLOYED"
    | "TRAINING"
    | "VACATION"
    | "BUSY"
    | "CLIENTREADY"
    | "GRADUATED"
    | "FAILED";

interface Project {
    id: string;
    name: string;
}

export interface Codev {
    id: string;
    first_name: string;
    last_name: string;
    main_position: string;
    internal_status: InternalStatus;
    projects: Project[];
    nda: string;
}