import { ServicesGridSkeleton } from "@/components/marketing/services/ServicesGridSkeleton";
import { ServicesTabBar } from "@/components/marketing/services/ServicesTabBar";

export function ServicesProjectsFallback() {
  return (
    <>
      <ServicesTabBar active={null} />
      <ServicesGridSkeleton />
    </>
  );
}
