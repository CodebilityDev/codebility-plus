import type { ProjectRole } from "@/types/global/permissions";

export interface ProjectListItem {
  id: string;
  name: string;
  tagline: string | null;
  status: string | null;
  projectCode: string | null;
  mainImage: string | null;
  techStack: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  status: string | null;
  projectCode: string | null;
  startDate: string | null;
  endDate: string | null;
  githubLink: string | null;
  websiteUrl: string | null;
  figmaLink: string | null;
  meetingLink: string | null;
  mainImage: string | null;
  secondaryImage: string | null;
  gallery: string[] | null;
  techStack: string[] | null;
  keyFeatures: string[] | null;
}

export interface ProjectContributor {
  id: string;
  codevId: string;
  role: ProjectRole;
  joinedAt: string | null;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  displayPosition: string | null;
  username: string | null;
}

export interface ContributorCandidate {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  displayPosition: string | null;
  username: string | null;
  roleName: string | null;
}

export interface ProjectFormInput {
  name: string;
  description?: string;
  tagline?: string;
  status?: string;
  projectCode?: string;
  startDate?: string;
  endDate?: string;
  githubLink?: string;
  websiteUrl?: string;
  figmaLink?: string;
  meetingLink?: string;
  techStack?: string[];
  keyFeatures?: string[];
}
