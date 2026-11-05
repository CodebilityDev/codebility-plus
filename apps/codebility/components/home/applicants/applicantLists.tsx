"use client";

import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ApplicantDataTable } from "@/components/home/applicants/applicantDataTable";
import ApplicantFilterHeaders from "@/components/home/applicants/applicantHeaders";
import { getApplicantColumns } from "@/utils/home/applicants/applicants";
import type {
  ApplicantListsProps,
  ApplicantStatus,
} from "@/types/home/applicants/applicants";

const TABS: { status: ApplicantStatus; label: string; color: string }[] = [
  { status: "applying", label: "Applicants", color: "bg-blue-500" },
  { status: "testing", label: "Testing", color: "bg-amber-500" },
  { status: "onboarding", label: "Onboarding", color: "bg-yellow-500" },
  { status: "waitlist", label: "Waitlist", color: "bg-green-500" },
  { status: "denied", label: "Denied", color: "bg-red-500" },
];

const TAB_CLASS =
  "flex h-auto flex-col items-center justify-center gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all md:flex-row md:gap-2 md:px-4 md:py-2";

const TAB_ACTIVE_CLASS = "tab-gradient font-bold text-white";

function applicantsHref(
  status: ApplicantStatus,
  page = 1,
  search = "",
) {
  const params = new URLSearchParams();
  if (status !== "applying") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  if (search) params.set("q", search);

  const query = params.toString();
  return query ? `/home/applicants?${query}` : "/home/applicants";
}

function ApplicantLists({
  status,
  applicants,
  counts,
  page,
  totalPages,
  search,
}: ApplicantListsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingStatus, setPendingStatus] = useState<ApplicantStatus | null>(null);
  const [searchTerm, setSearchTerm] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeStatus = pendingStatus ?? status;

  useEffect(() => {
    setPendingStatus(null);
  }, [status]);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        startTransition(() => {
          router.replace(applicantsHref(status, 1, value.trim()));
        });
      }, 350);
    },
    [router, status],
  );

  const onPageChange = useCallback(
    (nextPage: number) => {
      startTransition(() => {
        router.push(applicantsHref(status, nextPage, search));
      });
    },
    [router, status, search],
  );

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <ApplicantFilterHeaders
        applicants={applicants}
        search={searchTerm}
        onSearchChange={onSearchChange}
      />
      <div className="w-full">
        <nav
          aria-label="Applicant status"
          className="text-muted-foreground grid w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800"
        >
          {TABS.map((tab) => {
            const active = tab.status === activeStatus;

            return (
              <Link
                key={tab.status}
                href={applicantsHref(tab.status)}
                aria-current={active ? "page" : undefined}
                onClick={(event) => {
                  if (active) return;
                  event.preventDefault();
                  setPendingStatus(tab.status);
                  startTransition(() => {
                    router.push(applicantsHref(tab.status));
                  });
                }}
                className={`${TAB_CLASS} ${active ? TAB_ACTIVE_CLASS : ""}`}
              >
                <span className="truncate">{tab.label}</span>
                {counts[tab.status] > 0 && (
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-semibold text-white ${tab.color}`}
                  >
                    {counts[tab.status]}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div
          aria-busy={isPending}
          className={`mt-6 transition-opacity ${isPending ? "opacity-60" : ""}`}
        >
          <ApplicantDataTable
            data={applicants}
            columns={getApplicantColumns(status)}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ApplicantLists;
