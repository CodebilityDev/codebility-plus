import Calendly from "@/components/global/marketing/MarketingCalendly";
import { ServicesTab } from "@/components/marketing/services/ServicesTab";
import { Hero as ServicesHero } from "@/components/marketing/services/ServicesHero";
import { ServicesDetailModalSlot } from "@/components/marketing/services/ServicesDetailModalSlot";
import type { ServicesCategorySlug } from "@/types/global/constants";
import type { ServicesPageContentProps } from "@/types/marketing/services/services";

export const ServicesPageContent = ({
  initialData,
  pageSize,
  projectId,
}: ServicesPageContentProps) => {
  return (
    <>
      <ServicesHero />
      <ServicesTab
        initialData={initialData}
        category={initialData.category as ServicesCategorySlug}
        pageSize={pageSize}
      />
      <Calendly />
      <ServicesDetailModalSlot projectId={projectId} />
    </>
  );
};