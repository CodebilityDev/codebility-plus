import StarRating from "@/components/marketing/profiles/ProfileDetailStarRating";
import { getCachedProfileRating } from "@/lib/global/profiles-listing-cached";
import type { ProfileRatingContentProps } from "@/types/marketing/profiles/profiles";

export async function ProfileRatingContent({ codevId }: ProfileRatingContentProps) {
  const rating = await getCachedProfileRating(codevId);
  return <StarRating rating={rating} size={24} />;
}
