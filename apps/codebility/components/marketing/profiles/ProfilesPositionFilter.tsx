"use client";

import { useTransition } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import type { ProfilesPositionFilterProps } from "@/types/marketing/profiles/profiles";

export function ProfilesPositionFilter({
  positions,
}: ProfilesPositionFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const position = searchParams.get("position") ?? "";

  const selectPosition = (next: string) => {
    const params = new URLSearchParams();
    if (next) params.set("position", next);
    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="relative z-10 m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={selectPosition}
        users={[]}
        positions={positions}
      />
    </div>
  );
}
