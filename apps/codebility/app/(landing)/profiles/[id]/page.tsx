import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";

import { ProfileContainer } from "@/components/landing/profiles/ProfileContainer";
import { ProfileCodevProjects } from "@/components/landing/profiles/ProfileCodevProjects";
import { ProfileExperienceSection } from "@/components/landing/profiles/ProfileExperienceSection";
import { ProfileHeroSection } from "@/components/landing/profiles/ProfileHeroSection";
import {
  ProfileBreadcrumbSkeleton,
  ProfileExperienceSkeleton,
  ProfileHeroSkeleton,
  ProfileProjectsSkeleton,
  ProfileSidebarSkeleton,
  ProfileSkillsSkeleton,
} from "@/components/landing/profiles/ProfilePageSkeletons";
import { ProfileSidebarSection } from "@/components/landing/profiles/ProfileSidebarSection";
import { ProfileSkillsSection } from "@/components/landing/profiles/ProfileSkillsSection";
import { getCachedProfileDetailMeta } from "@/lib/global/profile-detail-cached";

interface CodevProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CodevProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCachedProfileDetailMeta(id);

  if (!profile) {
    return {
      title: "Developer Profile | Codebility",
      description: "View this developer's profile on Codebility.",
    };
  }

  const name = (profile.first_name + " " + profile.last_name).trim();
  const image = profile.image_url ?? "/og-image.jpg";

  return {
    title: name + " | Developer Profile | Codebility",
    description:
      "View " + name + "'s developer profile on Codebility. Skills, availability, and portfolio.",
    alternates: {
      canonical: "https://www.codebility.tech/profiles/" + id,
    },
    openGraph: {
      title: name + " | Codebility",
      description: "View " + name + "'s developer profile on Codebility.",
      url: "https://www.codebility.tech/profiles/" + id,
      images: [{ url: image, width: 400, height: 400, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name + " | Codebility",
      description: "View " + name + "'s developer profile on Codebility.",
      images: [image],
    },
  };
}

async function ProfileBreadcrumb({ params }: CodevProfilePageProps) {
  const { id } = await params;
  const profile = await getCachedProfileDetailMeta(id);

  if (!profile) notFound();

  const name = (profile.first_name + " " + profile.last_name).trim();

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-[var(--cb-space-8)] pt-16 text-xs leading-5 text-[color:var(--cb-text-muted)]"
    >
      <Link
        href="/codevs"
        className="transition-colors hover:text-[color:var(--cb-text-secondary)]"
      >
        CoDevs
      </Link>
      <ChevronRight
        aria-hidden
        className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] text-[color:var(--cb-text-muted)]"
      />
      <span className="truncate text-[color:var(--cb-text-secondary)]">
        {name}
      </span>
    </nav>
  );
}

async function ProfileHeroRoute({ params }: CodevProfilePageProps) {
  const { id } = await params;
  return <ProfileHeroSection id={id} />;
}

async function ProfileSkillsRoute({ params }: CodevProfilePageProps) {
  const { id } = await params;
  return <ProfileSkillsSection id={id} />;
}

async function ProfileExperienceRoute({ params }: CodevProfilePageProps) {
  const { id } = await params;
  return <ProfileExperienceSection id={id} />;
}

async function ProfileProjectsRoute({ params }: CodevProfilePageProps) {
  const { id } = await params;
  return <ProfileCodevProjects id={id} />;
}

async function ProfileSidebarRoute({ params }: CodevProfilePageProps) {
  const { id } = await params;
  return <ProfileSidebarSection id={id} />;
}

export default function CodevProfilePage({ params }: CodevProfilePageProps) {
  return (
    <section className="relative overflow-hidden pb-[var(--cb-space-96)] lg:pb-[215px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[980px] bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_20%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_6%,transparent)_38%,transparent_70%)]"
      />

      <ProfileContainer className="relative">
        <Suspense fallback={<ProfileBreadcrumbSkeleton />}>
          <ProfileBreadcrumb params={params} />
        </Suspense>

        <div className="mt-[var(--cb-space-56)]">
          <Suspense fallback={<ProfileHeroSkeleton />}>
            <ProfileHeroRoute params={params} />
          </Suspense>
        </div>

        <div className="mt-[var(--cb-space-24)] grid gap-[var(--cb-space-24)] lg:grid-cols-[minmax(0,1fr)_376px] lg:items-start lg:gap-[var(--cb-space-32)]">
          <div className="flex min-w-0 flex-col gap-[var(--cb-space-24)]">
            <Suspense fallback={<ProfileSkillsSkeleton />}>
              <ProfileSkillsRoute params={params} />
            </Suspense>
            <Suspense fallback={<ProfileExperienceSkeleton />}>
              <ProfileExperienceRoute params={params} />
            </Suspense>
            <div className="lg:mt-[21px]">
              <Suspense fallback={<ProfileProjectsSkeleton />}>
                <ProfileProjectsRoute params={params} />
              </Suspense>
            </div>
          </div>

          <aside className="min-w-0">
            <Suspense fallback={<ProfileSidebarSkeleton />}>
              <ProfileSidebarRoute params={params} />
            </Suspense>
          </aside>
        </div>
      </ProfileContainer>
    </section>
  );
}
