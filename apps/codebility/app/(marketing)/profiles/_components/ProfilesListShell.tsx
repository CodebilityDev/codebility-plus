"use client";

import type { ProfilesListingPage } from "@/types/marketing/profiles-listing";

import CodevContainer from "./CodevContainer";
import ProfilesListPagination from "./ProfilesListPagination";
import { ProfilesListSkeleton } from "./ProfilesListSkeleton";

type ProfilesListShellProps = {
  pageSize: number;
  initialData?: ProfilesListingPage | null;
  loading?: boolean;
};

function ProfilesListBody({
  initialData,
  pageSize,
  loading,
}: ProfilesListShellProps) {
  if (loading) {
    return <ProfilesListSkeleton count={pageSize} />;
  }

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

export default function ProfilesListShell({
  initialData = null,
  pageSize,
  loading = false,
}: ProfilesListShellProps) {
  return (
    <div className="relative flex flex-col gap-8 z-10">
      <CodevContainer />
      <ProfilesListBody
        initialData={initialData}
        pageSize={pageSize}
        loading={loading}
      />
    </div>
  );
}
