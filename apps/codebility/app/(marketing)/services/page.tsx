import type { Metadata } from "next";

import Calendly from "@/components/global/marketing/MarketingCalendly";
import { ClientTechyBackground } from "@/components/marketing/services/ClientTechyBackground";
import { ServicesProjectsBlock } from "@/components/marketing/services/ServicesProjectsBlock";
import { Hero as ServicesHero } from "@/components/marketing/services/ServicesHero";
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <ClientTechyBackground />
      <div className="relative z-10">
        <ServicesHero />
        <ServicesProjectsBlock searchParams={searchParams} />
        <Calendly />
      </div>
    </div>
  );
};

export default ServicesPage;
