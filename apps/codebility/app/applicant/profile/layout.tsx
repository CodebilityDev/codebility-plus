"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/global/codev-store";
import type { ApplicantProfileLayoutProps } from "@/types/applicant/profile/profile";

export default function ApplicantProfileLayout({
  children,
}: ApplicantProfileLayoutProps) {
  const { hydrate } = useUserStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <div>{children}</div>;
}
