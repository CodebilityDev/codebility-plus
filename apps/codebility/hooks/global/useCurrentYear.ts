"use client";

import { useIsMounted } from "@/hooks/global/useIsMounted";

export function useCurrentYear() {
  const mounted = useIsMounted();
  return mounted ? new Date().getFullYear() : null;
}
