import { pageSize } from "@/constants";
import { getCachedProfilesListingPage } from "@/lib/server/profiles-listing-cached";

import ProfilesListShell from "./ProfilesListShell";

const PAGE_SIZE = pageSize.profilesListing;

export default async function ProfilesListSection() {
  const initialData = await getCachedProfilesListingPage("", 1, PAGE_SIZE);

  return (
    <ProfilesListShell initialData={initialData} pageSize={PAGE_SIZE} />
  );
}
