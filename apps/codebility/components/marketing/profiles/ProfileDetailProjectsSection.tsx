import { Suspense } from "react";

import { ProfileProjectsSkeleton } from "@/components/marketing/profiles/ProfileProjectsSkeleton";
import { ProfileProjectsContent } from "@/components/marketing/profiles/ProfileProjectsContent";
import type { ProfileProjectsSectionProps } from "@/types/marketing/profiles/profiles";

export default function ProfileProjectsSection({
  codevId,
}: ProfileProjectsSectionProps) {
  return (
    <Suspense fallback={<ProfileProjectsSkeleton count={2} />}>
      <ProfileProjectsContent codevId={codevId} />
    </Suspense>
  );
}
