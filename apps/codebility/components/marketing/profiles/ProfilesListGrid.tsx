"use client";

import { ProfilesGrid } from "@/components/marketing/profiles/ProfilesGrid";
import { ProfilesListRemote } from "@/components/marketing/profiles/ProfilesListRemote";
import type { ProfilesListGridProps } from "@/types/marketing/profiles/profiles";

export function ProfilesListGrid({
  position,
  page,
  pageSize,
  initialData,
}: ProfilesListGridProps) {
  const animationKey = `${position}:${page}`;

  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    return (
      <ProfilesGrid
        codevs={initialData.codevs}
        animationKey={animationKey}
      />
    );
  }

  return (
    <ProfilesListRemote
      position={position}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}
