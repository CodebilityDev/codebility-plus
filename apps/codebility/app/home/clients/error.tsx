"use client";

import { useEffect } from "react";
import H1 from "@/components/shared/dashboard/H1";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="background-box text-dark100_light900 flex h-full w-full items-center justify-center rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <H1>Something went wrong!</H1>
        <Button onClick={() => reset()} className="w-max">
          Try again
        </Button>
      </div>
    </div>
  );
}
