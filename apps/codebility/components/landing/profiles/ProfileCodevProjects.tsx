import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { ProfileSectionCard } from "@/components/landing/profiles/ProfileSectionCard";
import { getCachedProfileProjects } from "@/lib/global/profiles-listing-cached";

interface ProfileProject {
  project_id: string;
  name: string;
  main_image: string | null;
  description?: string | null;
  website_url?: string | null;
  category?: string | null;
}

function categoryLabel(category: string | null | undefined) {
  if (!category) return null;
  return category.replace(/\bApplication\b/g, "App");
}

function ProjectRow({ project }: { project: ProfileProject }) {
  const category = categoryLabel(project.category);
  const website = project.website_url?.trim() ?? "";

  return (
    <div className="grid overflow-hidden rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface-2)] lg:min-h-[221px] lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[color:var(--cb-border)] bg-[color:var(--cb-bg)] lg:aspect-auto lg:h-full lg:min-h-[170px] lg:border-b-0 lg:border-r">
        {project.main_image ? (
          <Image
            src={project.main_image}
            alt={project.name}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 300px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[color:var(--cb-text-muted)]">
            No project image
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-center p-[var(--cb-space-24)]">
        {category ? (
          <span className="inline-flex h-[var(--cb-size-24)] items-center rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,transparent)] px-[10px] text-[11px] font-medium leading-4 text-[color:var(--cb-p200)]">
            {category}
          </span>
        ) : null}
        <h3 className="mt-[var(--cb-space-12)] text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
          {project.name}
        </h3>
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-[var(--cb-space-16)] inline-flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-p400)] underline-offset-4 hover:underline"
          >
            View project
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
            />
          </a>
        ) : (
          <span className="mt-[var(--cb-space-16)] inline-flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
            View project
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
            />
          </span>
        )}
      </div>
    </div>
  );
}

export async function ProfileCodevProjects({ id }: { id: string }) {
  const projects = await getCachedProfileProjects(id);

  if (projects.length === 0) return null;

  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between gap-[var(--cb-space-16)]">
        <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
          Projects at Codebility
        </h2>
        <span className="text-[13px] leading-[18px] text-[color:var(--cb-text-muted)]">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      <div className="mt-[var(--cb-space-20)] flex flex-col gap-[var(--cb-space-16)]">
        {projects.map((project) => (
          <ProjectRow key={project.project_id} project={project} />
        ))}
      </div>
    </ProfileSectionCard>
  );
}
