import { Suspense } from "react";
import type { Metadata } from "next";

import { ServicesPageView } from "@/components/marketing/services/ServicesPageView";
import type { ServicesPageProps } from "@/types/marketing/services/services";

export const metadata: Metadata = {
  title: "Our Services — Web & App Development | Codebility",
  description:
    "From web apps to AI integration, Codebility delivers custom software solutions built by skilled Filipino developers.",
  alternates: { canonical: "https://www.codebility.tech/services" },
  openGraph: {
    title: "Our Services — Web & App Development | Codebility",
    description:
      "From web apps to AI integration, Codebility delivers custom software solutions built by skilled Filipino developers.",
    url: "https://www.codebility.tech/services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebility Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | Codebility",
    description:
      "Custom web, mobile, and AI solutions by vetted Filipino developers.",
    images: ["/og-image.jpg"],
  },
};

const ServicesPage = ({ searchParams }: ServicesPageProps) => {
  return (
    <Suspense fallback={null}>
      <ServicesPageView searchParams={searchParams} />
    </Suspense>
  );
};

export default ServicesPage;
