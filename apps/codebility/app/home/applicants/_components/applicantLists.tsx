"use client";

import React, { memo, useMemo } from "react";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { NewApplicantType } from "../_service/types";
import { ApplicantDataTable } from "./_table/applicantDataTable";
import { applicantsColumns } from "./_table/applicantColumns";
import ApplicantFilterHeaders from "./applicantHeaders";

export default function ApplicantLists({
  applicants: data,
}: {
  applicants: NewApplicantType[];
}) {
  const [applicants, setApplicants] = React.useState(data);
  const [currentTab, setCurrentTab] = React.useState("applying");

  const applicantsApplying = React.useMemo(
    () =>
      applicants.filter(
        (applicant) => applicant.application_status === "applying",
      ),
    [applicants],
  );

  const applicantsTesting = React.useMemo(
    () =>
      applicants.filter(
        (applicant) => applicant.application_status === "testing",
      ),
    [applicants],
  );

  const applicantsOnboarding = React.useMemo(
    () =>
      applicants.filter(
        (applicant) => applicant.application_status === "onboarding",
      ),
    [applicants],
  );

  const applicantsDenied = React.useMemo(
    () =>
      applicants.filter(
        (applicant) => applicant.application_status === "denied",
      ),
    [applicants],
  );

  // Filter columns based on the current tab
  const getColumnsForTab = (tab: string): ColumnDef<NewApplicantType>[] => {
    // Columns to exclude from "applying" tab
    const excludeFromApplying = ["test_taken", "test_time_remaining", "fork_url"];
    
    if (tab === "applying") {
      return applicantsColumns.filter(col => !excludeFromApplying.includes(col.id || ""));
    }
    
    // For all other tabs, show all columns
    return applicantsColumns;
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
      <ApplicantFilterHeaders
        applicants={data}
        setApplicants={setApplicants}
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
        <TabsList className="!grid !h-auto w-full grid-cols-2 gap-0.5 md:grid-cols-4 md:gap-0">
          <TabsTrigger value="applying" className="!flex !h-auto flex-col gap-0.5 px-1 py-1.5 text-xs md:flex-row md:gap-2 md:px-3 md:py-1.5 md:text-sm">
            <span className="truncate text-xs md:text-sm">Applicants</span>
            {applicantsApplying.length > 0 && (
              <Badge className="h-3.5 min-w-3.5 bg-blue-500 px-1 text-xs text-white md:ml-2 md:h-auto md:min-w-0 md:px-2">
                {applicantsApplying.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="testing" className="!flex !h-auto flex-col gap-0.5 px-1 py-1.5 text-xs md:flex-row md:gap-2 md:px-3 md:py-1.5 md:text-sm">
            <span className="truncate text-xs md:text-sm">Testing</span>
            {applicantsTesting.length > 0 && (
              <Badge className="h-3.5 min-w-3.5 bg-amber-500 px-1 text-xs text-white md:ml-2 md:h-auto md:min-w-0 md:px-2">
                {applicantsTesting.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="!flex !h-auto flex-col gap-0.5 px-1 py-1.5 text-xs md:flex-row md:gap-2 md:px-3 md:py-1.5 md:text-sm">
            <span className="truncate text-xs md:text-sm">Onboarding</span>
            {applicantsOnboarding.length > 0 && (
              <Badge className="bg-codeGreen h-3.5 min-w-3.5 px-1 text-xs text-white md:ml-2 md:h-auto md:min-w-0 md:px-2">
                {applicantsOnboarding.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="denied" className="!flex !h-auto flex-col gap-0.5 px-1 py-1.5 text-xs md:flex-row md:gap-2 md:px-3 md:py-1.5 md:text-sm">
            <span className="truncate text-xs md:text-sm">Denied</span>
            {applicantsDenied.length > 0 && (
              <Badge className="h-3.5 min-w-3.5 bg-red-500 px-1 text-xs text-white md:ml-2 md:h-auto md:min-w-0 md:px-2">
                {applicantsDenied.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="applying" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsApplying}
            columns={getColumnsForTab("applying")}
          />
        </TabsContent>
        <TabsContent value="testing" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsTesting}
            columns={getColumnsForTab("testing")}
          />
        </TabsContent>
        <TabsContent value="onboarding" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsOnboarding}
            columns={getColumnsForTab("onboarding")}
          />
        </TabsContent>
        <TabsContent value="denied" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsDenied}
            columns={getColumnsForTab("denied")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

memo(ApplicantLists);
