"use client";

import { ProfilesGrid } from "@/components/marketing/profiles/ProfilesGrid";
import { loadPage } from "@/lib/marketing/profiles/profiles-list-pagination-loader";
import type { ProfilesListRemoteProps } from "@/types/marketing/profiles/profiles";
import { use } from "react";

export function ProfilesListRemote({
  position,
  page,
  pageSize,
  initialData,
}: ProfilesListRemoteProps) {
  const data = use(loadPage(position, page, pageSize, initialData));

  return (
    <ProfilesGrid
      codevs={data.codevs}
      animationKey={`${position}:${page}`}
    />
  );
}
