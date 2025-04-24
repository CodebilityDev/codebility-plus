"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/codev-store";

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
