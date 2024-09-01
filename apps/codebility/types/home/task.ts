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
    codev?: Codev[];
    codev_task: CodevTask[];
}