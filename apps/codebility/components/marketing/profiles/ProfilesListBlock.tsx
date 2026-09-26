import { Suspense } from "react";


import ProfilesListSection from "@/components/marketing/profiles/ProfilesListSection";
import { ProfilesListFallback } from "@/components/marketing/profiles/ProfilesListFallback";



export function ProfilesListBlock() {
  return (
    <Suspense fallback={<ProfilesListFallback />}>
      <ProfilesListSection />
    </Suspense>
  );
}
