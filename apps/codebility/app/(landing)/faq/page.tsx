import type { Metadata } from "next";

import { FaqDirectory } from "@/components/landing/faq/FaqDirectory";

export const metadata: Metadata = {
  title: "FAQ | Codebility",
  description:
    "Answers about hiring CoDevs, joining the community and working with Codebility.",
  alternates: { canonical: "https://www.codebility.tech/faq" },
};

export default function FaqPage() {
  return <FaqDirectory />;
}
