import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";

export function ProfilesListSkeleton({ count = 5 }: { count?: number }) {
  return <CodevsProfilesSkeleton count={count} />;
}
