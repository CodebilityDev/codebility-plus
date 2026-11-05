"use client";

import { applicantTakeTest } from "@/actions/applicant/waiting/applicant-waiting";
import TestInstruction from "@/components/applicant/waiting/testInstruction";
import TestQAInstruction from "@/components/applicant/waiting/testQAInstruction";
import { Button } from "@/components/global/ui/button";

import { Loader2Icon } from "lucide-react";
import React from "react";
import type { PreReadInstructionsProps } from "@/types/applicant/waiting/waiting";

export function PreReadInstructions({
  applicantData,
  user,
}: PreReadInstructionsProps) {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          Read the instructions carefully before starting the test.
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          You have 3 - 4 days to complete the test. Please make sure to complete
          the test within the given time frame. If you need an extension, or run
          into any issues, just let us know.
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          The test will begin, once you read the instructions.
        </p>
      </div>

      <div className="flex gap-4">
        {user.display_position?.includes("UI/UX Designer") ? (
          <TestQAInstruction applicantData={applicantData}>
            <Button
              className="from-customTeal to-customViolet-100 via-customBlue-100 h-10 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12"
              onClick={async () => {
                setLoading(true);
                try {
                  await applicantTakeTest({
                    applicantId: applicantData.id,
                    codevId: applicantData.codev_id,
                  });
                } catch (error) {
                  console.error("Error message:", error);
                }
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                Read Instructions
              </span>
            </Button>
          </TestQAInstruction>
        ) : (
          <TestInstruction applicantData={applicantData}>
            <Button
              className="from-customTeal to-customViolet-100h-10 via-customBlue-100 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12"
              onClick={async () => {
                setLoading(true);
                try {
                  await applicantTakeTest({
                    applicantId: applicantData.id,
                    codevId: applicantData.codev_id,
                  });
                } catch (error) {
                  console.error("Error message:", error);
                }
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                Read Instructions
              </span>
            </Button>
          </TestInstruction>
        )}
      </div>
    </>
  );
}