import ProjectList from "@/components/marketing/profiles/ProfileDetailProjectList";
import { getCachedProfileProjects } from "@/lib/global/profiles-listing-cached";
import type { ProfileProjectsContentProps } from "@/types/marketing/profiles/profiles";

export async function ProfileProjectsContent({ codevId }: ProfileProjectsContentProps) {
  const projects = await getCachedProfileProjects(codevId);

  if (projects.length === 0) {
    return null;
  }

  return <ProjectList projects={projects} />;
}
