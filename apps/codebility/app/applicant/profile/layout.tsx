"use client";

import { useState } from "react";

import { useUserStore } from "@/store/global/codev-store";
import type { ApplicantProfileLayoutProps } from "@/types/applicant/profile/profile";

export default function ApplicantProfileLayout({
  children,
}: ApplicantProfileLayoutProps) {
  const hydrate = useUserStore((state) => state.hydrate);
  const [hydrated, setHydrated] = useState(false);

  if (!hydrated) {
    setHydrated(true);
    hydrate();
  }

  return <div>{children}</div>;
}
