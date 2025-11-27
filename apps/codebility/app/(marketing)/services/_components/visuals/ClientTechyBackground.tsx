"use client";

import dynamic from "next/dynamic";

const TechyBackground = dynamic(
  () => import("./TechyBackground").then((mod) => mod.TechyBackground),
  {
    ssr: false,
  },
);

export const ClientTechyBackground = () => {
  return <TechyBackground />;
};
