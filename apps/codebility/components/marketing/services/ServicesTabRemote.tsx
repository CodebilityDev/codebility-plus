"use client";

import { ServicesProjectsGrid } from "@/components/marketing/services/ServicesProjectsGrid";
import { loadPage } from "@/lib/marketing/services/services-tab-loader";
import type { ServicesTabRemoteProps } from "@/types/marketing/services/services";
import { use } from "react";

export function ServicesTabRemote({
  category,
  page,
  pageSize,
  initialData,
  onServiceSelect,
}: ServicesTabRemoteProps) {
  const data = use(loadPage(category, page, pageSize, initialData));

  return (
    <ServicesProjectsGrid
      projects={data.projects}
      page={page}
      onServiceSelect={onServiceSelect}
    />
  );
}
