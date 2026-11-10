import type { Metadata } from "next";

import { HireComparison } from "@/components/landing/hire-a-codev/HireComparison";
import { HireCta } from "@/components/landing/hire-a-codev/HireCta";
import { HireFaq } from "@/components/landing/hire-a-codev/HireFaq";
import { HireHero } from "@/components/landing/hire-a-codev/HireHero";
import { HireLogos } from "@/components/landing/hire-a-codev/HireLogos";
import { HireModels } from "@/components/landing/hire-a-codev/HireModels";
import { HireProcess } from "@/components/landing/hire-a-codev/HireProcess";
import { HireStories } from "@/components/landing/hire-a-codev/HireStories";
import { HireTalentSection } from "@/components/landing/hire-a-codev/HireTalentSection";

export const metadata: Metadata = {
  title: "Hire Vetted Filipino Developers | Codebility",
  description:
    "Hire vetted Filipino developers, designers and QA through Codebility. Meet pre-screened CoDevs and build your team faster.",
  alternates: { canonical: "https://www.codebility.tech/hire-a-codev" },
  openGraph: {
    title: "Hire Vetted Filipino Developers | Codebility",
    description:
      "Meet pre-vetted Filipino engineers, designers and QA. Interview first, then build your team.",
    url: "https://www.codebility.tech/hire-a-codev",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Hire CoDevs" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Vetted Filipino Developers | Codebility",
    description: "Meet pre-vetted Filipino engineers, designers and QA.",
    images: ["/og-image.jpg"],
  },
};

export default function HireACodevPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string | string[];
    tech?: string | string[];
  }>;
}) {
  return (
    <>
      <HireHero />
      <HireLogos />
      <HireTalentSection searchParams={searchParams} />
      <HireProcess />
      <HireModels />
      <HireComparison />
      <HireStories />
      <HireFaq />
      <HireCta />
    </>
  );
}
