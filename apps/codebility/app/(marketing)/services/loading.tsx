import { Navigation } from "lucide-react";

import Calendly from "../_components/MarketingCalendly";
import Footer from "../_components/MarketingFooter";
import Hero from "./_components/ServicesHero";

export default function ServicesLoading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <Navigation />
      <Hero />
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
      <Calendly />
      <Footer />
    </div>
  );
}
