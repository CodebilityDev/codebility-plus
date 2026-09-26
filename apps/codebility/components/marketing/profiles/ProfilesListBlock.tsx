import { Suspense } from "react";
import { pageSize } from "@/constants/global/page-size";

import ProfilesListSection from "@/components/marketing/profiles/ProfilesListSection";
import ProfilesListShell from "@/components/marketing/profiles/ProfilesListShell";

const PAGE_SIZE = pageSize.profilesListing;

export function ProfilesListFallback() {
  return <ProfilesListShell loading pageSize={PAGE_SIZE} />;
}

export function ProfilesListBlock() {
  return (
    <Suspense fallback={<ProfilesListFallback />}>
      <ProfilesListSection />
    </Suspense>
  );
}
