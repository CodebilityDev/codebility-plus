"use client";

import { applicantUpdateTestSubmission } from "@/actions/applicant/waiting/applicant-waiting";
import TestInstruction from "@/components/applicant/waiting/testInstruction";
import TestQAInstruction from "@/components/applicant/waiting/testQAInstruction";
import { Button } from "@/components/global/ui/button";
import { useToast } from "@/components/global/ui/use-toast";

import { Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type { PostSubmittedProps } from "@/types/applicant/waiting/waiting";

export function PostSubmitted({
  applicantData,
  user,
}: PostSubmittedProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      /* if non ui/ux role */
      if (user.display_position?.includes("UI/UX Designer") === false) {
        // Validate the fork url
        const urlPattern =
          /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/codebility-assessment(\.git)?(\/.*)?$/;

        if (!urlPattern.test(data.fork_url)) {
          throw new Error(
            "Please enter a valid GitHub repository URL (e.g., https://github.com/username/codebility-assessment)",
          );
        }
      }

      await applicantUpdateTestSubmission({
        forkUrl: data.fork_url,
        applicantId: applicantData.id,
      });

      toast({
        title: "Test Updated",
        description: "Your test submission has been updated successfully.",
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
          Test Submitted Successfully!
        </p>

        <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
          Your submission is under review. You can update your submission below
          if needed.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full max-w-md flex-col gap-4">
            {/* FIX: replaced MUI Input with native input — same ref issue as PostReadInstructions */}
            <input
              {...register("fork_url", {
                required: "This field is required",
              })}
              type="text"
              placeholder={
                user.display_position?.includes("UI/UX Designer")
                  ? "Update your Figma File link"
                  : "Update your GitHub repository link"
              }
              defaultValue={applicantData.fork_url ?? ""}
              className="w-full rounded-md border border-gray-300 p-2 text-sm dark:bg-gray-800 dark:text-white"
            />

            {errors.fork_url && (
              <p className="text-sm text-red-500">
                {String(errors.fork_url.message)}
              </p>
            )}

            <div className="flex gap-4">
              {user.display_position?.includes("UI/UX Designer") ? (
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
                disabled={
                  isSubmitting ||
                  loading ||
                  !applicantData.fork_url ||
                  applicantData.fork_url === watch("fork_url")
                }
                className="from-customTeal to-customViolet-100h-10 via-customBlue-100 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br xl:h-12"
                type="submit"
              >
                <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full px-4 text-lg text-white lg:text-lg">
                  {loading ? (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Update Submission
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}