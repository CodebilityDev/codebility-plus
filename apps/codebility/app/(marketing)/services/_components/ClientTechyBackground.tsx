"use client";

import dynamic from "next/dynamic";

const TechyBackground = dynamic(() => import("./TechyBackground"), {
  ssr: false,
});

export default function ClientTechyBackground() {
  return <TechyBackground />;
}
