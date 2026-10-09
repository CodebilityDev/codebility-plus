"use client";

import Link from "next/link";

import { SERVICES_CATEGORY_TABS } from "@/constants/global/services-categories";
import { servicesHref } from "@/utils/global/services-categories";

import type { ServicesTabBarProps } from "@/types/marketing/services/services";

export function ServicesTabBar({ active, onSelect }: ServicesTabBarProps) {
  return (
    <div
      id="services-categories"
      className="mx-auto flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm sm:gap-2.5 dark:bg-white/5"
    >
      {SERVICES_CATEGORY_TABS.map((tab) => {
        const isActive = active === tab.slug;
        const href = servicesHref({ category: tab.slug });
        return (
          <Link
            key={tab.slug}
            href={href}
            scroll={false}
            onClick={(event) => {
              if (!onSelect) return;
              event.preventDefault();
              onSelect(tab.slug);
            }}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-base ${
              isActive
                ? "bg-white text-gray-900 shadow-lg"
                : "text-white hover:bg-white/20 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
