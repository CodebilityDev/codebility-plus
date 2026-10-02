import { Suspense } from "react";

import { loadProfilePointsResponse } from "@/lib/global/profile-points-loader";
import type { ProfilePointsData } from "@/types/global/profile-points";

export function ProfilePointsGate({
  fallback = null,
  children,
}: {
  fallback?: React.ReactNode;
  children: (data: ProfilePointsData | null) => React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <ProfilePointsSection>{children}</ProfilePointsSection>
    </Suspense>
  );
}

async function ProfilePointsSection({
  children,
}: {
  children: (data: ProfilePointsData | null) => React.ReactNode;
}) {
  const data = await loadProfilePointsResponse();
  return children(data);
}