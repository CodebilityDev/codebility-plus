"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { JOB_LEVELS, JOB_TYPES } from "@/constants/marketing/careers/careers";
import { careersHref } from "@/utils/marketing/careers/careers";
import type {
  JobListingsFilterKey,
  JobListingsFilterProps,
} from "@/types/marketing/careers/careers";

const FILTER_GROUPS: {
  key: JobListingsFilterKey;
  label: string;
  activeClass: string;
  wrapperClass: string;
}[] = [
  {
    key: "department",
    label: "Department",
    activeClass: "bg-customViolet-100 text-white",
    wrapperClass: "pb-4 lg:col-span-2 lg:pb-4",
  },
  {
    key: "type",
    label: "Job Type",
    activeClass: "bg-customTeal text-white",
    wrapperClass: "pb-4 lg:col-span-4 lg:pb-4 lg:ml-[-35px]",
  },
  {
    key: "level",
    label: "Experience Level",
    activeClass: "bg-purple-500 text-white",
    wrapperClass: "pb-4 lg:col-span-4 lg:pb-4",
  },
];

export function JobListingsFilter({
  departments,
  department,
  type,
  level,
  total,
  onSelect,
  onClear,
}: JobListingsFilterProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const selected: Record<JobListingsFilterKey, string | null> = {
    department,
    type,
    level,
  };
  const options: Record<JobListingsFilterKey, string[]> = {
    department: ["All", ...departments],
    type: JOB_TYPES,
    level: JOB_LEVELS,
  };
  const hasActiveFilters =
    Boolean(department) || Boolean(type) || Boolean(level);

  const navigate = (
    next: Record<string, string>,
    page = 1,
  ) => {
    if (onSelect) {
      onSelect(next, page);
      return;
    }
    startTransition(() => {
      router.push(
        careersHref(
          {
            department: department ?? "",
            type: type ?? "",
            level: level ?? "",
            ...next,
          },
          page,
        ),
        { scroll: false },
      );
    });
  };

  const clear = () => {
    if (onClear) {
      onClear();
      return;
    }
    navigate({ department: "", type: "", level: "" });
  };

  return (
    <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900/30 p-6">
      <h3 className="mb-4 text-lg font-medium text-white lg:mb-6">
        Filter by Category
      </h3>
      <div className="space-y-4 lg:space-y-0">
        <div className="lg:grid lg:grid-cols-10 lg:gap-6">
          {FILTER_GROUPS.map((group) => {
            const value = selected[group.key];
            return (
              <div key={group.key} className={group.wrapperClass}>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {group.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {options[group.key].map((item) => {
                    const active =
                      value !== null &&
                      ((item === "All" && !value) || item === value);
                    return (
                      <button
                        key={item}
                        onClick={() =>
                          navigate({ [group.key]: item === "All" ? "" : item })
                        }
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? group.activeClass
                            : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 pt-4 lg:mt-6">
          <span className="text-sm text-gray-400">
            {total === undefined
              ? "\u00a0"
              : `${total} position${total !== 1 ? "s" : ""} found`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clear}
              className="text-customViolet-100 transition-colors hover:text-customViolet-200 text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
