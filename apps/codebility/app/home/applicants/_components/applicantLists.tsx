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

  const applicantsDenied = React.useMemo(
    () =>
      filteredApplicants.filter(
        (applicant) => applicant.application_status === "denied",
      ),
    [filteredApplicants],
  );

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
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
        <TabsList className="!grid !h-auto w-full grid-cols-2 gap-0.5 md:grid-cols-4 md:gap-0">
          <TabsTrigger value="applying" className="!flex !h-auto flex-col gap-0.5 px-1 py-1.5 text-xs md:flex-row md:gap-2 md:px-3 md:py-1.5 md:text-sm">
            <span className="truncate text-xs md:text-sm">Applicants</span>
            {applicantsApplying.length > 0 && (
              <Badge className="h-3.5 min-w-3.5 bg-customBlue-500 px-1 text-xs text-white md:ml-2 md:h-auto md:min-w-0 md:px-2">
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
            key={`applying-${applicantsApplying.map(a => a.id).join('-')}`}
            data={applicantsApplying}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="testing" className="mt-10 md:mt-4">
          <ApplicantDataTable
            key={`testing-${applicantsTesting.map(a => a.id).join('-')}`}
            data={applicantsTesting}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="onboarding" className="mt-10 md:mt-4">
          <ApplicantDataTable
            key={`onboarding-${applicantsOnboarding.map(a => a.id).join('-')}`}
            data={applicantsOnboarding}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="denied" className="mt-10 md:mt-4">
          <ApplicantDataTable
            key={`denied-${applicantsDenied.map(a => a.id).join('-')}`}
            data={applicantsDenied}
            columns={applicantsColumns}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ApplicantLists;
