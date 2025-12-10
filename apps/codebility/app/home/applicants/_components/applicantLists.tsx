"use client";

import React, { memo, useMemo } from "react";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { NewApplicantType } from "../_service/types";
import { ApplicantDataTable } from "./_table/applicantDataTable";
import { getApplicantColumns } from "./_table/applicantColumns";
import ApplicantFilterHeaders from "./applicantHeaders";

function ApplicantLists({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  const [filteredApplicants, setFilteredApplicants] = React.useState(applicants);
  const [currentTab, setCurrentTab] = React.useState("applying");

  // Always use the latest applicants data for filtering
  React.useEffect(() => {
    setFilteredApplicants(applicants);
  }, [applicants]);

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

  return (
    <div className="mx-auto flex max-w-full flex-col gap-6">
      <ApplicantFilterHeaders
        applicants={applicants}
        setApplicants={setFilteredApplicants}
        setCurrentTab={setCurrentTab}
      />
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={(value) => {
          setCurrentTab(value);
        }}
        className="w-full"
      >
        <TabsList className="!grid !h-auto w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-5 md:gap-1 dark:bg-gray-800">
          <TabsTrigger 
            value="applying" 
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Applicants</span>
            {applicantsApplying.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-semibold text-white">
                {applicantsApplying.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="testing" 
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Testing</span>
            {applicantsTesting.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-2 text-xs font-semibold text-white">
                {applicantsTesting.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="onboarding"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Onboarding</span>
            {applicantsOnboarding.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-500 px-2 text-xs font-semibold text-white">
                {applicantsOnboarding.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="waitlist"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Waitlist</span>
            {applicantsWaitlist.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-500 px-2 text-xs font-semibold text-white">
                {applicantsWaitlist.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="denied"
            className="!flex !h-auto flex-col gap-1 rounded-md px-3 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm md:flex-row md:gap-2 md:px-4 md:py-2 dark:data-[state=active]:bg-gray-900"
          >
            <span className="truncate text-sm font-medium">Denied</span>
            {applicantsDenied.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                {applicantsDenied.length}
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
