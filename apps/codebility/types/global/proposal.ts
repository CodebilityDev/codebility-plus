import type { Database } from "@/types/global/supabase";

type CodevRow = Database["public"]["Tables"]["codev"]["Row"];

export type ProposalCodev = Pick<
  CodevRow,
  | "id"
  | "first_name"
  | "last_name"
  | "display_position"
  | "positions"
  | "image_url"
  | "internal_status"
>;

export interface ProposalViewProps {
  realProjects: RealProject[];
  codevProfiles: ProposalCodev[];
  year: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  price?: string;
  duration?: string;
}

export interface RealProject {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  main_image?: string;
  website_url?: string;
  github_link?: string;
  figma_link?: string;
  tech_stack?: string[];
  client_id?: string;
  created_at?: string;
  project_category_id?: number;
  projects_category?: {
    id: number;
    name: string;
    description?: string;
  } | null;
  categories?: {
    id: number;
    name: string;
    description?: string;
  }[];
}
