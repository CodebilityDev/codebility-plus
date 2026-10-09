"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import type { CodevsProfilesFilterProps } from "@/types/global/marketing";

function buildHref(pathname: string, position: string): string {
  const params = new URLSearchParams();
  if (position) params.set("position", position);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function CodevsProfilesFilter({
  positions,
  selectedPosition,
  onSelect,
}: CodevsProfilesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  return (
    <CodevListFilter
      selectedPosition={selectedPosition}
      setSelectedPosition={(next) => {
        if (onSelect) {
          onSelect(next);
          return;
        }
        startTransition(() => {
          router.push(buildHref(pathname, next), { scroll: false });
        });
      }}
      users={[]}
      positions={positions}
    />
  );
}
