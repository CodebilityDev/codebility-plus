import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { CareersApplication } from "@/components/landing/careers/CareersApplication";
import { CareersFaq } from "@/components/landing/careers/CareersFaq";
import { CareersHero } from "@/components/landing/careers/CareersHero";
import {
  CareersApplicationData,
  CareersJobs,
} from "@/components/landing/careers/CareersJobs";
import { CareersListings } from "@/components/landing/careers/CareersListings";
import {
  CareersImpact,
  CareersInvitation,
  CareersProcess,
} from "@/components/landing/careers/CareersSections";
import { CareersProvider } from "@/providers/landing/careers/CareersProvider";

import "@/styles/landing/careers/careers.css";

export const metadata: Metadata = {
  title: "Careers — Work on products clients actually ship | Codebility",
  description:
    "Find paid and contract roles with Codebility and our partner companies. Remote-first, with teams across the Philippines and clients worldwide.",
  alternates: { canonical: "https://www.codebility.tech/careers" },
  openGraph: {
    title: "Careers at Codebility",
    description:
      "Work on products clients actually ship. Explore open roles and apply.",
    url: "https://www.codebility.tech/careers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebility Careers",
      },
    ],
  },
};

export default function Careers({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CareersProvider>
      <div className="careers-page">
        <CareersHero />
        <section id="open-positions" className="careers-section scroll-mt-24">
          <div className="careers-container">
            <div className="careers-jobs-heading">
              <div>
                <Eyebrow variant="outline">Open positions</Eyebrow>
                <h2>
                  Find your <span className="cb-accent-text">next role</span>
                </h2>
              </div>
              <p>
                Paid and contract roles. Looking for mentorship
                <br className="hidden md:block" /> instead?{" "}
                <Link href="/auth/sign-up">Join as a CoDev →</Link>
              </p>
            </div>
            <Suspense fallback={<CareersListings jobs={null} />}>
              <CareersJobs searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
        <CareersImpact />
        <CareersProcess />
        <section
          id="apply"
          className="careers-section careers-apply scroll-mt-24"
        >
          <Suspense fallback={<CareersApplication jobs={null} />}>
            <CareersApplicationData />
          </Suspense>
        </section>
        <CareersFaq />
        <CareersInvitation />
      </div>
    </CareersProvider>
  );
}
