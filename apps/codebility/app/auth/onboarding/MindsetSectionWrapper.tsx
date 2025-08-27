"use client";

import dynamic from "next/dynamic";

const MindsetSection = dynamic(
  () => import("./_components/Mindset/MindsetSection"),
  {
    ssr: false,
  },
);

export default function MindsetSectionWrapper() {
  return <MindsetSection />;
}
