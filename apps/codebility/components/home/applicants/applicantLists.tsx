"use client";

import React from "react";

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

function applicantsHref(status: ApplicantStatus) {
  return status === "applying"
    ? "/home/applicants"
    : `/home/applicants?status=${status}`;
}

function ApplicantLists({ status, applicants, counts }: ApplicantListsProps) {
  const [filteredApplicants, setFilteredApplicants] =
    React.useState(applicants);
  const router = useRouter();

  React.useEffect(() => {
    setFilteredApplicants(applicants);
  }, [applicants]);

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <ApplicantFilterHeaders
        applicants={applicants}
        setApplicants={setFilteredApplicants}
        setCurrentTab={(value) =>
          router.push(applicantsHref(value as ApplicantStatus))
        }
      />
      <div className="w-full">
        <nav
          aria-label="Applicant status"
          className="text-muted-foreground grid w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800"
        >
          {TABS.map((tab) => (
            <Link
              key={tab.status}
              href={applicantsHref(tab.status)}
              aria-current={tab.status === status ? "page" : undefined}
              className={`${TAB_CLASS} ${
                tab.status === status ? TAB_ACTIVE_CLASS : ""
              }`}
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
          ))}
        </nav>
        <div className="mt-6">
          <ApplicantDataTable
            data={filteredApplicants}
            columns={getApplicantColumns(status)}
          />
        </div>
      </div>
    </div>
  );
}

export default ApplicantLists;
