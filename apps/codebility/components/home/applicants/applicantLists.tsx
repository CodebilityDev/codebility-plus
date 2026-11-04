"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

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

const TRIGGER_CLASS =
  "!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900";

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
        setCurrentTab={(value) => router.push(applicantsHref(value as ApplicantStatus))}
      />
      <Tabs value={status} className="w-full">
        <TabsList className="!grid !h-auto w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.status}
              value={tab.status}
              asChild
              className={TRIGGER_CLASS}
            >
              <Link href={applicantsHref(tab.status)}>
                <span className="truncate text-sm font-medium">{tab.label}</span>
                {counts[tab.status] > 0 && (
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-2 text-xs font-semibold text-white ${tab.color}`}
                  >
                    {counts[tab.status]}
                  </span>
                )}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={status} className="mt-6">
          <ApplicantDataTable
            data={filteredApplicants}
            columns={getApplicantColumns(status)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApplicantLists;
