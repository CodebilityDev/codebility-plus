import { Suspense } from "react";

import { ModalProviderMarketing } from "@/providers/marketing/ModalProviderMarketing";
import Footer from "@/components/marketing/MarketingFooter";
import Navigation from "@/components/global/marketing/MarketingNavigation";
import SideNavMenu from "@/components/marketing/MarketingSidenavMenu";
import { getSiteDate } from "@/lib/global/site-date";
import type { MarketingLayoutProps } from "@/types/marketing/marketing";

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { year } = await getSiteDate();

  return (
      <main className="bg-black-400 relative w-full overflow-x-hidden">
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        <SideNavMenu />
        {children}
        <Footer year={year} />
        <ModalProviderMarketing />
      </main>
  );
}
