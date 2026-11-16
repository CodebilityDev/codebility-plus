import SectionError from "@/components/global/feedback/SectionError";
import ProfilesListPagination from "@/components/marketing/profiles/ProfilesListPagination";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { reportError } from "@/lib/global/error-reporting";
import type { CodevBadgeSkillCategory } from "@/types/global/codev";
import type { ProfilesListShellProps } from "@/types/marketing/profiles/profiles";

export async function ProfilesListBody({ initialData, pageSize }: ProfilesListShellProps) {
  let skillCategories: CodevBadgeSkillCategory[];

  try {
    skillCategories = await getSkillCategories();
  } catch (error) {
    reportError(error, {
      source: "section",
      boundary: "ProfilesList",
      route: "/profiles",
      section: "skill-categories",
    });
    return <SectionError />;
  }

  if (!initialData) {
    return (
      <p className="text-center text-2xl text-red-400">
        Failed to load profiles. Please try again later.
      </p>
    );
  }

  if (initialData.codevs.length === 0 && initialData.pagination.total === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <ProfilesListPagination
      initialData={initialData}
      pageSize={pageSize}
      skillCategories={skillCategories}
    />
  );
}