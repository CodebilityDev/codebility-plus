"use client";

import { Suspense } from "react";




import Calendly from "@/components/global/marketing/MarketingCalendly";
import { ServicesTab } from "@/components/marketing/services/ServicesTab";
import { Hero as ServicesHero } from "@/components/marketing/services/ServicesHero";
import { ServicesPageBody } from "@/components/marketing/services/ServicesPageBody";
import type { ServicesPageContentProps } from "@/types/marketing/services/services";



export const ServicesPageContent = ({ initialData, pageSize }: ServicesPageContentProps) => {
  return (
    <Suspense
      fallback={
        <>
          <ServicesHero />
          <ServicesTab
            initialData={initialData}
            category="all"
            pageSize={pageSize}
          />
          <Calendly />
        </>
      }
    >
      <ServicesPageBody initialData={initialData} pageSize={pageSize} />
    </Suspense>
  );
};
