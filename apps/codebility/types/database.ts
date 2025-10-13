// Database types for better type safety across the application

export interface DatabaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  role_id: number;
  image_url?: string;
  tech_stacks?: string[];
  about?: string;
  phone_number?: string;
  github?: string;
  facebook?: string;
  linkedin?: string;
  discord?: string;
  portfolio_website?: string;
  internal_status?: string;
  availability_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMember {
  id: string;
  codev_id: string;
  project_id: string;
  role: string;
  joined_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status?: string;
  main_image?: string;
  website_url?: string;
  github_link?: string;
  figma_link?: string;
  client_id?: string;
  tech_stack?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  codev_id?: string;
  created_by?: string;
  kanban_column_id?: string;
  skill_category_id?: string;
  priority?: string;
  points?: number;
  deadline?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  is_archive?: boolean;
  pr_link?: string;
  sidekick_ids?: string[];
  type?: string;
  difficulty?: string;
}

export interface CodevTask {
  task: Task;
}

export interface CodevWithTasks extends DatabaseUser {
  codev_task: CodevTask[];
}

export interface WorkSchedule {
  id: string;
  codev_id: string;
  days_of_week: string[];
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CodevPoints {
  id: string;
  codev_id: string;
  skill_category_id: string;
  points: number;
  period_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Level {
  id: string;
  skill_category_id: string;
  level: number;
  min_points: number;
  max_points?: number;
}

export interface AttendancePoints {
  id: string;
  codev_id: string;
  points: number;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfilePoints {
  id: number;
  codev_id: string;
  category: string;
  points: number;
  created_at: string;
  updated_at: string;
}

// Supabase response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  } | null;
}

export interface SupabaseUser {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}