"use client";

import { CodevsGrid } from "@/components/global/marketing/CodevsGrid";
import { loadPage } from "@/lib/global/codevs-profiles-pagination-loader";
import type { CodevsProfilesRemoteProps } from "@/types/global/marketing";
import { use } from "react";

export function CodevsProfilesRemote({
  position,
  page,
  pageSize,
  initialData,
}: CodevsProfilesRemoteProps) {
  const data = use(loadPage(position, page, pageSize, initialData));
  return <CodevsGrid codevs={data.codevs} page={page} />;
}
