import type { ReactNode } from "react";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavigation } from "@/components/landing/LandingNavigation";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f4]">
      <LandingNavigation />
      <main className="relative">{children}</main>
      <LandingFooter />
    </div>
  );
}
