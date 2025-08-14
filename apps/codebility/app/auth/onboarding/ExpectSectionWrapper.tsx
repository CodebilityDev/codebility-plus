"use client";

import dynamic from "next/dynamic";

const ExpectSection = dynamic(
  () => import("./_components/Expect/ExpectSection"),
  {
    ssr: false,
  },
);

export default function ExpectSectionWrapper() {
  return <ExpectSection />;
}
