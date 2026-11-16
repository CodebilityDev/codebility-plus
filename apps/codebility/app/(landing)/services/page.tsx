import type { Metadata } from "next";
import { Suspense } from "react";

import { PortfolioBrowser } from "@/components/landing/services/PortfolioBrowser";
import { ServicesCta } from "@/components/landing/services/ServicesCta";
import { ServicesFeatured } from "@/components/landing/services/ServicesFeatured";
import { ServicesHero } from "@/components/landing/services/ServicesHero";
import { ServicesProof } from "@/components/landing/services/ServicesProof";
import {
  ServicesCtaSkeleton,
  ServicesFeaturedSkeleton,
  ServicesProofSkeleton,
} from "@/components/landing/services/ServicesSkeletons";
import { getCachedPortfolioData } from "@/lib/landing/services/data";

export const metadata: Metadata = {
  title: "Services | Codebility",
  description:
    "Web apps, mobile apps, AI tools and storefronts built by Codebility teams for clients around the world.",
  alternates: { canonical: "https://www.codebility.tech/services" },
  openGraph: {
    title: "Services | Codebility",
    description:
      "Products we've designed and shipped for clients around the world.",
    url: "https://www.codebility.tech/services",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility work" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Codebility",
    description:
      "Products we've designed and shipped for clients around the world.",
    images: ["/og-image.jpg"],
  },
};

interface ServicesPageProps {
  searchParams: Promise<{
    category?: string | string[];
    search?: string | string[];
  }>;
}

async function FeaturedContent() {
  const data = await getCachedPortfolioData();

  return (
    <ServicesFeatured project={data.featured} secondary={data.secondary} />
  );
}

async function ProofContent() {
  const data = await getCachedPortfolioData();

  return <ServicesProof data={data} />;
}

async function CtaContent() {
  const data = await getCachedPortfolioData();

  return <ServicesCta data={data} />;
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  return (
    <>
      <ServicesHero />
      <Suspense fallback={<ServicesFeaturedSkeleton />}>
        <FeaturedContent />
      </Suspense>
      <PortfolioBrowser searchParams={searchParams} />
      <Suspense fallback={<ServicesProofSkeleton />}>
        <ProofContent />
      </Suspense>
      <Suspense fallback={<ServicesCtaSkeleton />}>
        <CtaContent />
      </Suspense>
    </>
  );
}
