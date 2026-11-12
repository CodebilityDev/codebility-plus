import { ProfileContainer } from "@/components/landing/profiles/ProfileContainer";
import {
  ProfileBreadcrumbSkeleton,
  ProfileExperienceSkeleton,
  ProfileHeroSkeleton,
  ProfileProjectsSkeleton,
  ProfileSidebarSkeleton,
  ProfileSkillsSkeleton,
} from "@/components/landing/profiles/ProfilePageSkeletons";

export default function ProfileLoading() {
  return (
    <section className="relative overflow-hidden pb-[var(--cb-space-96)] lg:pb-[215px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[980px] bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_20%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_6%,transparent)_38%,transparent_70%)]"
      />

      <ProfileContainer className="relative">
        <ProfileBreadcrumbSkeleton />

        <div className="mt-[var(--cb-space-56)]">
          <ProfileHeroSkeleton />
        </div>

        <div className="mt-[var(--cb-space-24)] grid gap-[var(--cb-space-24)] lg:grid-cols-[minmax(0,1fr)_376px] lg:items-start lg:gap-[var(--cb-space-32)]">
          <div className="flex min-w-0 flex-col gap-[var(--cb-space-24)]">
            <ProfileSkillsSkeleton />
            <ProfileExperienceSkeleton />
            <div className="lg:mt-[21px]">
              <ProfileProjectsSkeleton />
            </div>
          </div>
          <aside className="min-w-0">
            <ProfileSidebarSkeleton />
          </aside>
        </div>
      </ProfileContainer>
    </section>
  );
}
