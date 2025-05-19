"use client";

import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2Icon, MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import {
  multipleAcceptApplicantAction,
  multipleDeleteApplicantAction,
  multipleDenyApplicantAction,
  multipleMoveApplicantToApplyingAction,
  multipleMoveApplicantToOnboardingAction,
  multipleMoveApplicantToTestingAction,
  multiplePassApplicantTestAction,
} from "../../_service/action";
import { NewApplicantType } from "../../_service/types";

export default function ApplicantRowActionButton({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState<
    | "applying"
    | "testing"
    | "onboarding"
    | "denied"
    | "delete"
    | "pass"
    | "fail"
    | "accept"
    | "deny"
    | null
  >(null);

  const handleMoveAllToApplying = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToApplyingAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleMoveAllToTesting = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToTestingAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleMoveAllToOnboarding = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToOnboardingAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDenyAll = async () => {
    setLoading(true);
    try {
      await multipleDenyApplicantAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePassAll = async () => {
    setLoading(true);
    try {
      await multiplePassApplicantTestAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAcceptAll = async () => {
    setLoading(true);
    try {
      await multipleAcceptApplicantAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await multipleDeleteApplicantAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="hidden sm:flex">
        {(applicants[0]?.application_status === "applying" ||
          applicants[0]?.application_status === "denied") && (
          <Button
            variant="destructive"
            className="h-fit py-1 text-sm lg:text-base"
            onClick={() => {
              setDialogState("delete");
              setOpen(true);
            }}
          >
            Delete All
          </Button>
        )}

        {applicants[0]?.application_status === "testing" && (
          <div className="flex items-center gap-3">
            <Button
              className="h-fit py-1 text-sm lg:text-base"
              onClick={() => {
                setDialogState("pass");
                setOpen(true);
              }}
            >
              Pass All
            </Button>
            <Button
              variant={"destructive"}
              className="h-fit py-1 text-sm lg:text-base"
              onClick={() => {
                setDialogState("fail");
                setOpen(true);
              }}
            >
              Fail All
            </Button>
          </div>
        )}

        {applicants[0]?.application_status === "onboarding" && (
          <div className="flex items-center gap-3">
            <Button
              className="h-fit py-1 text-sm lg:text-base"
              onClick={() => {
                setDialogState("accept");
                setOpen(true);
              }}
            >
              Accept All
            </Button>
            <Button
              variant={"destructive"}
              className="h-fit py-1 text-sm lg:text-base"
              onClick={() => {
                setDialogState("deny");
                setOpen(true);
              }}
            >
              Deny All
            </Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "p-0 text-gray-400 hover:text-gray-300",
                applicants.length <= 0 && "invisible",
              )}
            >
              <span className="sr-only">More actions</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-dark-200 min-w-[160px] bg-white"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {applicants[0]?.application_status !== "applying" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("applying");
                  setOpen(true);
                }}
              >
                Move All to Applying
              </DropdownMenuItem>
            )}
            {applicants[0]?.application_status !== "testing" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("testing");
                  setOpen(true);
                }}
              >
                Move All to Testing
              </DropdownMenuItem>
            )}
            {applicants[0]?.application_status !== "onboarding" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("onboarding");
                  setOpen(true);
                }}
              >
                Move All to Onboarding
              </DropdownMenuItem>
            )}
            {applicants[0]?.application_status !== "denied" && (
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={() => {
                  setDialogState("denied");
                  setOpen(true);
                }}
              >
                Move All to Denied
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            {applicants[0]?.application_status === "testing" && (
              <div className="block cursor-pointer sm:hidden">
                <DropdownMenuItem
                  onClick={() => {
                    setDialogState("pass");
                    setOpen(true);
                  }}
                >
                  Pass All
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setDialogState("fail");
                    setOpen(true);
                  }}
                >
                  Fail All
                </DropdownMenuItem>
              </div>
            )}

            {applicants[0]?.application_status === "onboarding" && (
              <div className="block cursor-pointer sm:hidden">
                <DropdownMenuItem
                  onClick={() => {
                    setDialogState("accept");
                    setOpen(true);
                  }}
                >
                  Accept All
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setDialogState("deny");
                    setOpen(true);
                  }}
                >
                  Deny All
                </DropdownMenuItem>
              </div>
            )}

            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={() => {
                setDialogState("delete");
                setOpen(true);
              }}
            >
              Delete All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {dialogState === "applying" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Move All to Applying</h2>
              <p>
                Are you sure you want to move all selected applicants to
                applying?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToApplying} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "testing" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Move All to Testing</h2>
              <p>
                Are you sure you want to move all selected applicants to
                testing?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToTesting} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "onboarding" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Move to Onboarding</h2>
              <p>
                Are you sure you want to move all selected applicants to
                Onboarding?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToOnboarding} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "denied" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Move to Denied</h2>
              <p>
                Are you sure you want to move all selected applicants to Denied?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "pass" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Pass All</h2>
              <p>Are you sure you want to pass all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePassAll} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Pass
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "fail" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Fail All</h2>
              <p>Are you sure you want to fail all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Fail
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "accept" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Accept All</h2>
              <p>Are you sure you want to accept all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAcceptAll} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Accept
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "deny" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Deny All</h2>
              <p>Are you sure you want to deny all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Deny
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "delete" && (
          <DialogContent>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Deny All</h2>
              <p>Are you sure you want to delete all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
