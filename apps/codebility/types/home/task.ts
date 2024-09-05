import { Codev, Project } from "./codev";

export interface CodevTask {
  // table for connecting codevs and task.
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
  list_id: string;
  category: string;
  type: string;
  description: string;
  pr_link: string;
  created_at: string;

  // for relational
  codev?: Codev[];
  codev_task: CodevTask[];
  project?: Project;
}
