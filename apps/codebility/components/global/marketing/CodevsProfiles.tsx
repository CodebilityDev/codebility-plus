import { pageSize } from "@/constants/global/page-size";
import { getCachedCodevsProfilesPage } from "@/lib/global/codevs-profiles-cached";

import CodevsProfilesContainer from "@/components/global/marketing/CodevsProfilesContainer";
import CodevsProfilesPagination from "@/components/global/marketing/CodevsProfilesPagination";
import Section from "@/components/global/marketing/CodevsSection";

const PAGE_SIZE = pageSize.codevsProfiles;

export default async function CodevsProfiles() {
  const initialData = await getCachedCodevsProfilesPage("", 1, PAGE_SIZE);

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
          initialData={initialData}
          pageSize={PAGE_SIZE}
        />
      </div>
    </Section>
  );
}
