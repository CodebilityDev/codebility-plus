"use client";

import React, { memo, useMemo } from "react";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { NewApplicantType } from "../_service/types";
import { ApplicantDataTable } from "./_table/applicantDataTable";
import { applicantsColumns } from "./_table/appplicantColumns";
import ApplicantFilterHeaders from "./applicantHeaders";

export default function ApplicantLists({
  applicants: data,
}: {
  applicants: NewApplicantType[];
}) {
  const prioritizedApplicants = useMemo(() => {
    return prioritizeCodevs(data as Codev[], false);
  }, [data]);

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
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 sm:max-w-screen-2xl">
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="applying" className="relative">
            <span>Applicants</span>
            {applicantsApplying.length > 0 && (
              <Badge className="ml-2 bg-blue-500 text-white">
                {applicantsApplying.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="testing" className="relative">
            <span>Testing</span>
            {applicantsTesting.length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white">
                {applicantsTesting.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="relative">
            <span>Onboarding</span>
            {applicantsOnboarding.length > 0 && (
              <Badge className="bg-codeGreen ml-2 text-white">
                {applicantsOnboarding.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="denied" className="relative">
            <span>Denied</span>
            {applicantsDenied.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
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
