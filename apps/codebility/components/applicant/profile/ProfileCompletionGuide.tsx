import { loadProfilePointsResponse } from "@/lib/global/profile-points-loader";

import { ProfileCompletionGuideContent } from "@/components/applicant/profile/ProfileCompletionGuideContent";
import { ProfileCompletionGuideSkeleton } from "@/components/applicant/profile/ProfileCompletionGuideSkeleton";

export default function ProfileCompletionGuide() {
  return (
    <ProfileCompletionGuideSection />
  );
}

async function ProfileCompletionGuideSection() {
  const data = await loadProfilePointsResponse();

  if (!data) return <ProfileCompletionGuideSkeleton />;

  return <ProfileCompletionGuideContent data={data} />;
}