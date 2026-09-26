import { pageSize } from "@/constants/global/page-size";
import { getCachedProfilesListingPage } from "@/lib/global/profiles-listing-cached";

import ProfilesListShell from "@/components/marketing/profiles/ProfilesListShell";

const PAGE_SIZE = pageSize.profilesListing;

export default async function ProfilesListSection() {
  const initialData = await getCachedProfilesListingPage("", 1, PAGE_SIZE);

  return (
    <ProfilesListShell initialData={initialData} pageSize={PAGE_SIZE} />
  );
}
