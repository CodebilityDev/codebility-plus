import type { Project } from "@/types/home/codev";

export interface Board {
    id: string;
    name: string;
    project: Project;
}