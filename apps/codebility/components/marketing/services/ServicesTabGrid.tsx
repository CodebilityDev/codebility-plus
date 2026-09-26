"use client";

import { ServicesProjectsGrid } from "@/components/marketing/services/ServicesProjectsGrid";
import { ServicesTabRemote } from "@/components/marketing/services/ServicesTabRemote";
import type { ServicesTabGridProps } from "@/types/marketing/services/services";

export function ServicesTabGrid({
  category,
  page,
  pageSize,
  initialData,
  onServiceSelect,
}: ServicesTabGridProps) {
  if (
    page === initialData.pagination.page &&
    category === initialData.category
  ) {
    return (
      <ServicesProjectsGrid
        projects={initialData.projects}
        page={page}
        onServiceSelect={onServiceSelect}
      />
    );
  }

  return (
    <ServicesTabRemote
      category={category}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
      onServiceSelect={onServiceSelect}
    />
  );
}
