"use client";

import { CodevsGrid } from "@/components/global/marketing/CodevsGrid";
import { CodevsProfilesRemote } from "@/components/global/marketing/CodevsProfilesRemote";
import type { CodevsProfilesGridProps } from "@/types/global/marketing";

export function CodevsProfilesGrid({
  position,
  page,
  pageSize,
  initialData,
}: CodevsProfilesGridProps) {
  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    return <CodevsGrid codevs={initialData.codevs} page={page} />;
  }

  return (
    <CodevsProfilesRemote
      position={position}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}
