import type { Metadata } from "next";

import { TermsAndConditionsContent } from "@/components/landing/terms-and-conditions/TermsAndConditionsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | Codebility",
  description:
    "The terms that apply when you use Codebility's website and services.",
  alternates: { canonical: "https://www.codebility.tech/terms-and-conditions" },
  openGraph: {
    title: "Terms & Conditions | Codebility",
    description:
      "The terms that apply when you use Codebility's website and services.",
    url: "https://www.codebility.tech/terms-and-conditions",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebility Terms & Conditions",
      },
    ],
  },
};

export default function TermsAndConditions() {
  return <TermsAndConditionsContent />;
}
