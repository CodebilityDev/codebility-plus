import type { Metadata } from "next";

import DesignSystemPage from "@/components/design-system/DesignSystemPage";

export const metadata: Metadata = {
  title: "Design System v2.0 · Codebility",
  description:
    "The Codebility design system: color, gradients, typography, components and rules for the public site.",
  alternates: { canonical: "https://www.codebility.tech/design-system" },
  openGraph: {
    title: "Design System v2.0 · Codebility",
    description:
      "The Codebility design system: color, gradients, typography, components and rules for the public site.",
    url: "https://www.codebility.tech/design-system",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility" },
    ],
  },
};

export default function DesignSystem() {
  return <DesignSystemPage />;
}
