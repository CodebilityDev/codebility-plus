import { Codev } from "./codev";

export interface CodevTask { // table for connecting codevs and task.
    codev: Codev;
    task: Task;
}

export interface Task {
    id: string;
    title: string;
    duration: number;
    points: number;
    number: number;
    priority_level: string;
    codev?: Codev[];
    codev_task: CodevTask[];
    list_id: string;
    category: string;
    type: string;
    description: string;
    pr_link: string;
    created_at: string;
}