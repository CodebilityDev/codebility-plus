"use client";

import React from "react";
import { H1 } from "@/Components/shared/dashboard";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { NewApplicantType } from "../_service/types";
import ApplicantsFilteringHeader from "../../applicants/_components/ApplicantsFilteringHeader";
import { ApplicantDataTable } from "./_table/applicantDataTable";
import { applicantsTestingColumns } from "./_table/applicantTestingColumns";
import { applicantsColumns } from "./_table/appplicantColumns";
import ApplicantFilterHeaders from "./applicantHeaders";

export default function ApplicantLists({
  applicants: data,
}: {
  applicants: NewApplicantType[];
}) {
  const [applicants, setApplicants] = React.useState(data);

  const applicantsApplying = applicants.filter(
    (applicant) => applicant.application_status === "applying",
  );

  const applicantsTesting = applicants.filter(
    (applicant) => applicant.application_status === "testing",
  );

  const applicantsOnboarding = applicants.filter(
    (applicant) => applicant.application_status === "onboarding",
  );

  const applicantsDenied = applicants.filter(
    (applicant) => applicant.application_status === "denied",
  );

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4">
      <ApplicantFilterHeaders applicants={data} setApplicants={setApplicants} />

      <Tabs defaultValue="applying" className="w-full">
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
            columns={applicantsTestingColumns}
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
        s
      </Tabs>
    </div>
  );
}
