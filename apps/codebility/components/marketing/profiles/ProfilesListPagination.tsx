"use client";

import { usePathname, useRouter } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { ProfilesGrid } from "@/components/marketing/profiles/ProfilesGrid";
import { ProfilesPaginationSlot } from "@/components/marketing/profiles/ProfilesPaginationSlot";
import type { ProfilesListPaginationProps } from "@/types/marketing/profiles/profiles";

function buildHref(
  pathname: string,
  position: string,
  page: number,
  pageSize: number,
): string {
  const params = new URLSearchParams();
  if (position) params.set("position", position);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function ProfilesListPagination({
  initialData,
  pageSize,
  skillCategories,
}: ProfilesListPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { position, pagination } = initialData;
  const page = pagination.page;

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={(next) => {
          router.push(buildHref(pathname, next, 1, pageSize), { scroll: false });
        }}
        users={initialData.codevs}
        positions={initialData.positions}
      />

      <ProfilesGrid codevs={initialData.codevs} animationKey={`${position}:${page}`} skillCategories={skillCategories} />

      <ProfilesPaginationSlot
        page={page}
        totalPages={Math.max(0, pagination.totalPages)}
        onPageChange={(next) => {
          router.push(buildHref(pathname, position, next, pageSize), { scroll: false });
        }}
      />
    </div>
  );
}