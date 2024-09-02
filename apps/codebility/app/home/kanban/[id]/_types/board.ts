import type { Project } from "@/types/home/codev";
import { Task } from "@/types/home/task";

export interface Board {
    id: string;
    name: string;
    project: Project;
    project_id: string;
    list: List[];
}

export interface List {
    id: string;
    name: string;
    task: BoardTask[];
}

export interface BoardTask extends Task {
    initial_list_id?: string;
}