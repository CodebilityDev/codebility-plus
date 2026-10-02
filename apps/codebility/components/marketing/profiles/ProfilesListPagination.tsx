"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { ProfilesGrid } from "@/components/marketing/profiles/ProfilesGrid";
import { ProfilesListSkeleton } from "@/components/marketing/profiles/ProfilesListSkeleton";
import { ProfilesPaginationSlot } from "@/components/marketing/profiles/ProfilesPaginationSlot";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";
import type { ProfilesListPaginationProps } from "@/types/marketing/profiles/profiles";

function buildHref(
  pathname: string,
  position: string,
  page: number,
): string {
  const params = new URLSearchParams();
  if (position) params.set("position", position);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function ProfilesListPagination({
  initialData,
  skillCategories,
}: ProfilesListPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  // The server still does the fetching. This only surfaces the in-flight state
  // of that navigation so the skeleton shows instead of the stale page.
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
        <ProfilesListSkeleton count={PAGE_SIZE} />
      ) : (
        <ProfilesGrid
          codevs={initialData.codevs}
          animationKey={`${position}:${page}`}
          skillCategories={skillCategories}
        />
      )}

      <ProfilesPaginationSlot
        page={page}
        totalPages={Math.max(0, pagination.totalPages)}
        onPageChange={(next) => navigate(position, next)}
      />
    </div>
  );
}
