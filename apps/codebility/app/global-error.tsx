"use client";

import "@/styles/global/globals.css";

import ErrorPanel from "@/components/global/feedback/ErrorPanel";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorPanel digest={error.digest} retry={retry} fullscreen />
      </body>
    </html>
  );
}
