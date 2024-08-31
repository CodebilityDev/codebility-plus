import type { Project } from "@/types/home/codev";
import { Task } from "@/types/home/task";

export interface Board {
    id: string;
    name: string;
    project: Project;
    list: List[];
}

export interface List {
    id: string;
    name: string;
    task: Task[];
}