import { getCachedCodevsProfilesPage } from "@/lib/global/codevs-profiles-cached";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { parsePageParam, parseStringParam } from "@/utils/global/page-param";

import CodevsProfilesContainer from "@/components/global/marketing/CodevsProfilesContainer";
import CodevsProfilesPagination from "@/components/global/marketing/CodevsProfilesPagination";
import Section from "@/components/global/marketing/CodevsSection";
import { PAGE_SIZE } from "@/constants/global/marketing";
import type { CodevsProfilesProps } from "@/types/global/marketing";

export default async function CodevsProfiles({ searchParams }: CodevsProfilesProps) {
  const query = await searchParams;
  const position = parseStringParam(query.position);
  const page = parsePageParam(query.page);

  const [initialData, skillCategories] = await Promise.all([
    getCachedCodevsProfilesPage(position, page, PAGE_SIZE),
    getSkillCategories(),
  ]);

  if (!initialData || initialData.codevs.length === 0) {
    return (
      <Section
        id="codevs-profiles"
        className="from-black-500 relative w-full bg-gradient-to-b"
      >
        <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
        <div className="relative flex flex-col gap-8">
          <CodevsProfilesContainer />
          <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
            Sorry, no data found.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="codevs-profiles"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevsProfilesContainer />
        <CodevsProfilesPagination
          skillCategories={skillCategories}
          initialData={initialData}
          pageSize={PAGE_SIZE}
        />
      </div>
    </Section>
  );
}