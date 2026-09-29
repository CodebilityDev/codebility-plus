"use client"

import H1 from "@/components/global/layout/H1";
import { Button } from "@/components/global/ui/button";
import { useEffect } from "react";
import type { ApplicantsErrorProps } from "@/types/home/applicants/applicants";

export default function ApplicantsError({ error, reset }: ApplicantsErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="background-box text-dark100_light_900 flex h-full items-center justify-center rounded-lg">
      <div className="flex flex-col items-center justify-center gap-4">
        <H1>Something went wrong!</H1>
        <Button variant="hollow" className="w-max" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
