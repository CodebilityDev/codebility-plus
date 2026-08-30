"use client";

import { Suspense, use } from "react";
import { fetchApiJson } from "@/utils/api-fetch";

import StarRating from "./StarRating";
import { ProfileRatingSkeleton } from "./ProfileDetailSkeleton";

const ratingPromises = new Map<string, Promise<number>>();

function loadRating(codevId: string): Promise<number> {
  const cached = ratingPromises.get(codevId);
  if (cached) return cached;

  const promise = fetchApiJson<{ rating: number }>(
    `/api/profile-rating/${codevId}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) return 0;
    return result.data.rating ?? 0;
  });

  ratingPromises.set(codevId, promise);
  return promise;
}

function ProfileRatingContent({ codevId }: { codevId: string }) {
  const rating = use(loadRating(codevId));
  return <StarRating rating={rating} size={24} />;
}

export default function ProfileRatingSection({ codevId }: { codevId: string }) {
  return (
    <Suspense fallback={<ProfileRatingSkeleton />}>
      <ProfileRatingContent codevId={codevId} />
    </Suspense>
  );
}
