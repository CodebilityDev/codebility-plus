import type { Metadata } from "next";
import { Suspense } from "react";

import { NotFoundContent } from "@/components/global/marketing/NotFoundContent";
import { LandingFooter } from "@/components/global/layout/LandingFooter";
import { LandingNavigation } from "@/components/global/layout/LandingNavigation";

export const metadata: Metadata = {
  title: "Page not found | Codebility",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f4]">
      <Suspense
        fallback={
          <div className="h-[var(--cb-size-64)] border-b border-[color:var(--cb-border)]" />
        }
      >
        <LandingNavigation />
      </Suspense>
      <main className="relative">
        <NotFoundContent />
      </main>
      <LandingFooter />
    </div>
  );
}
