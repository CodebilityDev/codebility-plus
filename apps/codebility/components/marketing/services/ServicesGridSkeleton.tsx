import { ServicesServiceCardSkeleton } from "@/components/marketing/services/ServicesServiceCardSkeleton";
import { GRID_CLASS } from "@/constants/marketing/services/services";


export function ServicesGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={GRID_CLASS} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="aspect-square w-full">
          <ServicesServiceCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export { GRID_CLASS as servicesProjectsGridClass };
