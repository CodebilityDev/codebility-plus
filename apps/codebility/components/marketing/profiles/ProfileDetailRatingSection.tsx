import { Suspense } from "react";

import { ProfileRatingSkeleton } from "@/components/marketing/profiles/ProfileRatingSkeleton";
import { ProfileRatingContent } from "@/components/marketing/profiles/ProfileRatingContent";
import type { ProfileRatingSectionProps } from "@/types/marketing/profiles/profiles";

export default function ProfileRatingSection({ codevId }: ProfileRatingSectionProps) {
  return (
    <Suspense fallback={<ProfileRatingSkeleton />}>
      <ProfileRatingContent codevId={codevId} />
    </Suspense>
  );
}
