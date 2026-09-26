"use client";

import ProjectList from "@/components/marketing/profiles/ProfileDetailProjectList";
import { loadProjects } from "@/lib/marketing/profiles/profile-detail-projects-section-loader";
import type { ProfileProjectsContentProps } from "@/types/marketing/profiles/profiles";
import { use } from "react";

export function ProfileProjectsContent({ codevId }: ProfileProjectsContentProps) {
  const projects = use(loadProjects(codevId));

  if (projects.length === 0) {
    return null;
  }

  return <ProjectList projects={projects} />;
}
