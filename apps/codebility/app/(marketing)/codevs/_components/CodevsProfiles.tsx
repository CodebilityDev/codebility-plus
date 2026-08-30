import { pageSize } from "@/constants";
import { getCachedCodevsProfilesPage } from "@/lib/server/codevs-profiles-cached";

import Section from "../../_shared/CodevsSection";
import CodevsProfilesContainer from "./CodevsProfilesContainer";
import CodevsProfilesPagination from "./CodevsProfilesPagination";

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
