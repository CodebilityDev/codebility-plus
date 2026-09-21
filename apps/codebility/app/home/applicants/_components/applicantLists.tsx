"use client";

import React from "react";
import type { Page } from "@/lib/server/paginate";
import { qk } from "@/lib/shared/query-keys";
import { usePaginatedQuery } from "@/hooks/query/use-paginated-query";
import { useDebouncedValue } from "@/hooks/ui/use-debounced-value";

import { NewApplicantType } from "@/types/applicants";
import { getApplicantsPageAction } from "@/actions/applicants/queries";
import DefaultPagination from "@/components/ui/pagination";
import { ApplicantDataTable } from "./_table/applicantDataTable";
import { getApplicantColumns } from "./_table/applicantColumns";
import ApplicantFilterHeaders from "./applicantHeaders";

const TABS = ["applying", "testing", "onboarding", "waitlist", "denied"] as const;
type Tab = (typeof TABS)[number];

export default function ApplicantLists({
  initialData,
  counts,
}: {
  initialData: Page<NewApplicantType>;
  counts: Record<string, number>;
}) {
  const [currentTab, setCurrentTab] = React.useState<Tab>("applying");
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending } = usePaginatedQuery<NewApplicantType>(
    qk.applicants.list({ status: currentTab, page, search: debouncedSearch }),
    () =>
      getApplicantsPageAction({
        status: currentTab,
        page,
        search: debouncedSearch || undefined,
      }),
    {
      initialData,
      initialDataKey: qk.applicants.list({ status: "applying", page: 1, search: "" }),
    },
  );

  const rows = data?.rows ?? [];
  const totalPages = Math.max(Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 1)), 1);

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <ApplicantFilterHeaders
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      <div className="w-full">
        <div className="!grid !h-auto w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setCurrentTab(tab);
                setPage(1);
              }}
              className={`!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all md:flex-row md:gap-2 md:px-4 md:py-2 ${
                currentTab === tab
                  ? "bg-white shadow-sm dark:bg-gray-900"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="truncate text-sm font-medium capitalize">{tab}</span>
              {(counts[tab] ?? 0) > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-semibold text-white">
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {isPending ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <ApplicantDataTable data={rows} columns={getApplicantColumns(currentTab)} />
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <DefaultPagination
              currentPage={Math.max(1, Math.min(page, totalPages))}
              handleNextPage={() => setPage((p) => Math.min(p + 1, totalPages))}
              handlePreviousPage={() => setPage((p) => Math.max(p - 1, 1))}
              setCurrentPage={(target: number) =>
                setPage(Math.max(1, Math.min(target, totalPages)))
              }
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
