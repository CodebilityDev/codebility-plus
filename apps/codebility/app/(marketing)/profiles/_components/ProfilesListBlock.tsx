import { Suspense } from "react";
import { pageSize } from "@/constants";

import ProfilesListSection from "./ProfilesListSection";
import ProfilesListShell from "./ProfilesListShell";

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
