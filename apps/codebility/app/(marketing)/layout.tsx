import { ModalProviderMarketing } from "@/providers/marketing/ModalProviderMarketing";
import Footer from "@/components/marketing/MarketingFooter";
import Navigation from "@/components/global/marketing/MarketingNavigation";
import SideNavMenu from "@/components/marketing/MarketingSidenavMenu";
import { getSiteDate } from "@/lib/global/site-date";
import type { MarketingLayoutProps } from "@/types/marketing/marketing";

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const { year } = getSiteDate();

  return (
      <main className="bg-black-400 relative w-full overflow-x-hidden">
        <Navigation />
        <SideNavMenu />
        {children}
        <Footer year={year} />
        <ModalProviderMarketing />
      </main>
  );
}