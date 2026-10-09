import Image from "next/image";

import { Badge } from "@codevs/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import EmptyState from "@/components/global/feedback/EmptyState";
import type { ProjectDetail } from "@/types/home/projects/projects";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

function formatDateRange(start: string | null, end: string | null) {
  if (start && end) return `${formatDate(start)} \u2013 ${formatDate(end)}`;
  if (start) return formatDate(start);
  if (end) return formatDate(end);
  return null;
}

export default function ProjectDetailInfo({
  project,
}: {
  project: ProjectDetail;
}) {
  const dateRange = formatDateRange(project.startDate, project.endDate);
  const hasDetails = [
    project.status,
    project.projectCode,
    dateRange,
    project.meetingLink,
  ].some(Boolean);
  const hasLinks = [
    project.githubLink,
    project.websiteUrl,
    project.figmaLink,
  ].some(Boolean);
  const hasTech = Boolean(project.techStack && project.techStack.length > 0);
  const hasFeatures = Boolean(
    project.keyFeatures && project.keyFeatures.length > 0,
  );
  const hasGallery = Boolean(project.gallery && project.gallery.length > 0);

  if (
    !project.description &&
    !hasDetails &&
    !hasLinks &&
    !hasTech &&
    !hasFeatures &&
    !hasGallery
  ) {
    return (
      <EmptyState
        title="No project details"
        description="Details appear here once they are added to the project."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {project.description && (
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {project.description}
          </CardContent>
        </Card>
      )}

      {hasDetails && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {project.status && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">{project.status}</Badge>
              </div>
            )}
            {project.projectCode && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Project code</span>
                <span>{project.projectCode}</span>
              </div>
            )}
            {dateRange && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Dates</span>
                <span>{dateRange}</span>
              </div>
            )}
            {project.meetingLink && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Meeting link</span>
                <a
                  href={project.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-customBlue-500 hover:underline"
                >
                  Join
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {hasLinks && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="text-customBlue-500 hover:underline"
              >
                GitHub
              </a>
            )}
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-customBlue-500 hover:underline"
              >
                Website
              </a>
            )}
            {project.figmaLink && (
              <a
                href={project.figmaLink}
                target="_blank"
                rel="noreferrer"
                className="text-customBlue-500 hover:underline"
              >
                Figma
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {hasTech && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tech stack</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {project.techStack?.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {hasFeatures && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Key features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {project.keyFeatures?.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="flex items-start gap-2"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {hasGallery && (
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.gallery?.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={src}
                  alt={`${project.name} gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
