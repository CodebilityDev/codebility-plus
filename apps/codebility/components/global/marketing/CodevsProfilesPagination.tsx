"use client";

import { usePathname, useRouter } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { CodevsGrid } from "@/components/global/marketing/CodevsGrid";
import { CodevsPaginationSlot } from "@/components/global/marketing/CodevsPaginationSlot";
import type { CodevsProfilesPaginationProps } from "@/types/global/marketing";

function buildHref(pathname: string, position: string, page: number): string {
  const params = new URLSearchParams();
  if (position) params.set("position", position);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function CodevsProfilesPagination({
  initialData,
  pageSize,
}: CodevsProfilesPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { position, pagination } = initialData;
  const page = pagination.page;

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={(next) => {
          router.push(buildHref(pathname, next, 1), { scroll: false });
        }}
        users={initialData.codevs}
        positions={initialData.positions}
      />

      <CodevsGrid codevs={initialData.codevs} page={page} />

      <CodevsPaginationSlot
        page={page}
        totalPages={Math.max(0, pagination.totalPages)}
        onPageChange={(next) => {
          router.push(buildHref(pathname, position, next), { scroll: false });
        }}
      />
    </div>
  );
}
