import ProfilesListPagination from "@/components/marketing/profiles/ProfilesListPagination";
import type { ProfilesListShellProps } from "@/types/marketing/profiles/profiles";

export function ProfilesListBody({ initialData, pageSize }: ProfilesListShellProps) {
  if (!initialData) {
    return (
      <p className="text-center text-2xl text-red-400">
        Failed to load profiles. Please try again later.
      </p>
    );
  }

  if (initialData.codevs.length === 0 && initialData.pagination.total === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <ProfilesListPagination initialData={initialData} pageSize={pageSize} />
  );
}
