"use client";

import { useIsMounted } from "@/hooks/global/useIsMounted";
import { formatNdaDate } from "@/utils/global/date";

export function useFormattedDate() {
  const mounted = useIsMounted();
  return mounted ? formatNdaDate() : "";
}
