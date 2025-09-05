"use client";

import dynamic from "next/dynamic";

const IsNotSection = dynamic(() => import("./_components/IsNot/IsNotSection"), {
  ssr: false,
});

export default function IsNotSectionWrapper() {
  return <IsNotSection />;
}
