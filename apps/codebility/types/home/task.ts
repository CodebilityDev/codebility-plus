import { Codev } from "./codev";

export interface Task {
    id: string;
    title: string;
    duration: number;
    points: number;
    codev?: Codev[];
}