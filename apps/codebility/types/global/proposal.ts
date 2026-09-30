export interface ProposalViewProps {
  realProjects: RealProject[];
  codevProfiles: any[];
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
