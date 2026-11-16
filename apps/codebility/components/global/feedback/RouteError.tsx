"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import ErrorPanel from "@/components/global/feedback/ErrorPanel";
import { reportError } from "@/lib/global/error-reporting";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function RouteError({ error, retry }: RouteErrorProps) {
  const pathname = usePathname();

  useEffect(() => {
    reportError(error, {
      source: "boundary",
      boundary: "route",
      route: pathname,
      digest: error.digest,
    });
  }, [error, pathname]);

  return <ErrorPanel digest={error.digest} retry={retry} />;
}
