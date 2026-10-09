import { Suspense } from "react";

import ProfilesListSection from "@/components/marketing/profiles/ProfilesListSection";
import { ProfilesListFallback } from "@/components/marketing/profiles/ProfilesListFallback";
import type { ProfilesListBlockProps } from "@/types/marketing/profiles/profiles";

export function ProfilesListBlock({ searchParams }: ProfilesListBlockProps) {
  return (
    <Suspense fallback={<ProfilesListFallback />}>
      <ProfilesListSection searchParams={searchParams} />
    </Suspense>
  );
}
