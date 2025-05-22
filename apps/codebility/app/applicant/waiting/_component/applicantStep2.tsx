"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@mui/material";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { applicantSubmitTest, applicantTakeTest } from "../_service/action";
import { ApplicantType } from "../_service/type";
import { TestCountdown } from "./testCountDown";
import TestInstruction from "./testInstruction";
import TestQAInstruction from "./testQAInstruction";

export default function ApplicantStep2({
  setActiveStep,
  user,
  applicantData,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  applicantData: ApplicantType;
}) {
  const takenTest = applicantData.test_taken ? true : false; // Replace with actual logic to check if the test has been taken
  const submittedTest = applicantData.fork_url ? true : false; // Replace with actual logic to check if the test has been submitted

  return (
    <div className="my-20 flex flex-col items-center gap-8 text-center lg:gap-10">
      {takenTest && !submittedTest && (
        <PostReadInstructions applicantData={applicantData} user={user} />
      )}

      {!takenTest && !submittedTest && (
        <PreReadInstructions applicantData={applicantData} user={user} />
      )}

      {submittedTest && <PostSubmitted applicantData={applicantData} />}
    </div>
  );
}

function PreReadInstructions({
  applicantData,
  user,
}: {
  applicantData: ApplicantType;
  user: any;
}) {
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
        {user?.display_position.includes("UI/UX Designer") ? (
          <TestQAInstruction applicantData={applicantData}>
            <Button
              className="from-teal to-violet h-10 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12"
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
              className="from-teal to-violet h-10 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12"
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

function PostReadInstructions({
  applicantData,
  user,
}: {
  applicantData: ApplicantType;
  user: any;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log("Submitting fork URL:", data.fork_url);

      await applicantSubmitTest({
        forkUrl: data.fork_url,
        applicantId: applicantData.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        setError("fork_url", {
          type: "manual",
          message: error.message,
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          {user?.display_position.includes("UI/UX Designer")
            ? "Submit your the Figma File Url before deadline"
            : "Submit your fork of the repository before deadline"}
        </p>

        <TestCountdown applicantData={applicantData} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full max-w-md flex-col gap-4">
            <Input
              {...register("fork_url", {
                required: "This field is required",
              })}
              type="text"
              placeholder={
                user?.display_position.includes("UI/UX Designer")
                  ? "Enter your Figma File link"
                  : "Enter your GitHub repository link"
              }
              className="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:text-white"
            />

            {errors.fork_url && (
              <p className="text-sm text-red-500">
                URL of Fork Reposity is required
              </p>
            )}

            <div className="flex gap-4">
              {user?.display_position.includes("UI/UX Designer") ? (
                <TestQAInstruction applicantData={applicantData}>
                  <Button className="from-teal to-violet h-10 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
                    <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                      Read Instructions
                    </span>
                  </Button>
                </TestQAInstruction>
              ) : (
                <TestInstruction applicantData={applicantData}>
                  <Button className="from-teal to-violet h-10 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12">
                    <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                      Read Instructions
                    </span>
                  </Button>
                </TestInstruction>
              )}

              <Button
                disabled={isSubmitting}
                className="from-teal to-violet h-10 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12"
              >
                <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                  Submit Test
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function PostSubmitted({ applicantData }: { applicantData: ApplicantType }) {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          Thank you for submitting your test!
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          Your submission is under review. We will get back to you soon.
        </p>
      </div>
    </>
  );
}
