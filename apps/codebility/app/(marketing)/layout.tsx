"use server";

import { ModalProviderMarketing } from "@/components/providers/modal-provider-marketing";
import Footer from "./_components/MarketingFooter";
import Navigation from "./_components/MarketingNavigation";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="bg-black-400 relative w-full overflow-x-hidden">
        <Navigation />
        {children}
        <Footer />
        <ModalProviderMarketing />
      </main>
  );
}
