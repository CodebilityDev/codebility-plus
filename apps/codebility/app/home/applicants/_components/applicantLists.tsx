"use client";

import React, { memo, useMemo } from "react";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";

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

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4 px-4 sm:max-w-screen-2xl sm:px-6 lg:px-8">
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
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-0">
          <TabsTrigger value="applying" className="relative flex-col gap-1 py-3 text-xs sm:flex-row sm:gap-2 sm:py-2 sm:text-sm">
            <span className="truncate">Applicants</span>
            {applicantsApplying.length > 0 && (
              <Badge className="h-5 min-w-5 bg-blue-500 px-1.5 text-xs text-white sm:ml-2 sm:h-auto sm:min-w-0 sm:px-2">
                {applicantsApplying.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="testing" className="relative flex-col gap-1 py-3 text-xs sm:flex-row sm:gap-2 sm:py-2 sm:text-sm">
            <span className="truncate">Testing</span>
            {applicantsTesting.length > 0 && (
              <Badge className="h-5 min-w-5 bg-amber-500 px-1.5 text-xs text-white sm:ml-2 sm:h-auto sm:min-w-0 sm:px-2">
                {applicantsTesting.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="relative flex-col gap-1 py-3 text-xs sm:flex-row sm:gap-2 sm:py-2 sm:text-sm">
            <span className="truncate">Onboarding</span>
            {applicantsOnboarding.length > 0 && (
              <Badge className="bg-codeGreen h-5 min-w-5 px-1.5 text-xs text-white sm:ml-2 sm:h-auto sm:min-w-0 sm:px-2">
                {applicantsOnboarding.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="denied" className="relative flex-col gap-1 py-3 text-xs sm:flex-row sm:gap-2 sm:py-2 sm:text-sm">
            <span className="truncate">Denied</span>
            {applicantsDenied.length > 0 && (
              <Badge className="h-5 min-w-5 bg-red-500 px-1.5 text-xs text-white sm:ml-2 sm:h-auto sm:min-w-0 sm:px-2">
                {applicantsDenied.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="applying" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsApplying}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="testing" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsTesting}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="onboarding" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsOnboarding}
            columns={applicantsColumns}
          />
        </TabsContent>
        <TabsContent value="denied" className="mt-10 md:mt-4">
          <ApplicantDataTable
            data={applicantsDenied}
            columns={applicantsColumns}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

memo(ApplicantLists);
