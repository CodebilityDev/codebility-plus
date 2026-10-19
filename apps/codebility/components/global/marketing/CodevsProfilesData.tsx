import CodevsProfilesPagination from "@/components/global/marketing/CodevsProfilesPagination";
import { PAGE_SIZE } from "@/constants/global/marketing";
import { getCachedCodevsProfilesPage } from "@/lib/global/codevs-profiles-cached";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import type { CodevsProfilesProps } from "@/types/global/marketing";
import { parsePageParam, parseStringParam } from "@/utils/global/page-param";

export default async function CodevsProfilesData({
  searchParams,
}: CodevsProfilesProps) {
  const query = await searchParams;
  const position = parseStringParam(query.position);
  const page = parsePageParam(query.page);

  const [data, skillCategories] = await Promise.all([
    getCachedCodevsProfilesPage(position, page, PAGE_SIZE),
    getSkillCategories(),
  ]);

  if (!data || data.codevs.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <CodevsProfilesPagination
      skillCategories={skillCategories}
      initialData={data}
      pageSize={PAGE_SIZE}
    />
  );
}
