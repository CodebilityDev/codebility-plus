"use client";

import { applicantSubmitTest } from "@/actions/applicant/waiting/applicant-waiting";
import { TestCountdown } from "@/components/applicant/waiting/testCountDown";
import TestInstruction from "@/components/applicant/waiting/testInstruction";
import TestQAInstruction from "@/components/applicant/waiting/testQAInstruction";
import { Button } from "@/components/global/ui/button";
import { useToast } from "@/components/global/ui/use-toast";
import { ApplicantType } from "@/types/applicant/waiting/applicant-waiting";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

export function PostReadInstructions({
  applicantData,
  user,
}: {
  applicantData: ApplicantType;
  user: any;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      /* if non ui/ux role */
      if (user?.display_position.includes("UI/UX Designer") === false) {
        // Validate the fork url
        const urlPattern =
          /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/codebility-assessment(\.git)?(\/.*)?$/;

        if (!urlPattern.test(data.fork_url)) {
          throw new Error(
            "Please enter a valid GitHub repository URL (e.g., https://github.com/username/codebility-assessment)",
          );
        }
      }

      await applicantSubmitTest({
        forkUrl: data.fork_url,
        applicantId: applicantData.id,
      });

      toast({
        title: "Test Submitted",
        description: "Your test submission has been submitted successfully.",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        setError("fork_url", {
          type: "manual",
          message: error.message,
        });

        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <p className="mb-2 text-lg md:text-lg lg:text-2xl">
          {user?.display_position.includes("UI/UX Designer")
            ? "Submit your Figma file link before deadline"
            : "Submit your fork of the repository before deadline"}
        </p>

        <TestCountdown applicantData={applicantData} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full max-w-md flex-col gap-4">
            {/* FIX: replaced MUI Input with native input — MUI Input breaks react-hook-form's ref, causing data.fork_url to always be undefined on submit */}
            <input
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
                {String(errors.fork_url.message)}
              </p>
            )}

            <div className="flex flex-col gap-4 *:w-[16rem] sm:flex-row sm:*:w-auto">
              {user?.display_position.includes("UI/UX Designer") ? (
                <TestQAInstruction applicantData={applicantData}>
                  <Button className="from-customTeal to-customViolet-100h-10 via-customBlue-100 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12">
                    <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                      Read Instructions
                    </span>
                  </Button>
                </TestQAInstruction>
              ) : (
                <TestInstruction applicantData={applicantData}>
                  <Button className="from-customTeal to-customViolet-100h-10 via-customBlue-100 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12">
                    <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                      Read Instructions
                    </span>
                  </Button>
                </TestInstruction>
              )}

              <Button
                disabled={isSubmitting || loading}
                className="from-customTeal to-customViolet-100h-10 via-customBlue-100 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12"
              >
                <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                  {loading ? (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
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
