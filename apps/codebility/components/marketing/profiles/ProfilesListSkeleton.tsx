import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";
import type { ProfilesListSkeletonProps } from "@/types/marketing/profiles/profiles";

export function ProfilesListSkeleton({ count = 5 }: ProfilesListSkeletonProps) {
  return <CodevsProfilesSkeleton count={count} />;
}
