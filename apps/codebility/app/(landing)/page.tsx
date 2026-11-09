import type { Metadata } from "next";

import { LandingCommunity } from "@/components/landing/LandingCommunity";
import { LandingContact } from "@/components/landing/LandingContact";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNumbers } from "@/components/landing/LandingNumbers";
import { LandingPartners } from "@/components/landing/LandingPartners";
import { LandingPeople } from "@/components/landing/LandingPeople";
import { LandingProcess } from "@/components/landing/LandingProcess";
import { LandingServices } from "@/components/landing/LandingServices";
import { LandingStories } from "@/components/landing/LandingStories";
import { getCachedHeroCodevs } from "@/lib/landing/hero-codevs";
import type { LandingSearchParams } from "@/types/landing/hero-codevs";

export const metadata: Metadata = {
  title: "Codebility — Hire Skilled Filipino Developers",
  description:
    "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
  alternates: { canonical: "https://www.codebility.tech" },
  openGraph: {
    title: "Codebility — Hire Skilled Filipino Developers",
    description:
      "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
    url: "https://www.codebility.tech",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codebility — Hire Skilled Filipino Developers",
    description:
      "Codebility connects you with vetted Filipino software developers.",
    images: ["/og-image.jpg"],
  },
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: LandingSearchParams;
}) {
  const codevs = await getCachedHeroCodevs();

  return (
    <>
      <LandingHero codevs={codevs} searchParams={searchParams} />
      <LandingPartners />
      <LandingServices />
      <LandingNumbers />
      <LandingProcess />
      <LandingPeople searchParams={searchParams} />
      <LandingStories />
      <LandingFaq />
      <LandingCommunity codevs={codevs} />
      <LandingContact />
    </>
  );
}
