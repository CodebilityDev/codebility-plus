"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { CodevsGrid } from "@/components/global/marketing/CodevsGrid";
import { CodevsPaginationSlot } from "@/components/global/marketing/CodevsPaginationSlot";
import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";
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
  skillCategories,
}: CodevsProfilesPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  // The server still does the fetching. This only surfaces the in-flight state
  // of that navigation, which App Router would otherwise hide behind the
  // current page until the new RSC payload lands.
  const [isPending, startTransition] = useTransition();

  const { position, pagination } = initialData;
  const page = pagination.page;

  const navigate = (nextPosition: string, nextPage: number) => {
    startTransition(() => {
      router.push(buildHref(pathname, nextPosition, nextPage), { scroll: false });
    });
  };

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={(next) => navigate(next, 1)}
        users={initialData.codevs}
        positions={initialData.positions}
      />

      {isPending ? (
        <CodevsProfilesSkeleton count={pageSize} />
      ) : (
        <CodevsGrid
          codevs={initialData.codevs}
          page={page}
          skillCategories={skillCategories}
        />
      )}

      <CodevsPaginationSlot
        page={page}
        totalPages={Math.max(0, pagination.totalPages)}
        onPageChange={(next) => navigate(position, next)}
      />
    </div>
  );
}
