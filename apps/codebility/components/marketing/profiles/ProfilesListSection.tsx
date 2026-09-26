
import { getCachedProfilesListingPage } from "@/lib/global/profiles-listing-cached";

import ProfilesListShell from "@/components/marketing/profiles/ProfilesListShell";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";


export default async function ProfilesListSection() {
  const initialData = await getCachedProfilesListingPage("", 1, PAGE_SIZE);

  return (
    <ProfilesListShell initialData={initialData} pageSize={PAGE_SIZE} />
  );
}
