"use client";

import dynamic from "next/dynamic";

const IsAndIsntSection = dynamic(
  () => import("./_components/IsAndIsnt/IsAndIsntSection"),
  { ssr: false },
);

export default function IsAndIsntSectionWrapper() {
  return <IsAndIsntSection />;
}
