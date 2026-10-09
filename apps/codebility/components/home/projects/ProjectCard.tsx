import Image from "next/image";
import Link from "next/link";

import { Badge } from "@codevs/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import pathsConfig from "@/constants/global/paths";
import type { ProjectListItem } from "@/types/home/projects/projects";

export default function ProjectCard({
  project,
}: {
  project: ProjectListItem;
}) {
  return (
    <Link
      href={`${pathsConfig.app.projects}/${project.id}`}
      className="group block overflow-hidden rounded-lg"
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        {project.mainImage ? (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={project.mainImage}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">
              {project.name}
            </span>
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            {project.status && <Badge variant="secondary">{project.status}</Badge>}
          </div>
          {project.tagline && (
            <p className="text-sm text-muted-foreground">{project.tagline}</p>
          )}
        </CardHeader>
        {project.techStack && project.techStack.length > 0 && (
          <CardContent className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
