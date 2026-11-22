import type { Metadata } from "next";

import { FaqPageContent } from "@/components/landing/faq/FaqPageContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Codebility",
  description:
    "Answers about hiring CoDevs, joining the community and working with Codebility.",
  alternates: { canonical: "https://www.codebility.tech/faq" },
  openGraph: {
    title: "Frequently Asked Questions | Codebility",
    description:
      "Answers about hiring CoDevs, joining the community and working with Codebility.",
    url: "https://www.codebility.tech/faq",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebility Frequently Asked Questions",
      },
    ],
  },
};

export default function FaqPage() {
  return <FaqPageContent />;
}
