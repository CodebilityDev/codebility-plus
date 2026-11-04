"use client";

import React from "react";





import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";


import { ApplicantDataTable } from "@/components/home/applicants/applicantDataTable";
import { getApplicantColumns } from "@/utils/home/applicants/applicants";
import ApplicantFilterHeaders from "@/components/home/applicants/applicantHeaders";
import type {
  ApplicantListsProps,
  ApplicantStatus,
  NewApplicantType,
} from "@/types/home/applicants/applicants";
import { getApplicantsByStatus } from "@/actions/home/applicants/applicants-queries";

function ApplicantLists({
  initialStatus,
  initialApplicants,
  counts,
}: ApplicantListsProps) {
  const [currentTab, setCurrentTab] = React.useState<ApplicantStatus>(initialStatus);
  const [rowsByStatus, setRowsByStatus] = React.useState<
    Partial<Record<ApplicantStatus, NewApplicantType[]>>
  >({ [initialStatus]: initialApplicants });
  const [filteredApplicants, setFilteredApplicants] =
    React.useState<NewApplicantType[]>(initialApplicants);
  const [loadingStatus, setLoadingStatus] = React.useState<ApplicantStatus | null>(
    null,
  );

  const loadStatus = React.useCallback(
    async (status: ApplicantStatus) => {
      if (rowsByStatus[status]) return;

      setLoadingStatus(status);
      const rows = await getApplicantsByStatus(status);
      setRowsByStatus((previous) => ({ ...previous, [status]: rows }));
      setLoadingStatus((current) => (current === status ? null : current));
    },
    [rowsByStatus],
  );

  React.useEffect(() => {
    setFilteredApplicants(rowsByStatus[currentTab] ?? []);
    void loadStatus(currentTab);
  }, [currentTab, rowsByStatus, loadStatus]);

  const currentRows = rowsByStatus[currentTab] ?? [];
  const isCurrentTabLoading = loadingStatus === currentTab && !rowsByStatus[currentTab];

  const applicantsApplying = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "applying",
      ),
    [filteredApplicants],
  );

  const applicantsTesting = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "testing",
      ),
    [filteredApplicants],
  );

  const applicantsOnboarding = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "onboarding",
      ),
    [filteredApplicants],
  );

  const applicantsWaitlist = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "waitlist",
      ),
    [filteredApplicants],
  );

  const applicantsDenied = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "denied",
      ),
    [filteredApplicants],
  );

  const deniedBadgeCount = counts.denied;

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <ApplicantFilterHeaders
        applicants={currentRows}
        setApplicants={setFilteredApplicants}
        setCurrentTab={(value) => setCurrentTab(value as ApplicantStatus)}
      />
      {isCurrentTabLoading && (
        <p className="text-sm text-muted-foreground">Loading applicants...</p>
      )}
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value as ApplicantStatus);
        }}
        className="w-full"
      >
        <TabsList className="!grid !h-auto w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800">
          <TabsTrigger 
            value="applying" 
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Applicants</span>
            {counts.applying > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-semibold text-white">
                {counts.applying}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="testing" 
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Testing</span>
            {counts.testing > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-2 text-xs font-semibold text-white">
                {counts.testing}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="onboarding"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Onboarding</span>
            {counts.onboarding > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-500 px-2 text-xs font-semibold text-white">
                {counts.onboarding}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="waitlist"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Waitlist</span>
            {counts.waitlist > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-500 px-2 text-xs font-semibold text-white">
                {counts.waitlist}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="denied"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Denied</span>
            {deniedBadgeCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                {deniedBadgeCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="applying" className="mt-6">
          <ApplicantDataTable
            data={applicantsApplying}
            columns={getApplicantColumns("applying")}
          />
        </TabsContent>
        <TabsContent value="testing" className="mt-6">
          <ApplicantDataTable
            data={applicantsTesting}
            columns={getApplicantColumns("testing")}
          />
        </TabsContent>
        <TabsContent value="onboarding" className="mt-6">
          <ApplicantDataTable
            data={applicantsOnboarding}
            columns={getApplicantColumns("onboarding")}
          />
        </TabsContent>
        <TabsContent value="waitlist" className="mt-6">
          <ApplicantDataTable
            data={applicantsWaitlist}
            columns={getApplicantColumns("waitlist")}
          />
        </TabsContent>
        <TabsContent value="denied" className="mt-6">
          <ApplicantDataTable
            data={applicantsDenied}
            columns={getApplicantColumns("denied")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApplicantLists;
