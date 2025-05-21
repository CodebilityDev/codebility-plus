import React from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { ChevronRight } from "lucide-react";

import { Separator } from "@codevs/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { applicantTakeTest } from "../_service/action";
import { ApplicantType } from "../_service/type";

export default function TestQAInstruction({
  children,
  applicantData,
}: {
  children: React.ReactNode;
  applicantData: ApplicantType;
}) {
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="step1">Step 1</TabsTrigger>
              <TabsTrigger value="step2">Step 2</TabsTrigger>
              <TabsTrigger value="step3">Step 3</TabsTrigger>
            </TabsList>

            <div className="h-96 w-full overflow-auto rounded-md p-4">
              <TabsContent value="step1" className="space-y-4">
                <h3 className="text-lg font-semibold">Read the Document</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li className="break-words">
                    Go to{" "}
                    <a
                      href="https://docs.google.com/document/d/1AOjPCuZHWxTmo9tH6k0_AmqMrdAnBvXz2MgyZ7OMfq0/edit?pli=1&tab=t.0#heading=h.x4pkhd3z0sx9"
                      className="break-all text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://docs.google.com/document/d/1AOjPCuZHWxTmo9tH6k0_AmqMrdAnBvXz2MgyZ7OMfq0/edit?pli=1&tab=t.0#heading=h.x4pkhd3z0sx9
                    </a>
                  </li>
                  <li className="break-words">
                    Read the document carefully and understand the requirements
                    of the test.
                  </li>
                  <li className="break-words">
                    Make sure to follow the instructions provided in the
                    document.
                  </li>
                  <li className="break-words">
                    If you have any questions or need clarification, feel free
                    to reach out to us.
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="step2" className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Complete the Assessment Within 3-4 days
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    We ask that you finish within <strong>3-4 days</strong>.
                  </li>
                  <li>
                    If you need an extension, or run into any issues, just let
                    us know.
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="step3" className="space-y-4">
                <h3 className="text-lg font-semibold">Submit Your Work</h3>
                <ul className="list-disc space-y-2 pl-5">
                  {/*   <li>
                    Each README will guide you on how to create your branch,
                    implement the solution, and submit a Pull Request from your
                    fork.
                  </li>
                  <li>
                    Make sure to include any notes, explanations, or questions
                    in your PR description.
                  </li> */}
                  <li>
                    Once you&apos;re done, please submit your figma URL to us.
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
                  onClick={async () => {
                    try {
                      await applicantTakeTest(applicantData.id);
                    } catch (error) {
                      console.error("Error starting test:", error);
                    }
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
