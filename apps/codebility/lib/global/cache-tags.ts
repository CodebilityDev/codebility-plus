import { updateTag } from "next/cache";

export const CACHE_TAGS = {
  careersJobListings: "careers-job-listings",
  codevsFeaturedProjects: "codevs-featured-projects",
  codevsProfiles: "codevs-profiles",
  landingAdmins: "landing-admins",
  landingInterns: "landing-interns",
  onboardingTeam: "onboarding-team",
  profileDetail: "profile-detail",
  profilesListing: "profiles-listing",
  proposalCodevs: "proposal-codevs",
  proposalProjects: "proposal-projects",
  servicesProjects: "services-projects",
  skillCategories: "skill-categories",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const CODEV_CACHE_TAGS: readonly CacheTag[] = [
  CACHE_TAGS.profileDetail,
  CACHE_TAGS.profilesListing,
  CACHE_TAGS.codevsProfiles,
  CACHE_TAGS.landingInterns,
  CACHE_TAGS.landingAdmins,
  CACHE_TAGS.onboardingTeam,
  CACHE_TAGS.proposalCodevs,
];

export function expireCodevCaches(): Promise<void> {
  for (const tag of CODEV_CACHE_TAGS) {
    updateTag(tag);
  }
  return Promise.resolve();
}
