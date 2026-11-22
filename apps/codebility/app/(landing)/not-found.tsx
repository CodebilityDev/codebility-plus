import type { Metadata } from "next";

import { NotFoundContent } from "@/components/global/marketing/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found | Codebility",
  robots: { index: false, follow: false },
};

export default function LandingNotFound() {
  return <NotFoundContent />;
}
