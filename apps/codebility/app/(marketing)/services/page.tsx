import { Metadata } from "next";

import { ServicesPageView } from "./_lib/ServicesPageView";

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

const ServicesPage = async () => {
  return <ServicesPageView />;
};

export default ServicesPage;
