"use client";



import { ADMINS_SECTION_COPY } from "@/constants/marketing/admins-section-copy";
import { AdminsSectionSkeleton } from "@/components/marketing/AdminsSectionSkeleton";
import { ADMIN_CARD_COUNT, MENTOR_CARD_COUNT } from "@/constants/marketing/marketing";



export function LandingAdminsSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <AdminsSectionSkeleton
        title={ADMINS_SECTION_COPY.admins.title}
        description={ADMINS_SECTION_COPY.admins.description}
        cardCount={ADMIN_CARD_COUNT}
      />

      <div className="mt-20">
        <AdminsSectionSkeleton
          title={ADMINS_SECTION_COPY.mentors.title}
          description={ADMINS_SECTION_COPY.mentors.description}
          cardCount={MENTOR_CARD_COUNT}
        />
      </div>
    </div>
  );
}
