"use client";

import dynamic from "next/dynamic";

const TechyBackground = dynamic(
  () => import("@/components/marketing/services/TechyBackground").then((mod) => mod.TechyBackground),
  {
    ssr: false,
  },
);

export const ClientTechyBackground = () => {
  return <TechyBackground />;
};
