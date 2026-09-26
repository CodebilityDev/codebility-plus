"use client";

import StarRating from "@/components/marketing/profiles/ProfileDetailStarRating";
import { loadRating } from "@/lib/marketing/profiles/profile-detail-rating-section-loader";
import type { ProfileRatingContentProps } from "@/types/marketing/profiles/profiles";
import { use } from "react";

export function ProfileRatingContent({ codevId }: ProfileRatingContentProps) {
  const rating = use(loadRating(codevId));
  return <StarRating rating={rating} size={24} />;
}
