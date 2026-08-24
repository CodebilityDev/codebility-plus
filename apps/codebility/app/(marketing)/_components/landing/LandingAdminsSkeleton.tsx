"use client";

import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { cn } from "@codevs/ui";

import { ADMINS_SECTION_COPY } from "../../_lib/constants";
import BlueBg from "./LandingBlueBg";

const CARD_COUNT = 8;

function InlineSkeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-pulse rounded-md bg-white/10",
        className,
      )}
    />
  );
}

function AdminCardSkeleton() {
  return (
    <div className="h-full cursor-pointer" aria-hidden="true">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <Skeleton className="absolute inset-0 rounded-lg bg-white/10" />
        </div>

        <div className="flex w-full flex-col gap-1">
          <p className="relative md:text-md text-sm text-white lg:text-lg font-medium">
            <span className="invisible">Member Name</span>
            <InlineSkeleton className="mt-1 h-4 w-[75%]" />
          </p>

          <div className="min-h-[2.5rem]">
            <p className="relative text-gray-300 text-sm lg:text-base">
              <span className="invisible">Team Lead</span>
              <InlineSkeleton className="mt-1 h-4 w-[55%]" />
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
}: {
  title: string;
  description: string;
}) {
  return (
    <div aria-hidden="true">
      <h1 className="relative text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
        <span className="invisible">{title}</span>
        <InlineSkeleton className="absolute inset-0 mx-auto my-auto h-[2.25rem] w-[min(100%,14rem)]" />
      </h1>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="relative pt-8 text-center md:px-44 text-gray-300">
            <span className="invisible">{description}</span>
            <InlineSkeleton className="absolute inset-0 mx-auto my-auto h-[2.5rem] w-[min(100%,40rem)] rounded-md" />
          </p>

          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {Array.from({ length: CARD_COUNT }).map((_, index) => (
              <div key={index} className="h-full relative">
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
      />

      <div className="mt-20">
        <AdminsSectionSkeleton
          title={ADMINS_SECTION_COPY.mentors.title}
          description={ADMINS_SECTION_COPY.mentors.description}
        />
      </div>
    </div>
  );
}

