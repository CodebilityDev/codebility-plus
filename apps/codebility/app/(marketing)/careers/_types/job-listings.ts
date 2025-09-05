export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  level: "Entry" | "Mid" | "Senior" | "Lead";
  description: string;
  requirements: string[];
  posted_date: string;
  salary_range?: string;
  remote: boolean;
  created_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface JobApplication {
  id: string;
  job_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  cover_letter: string;
  experience: string;
  resume_url?: string;
  applied_at: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
}

export interface JobListingsProps {
  initialPage?: number;
  itemsPerPage?: number;
}