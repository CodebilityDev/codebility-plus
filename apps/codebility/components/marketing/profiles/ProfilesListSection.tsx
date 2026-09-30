import { getCachedProfilesListingPage } from "@/lib/global/profiles-listing-cached";
import { parsePageParam, parseStringParam } from "@/utils/global/page-param";

import ProfilesListShell from "@/components/marketing/profiles/ProfilesListShell";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";
import type { ProfilesListSectionProps } from "@/types/marketing/profiles/profiles";

export default async function ProfilesListSection({ searchParams }: ProfilesListSectionProps) {
  const query = await searchParams;
  const position = parseStringParam(query.position);
  const page = parsePageParam(query.page);

  const data = await getCachedProfilesListingPage(position, page, PAGE_SIZE);

  return <ProfilesListShell initialData={data} pageSize={PAGE_SIZE} />;
}
