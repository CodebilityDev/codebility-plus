import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProjectDetail } from "@/components/landing/services/ProjectDetail";
import { ProjectDetailSkeleton } from "@/components/landing/services/ProjectDetailSkeleton";
import { getCachedPortfolioProjectDetail } from "@/lib/landing/services/data";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const detail = await getCachedPortfolioProjectDetail(projectId);
  const project = detail.project;

  if (!project) {
    return { title: "Project not found | Codebility" };
  }

  const path = `/services/${encodeURIComponent(project.id)}`;

  return {
    title: `${project.name} | Codebility`,
    description: project.fullDescription,
    alternates: { canonical: `https://www.codebility.tech${path}` },
    openGraph: {
      title: `${project.name} | Codebility`,
      description: project.fullDescription,
      url: `https://www.codebility.tech${path}`,
      images: project.imageSrc
        ? [{ url: project.imageSrc, alt: project.name }]
        : [{ url: "/og-image.jpg", width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Codebility`,
      description: project.fullDescription,
      images: project.imageSrc ? [project.imageSrc] : ["/og-image.jpg"],
    },
  };
}

async function ProjectDetailContent({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const detail = await getCachedPortfolioProjectDetail(projectId);

  if (!detail.project) notFound();

  return <ProjectDetail detail={detail} />;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
