import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

import { Separator } from "@codevs/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { applicantTakeTest } from "../_service/action";
import { ApplicantType } from "../_service/type";
import { useRouter } from 'next/navigation'

export default function TestInstruction({
  children,
  applicantData,
}: {
  children: React.ReactNode;
  applicantData: ApplicantType;
}) {
  const router = useRouter();

  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-[600px] md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Test Instructions
            </DialogTitle>
            <DialogDescription>
              Please read the following instructions carefully before starting
              the assessment.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="step1" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="step1">Step 1</TabsTrigger>
              <TabsTrigger value="step2">Step 2</TabsTrigger>
              <TabsTrigger value="step3">Step 3</TabsTrigger>
              <TabsTrigger value="step4">Step 4</TabsTrigger>
            </TabsList>

            <div className="h-96 w-full overflow-auto rounded-md p-4">
              <TabsContent value="step1" className="space-y-4">
                <h3 className="text-lg font-semibold">Fork the Repository</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Go to{" "}
                    <a
                      href="https://github.com/Zeff01/codebility-assessment"
                      className="text-blue-500 underline"
                    >
                      https://github.com/Zeff01/codebility-assessment
                    </a>
                  </li>
                  <li>
                    Click the &quot;Fork&quot; button in the upper right corner
                  </li>
                  <li>
                    This creates your own copy of the repository under your
                    GitHub account
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="step2" className="space-y-4">
                <h3 className="text-lg font-semibold">Select Your Category</h3>
                <p>
                  You&apos;ll find separate README files for each experience
                  level in the frontend, backend, mobile, and fullstack folders:
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium">1–2 Years Experience</p>
                    <ul className="list-disc pl-5">
                      <li>frontend/README_1_2_Years.md</li>
                      <li>backend/README-1-2-YEARS.md</li>
                      <li>mobile/README_1_2_Years.md</li>
                      <li>fullstack/README_1_2_Years.md</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium">3–5 Years Experience</p>
                    <ul className="list-disc pl-5">
                      <li>frontend/README_3_5_Years.md</li>
                      <li>backend/README-3-5-YEARS.md</li>
                      <li>mobile/README_3_5_Years.md</li>
                      <li>fullstack/README_3_5_Years.md</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium">5+ Years Experience</p>
                    <ul className="list-disc pl-5">
                      <li>frontend/README_5_Years_Plus.md</li>
                      <li>backend/README-5-YEARS-Plus.md</li>
                      <li>mobile/README_5_Years_Plus.md</li>
                      <li>fullstack/README_5_Years_Plus.md</li>
                    </ul>
                  </div>
                </div>

                <p className="pt-2">
                  Please pick the README that corresponds to your experience
                  level (or the position you&apos;re applying for), then follow
                  the instructions inside it.
                </p>
              </TabsContent>

              <TabsContent value="step3" className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Complete the Assessment Within 5 days
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    We ask that you finish within <strong>5 days</strong>.
                  </li>
                  <li>
                    If you need an extension, or run into any issues, just let
                    us know.
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="step4" className="space-y-4">
                <h3 className="text-lg font-semibold">Submit Your Work</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Each README will guide you on how to create your branch,
                    implement the solution, and submit a Pull Request from your
                    fork.
                  </li>
                  <li>
                    Make sure to include any notes, explanations, or questions
                    in your PR description.
                  </li>
                  <li>
                    Once you&apos;re done, please submit your forked repository
                    URL to us.
                  </li>
                </ul>
                <p className="pt-2">
                  We look forward to reviewing your code! If you have any
                  questions at all, feel free to reach out.
                </p>
              </TabsContent>
            </div>
          </Tabs>

          <Separator className="my-4" />

          <DialogFooter>
            <DialogClose asChild>
              {applicantData.test_taken ? (
                <Button className="from-teal to-violet bg-gradient-to-r p-0.5 hover:bg-gradient-to-br">
                  <span className="flex items-center justify-center px-4 py-2">
                    <span className="text-lg text-white">
                      Close Instructions
                    </span>
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    router.refresh();
                  }}
                  className="from-teal to-violet bg-gradient-to-r p-0.5 hover:bg-gradient-to-br"
                >
                  <span className="flex items-center justify-center px-4 py-2">
                    <span className="flex items-center gap-2 text-lg text-white">
                      Start Test
                      <ChevronRight size={16} />
                    </span>
                  </span>
                </Button>
              )}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
