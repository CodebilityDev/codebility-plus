import { CodevsProfilesSkeleton } from "../../_shared/CodevsProfilesSkeleton";

export function ProfilesListSkeleton({ count = 5 }: { count?: number }) {
  return <CodevsProfilesSkeleton count={count} />;
}
