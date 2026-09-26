import { ModalProviderMarketing } from "@/providers/marketing/ModalProviderMarketing";
import Footer from "@/components/marketing/MarketingFooter";
import Navigation from "@/components/global/marketing/MarketingNavigation";
import SideNavMenu from "@/components/marketing/MarketingSidenavMenu";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="bg-black-400 relative w-full overflow-x-hidden">
        <Navigation />
        <SideNavMenu />
        {children}
        <Footer />
        <ModalProviderMarketing />
      </main>
  );
}
