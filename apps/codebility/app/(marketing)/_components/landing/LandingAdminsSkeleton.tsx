"use client";

import { Skeleton } from "@/components/ui/skeleton/skeleton";

import { ADMINS_SECTION_COPY } from "../../_lib/constants";
import BlueBg from "./LandingBlueBg";

const ADMIN_CARD_COUNT = 9;
const MENTOR_CARD_COUNT = 8;

function AdminCardSkeleton() {
  return (
    <div className="h-full" aria-hidden="true">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-800">
          <Skeleton className="absolute inset-0 h-full w-full rounded-lg bg-white/10" />
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="md:text-md invisible text-sm font-medium text-white lg:text-lg">
            Member Name
          </p>
          <div className="min-h-[2.5rem]">
            <p className="invisible text-sm text-gray-300 lg:text-base">
              Team Lead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminsSectionSkeleton({
  title,
  description,
  cardCount,
}: {
  title: string;
  description: string;
  cardCount: number;
}) {
  return (
    <div aria-hidden="true">
      <h1 className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent">
        {title}
      </h1>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center text-gray-300 md:px-44">{description}</p>

          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {Array.from({ length: cardCount }).map((_, index) => (
              <div key={index} className="relative h-full">
                <AdminCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingAdminsSkeleton() {
  return (
    <div aria-hidden="true">
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
