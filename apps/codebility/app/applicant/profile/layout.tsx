"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/global/codev-store";

export default function ApplicantProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrate } = useUserStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <div>{children}</div>;
}
