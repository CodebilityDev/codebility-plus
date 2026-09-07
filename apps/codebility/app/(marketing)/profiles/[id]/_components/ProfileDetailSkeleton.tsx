import { Skeleton } from "@/components/ui/skeleton/skeleton";

function ProfileSidebarSkeleton() {
  return (
    <div
      className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8"
      aria-busy="true"
      aria-hidden="true"
    >
      <Skeleton className="h-[150px] w-[150px] rounded-full bg-white/10" />

      <p className="invisible text-center text-2xl capitalize lg:text-2xl">
        Developer Name Here
      </p>

      <div className="bg-darkgray rounded-lg px-4 py-2">
        <p className="invisible text-center text-lg capitalize">
          Full Stack Developer
        </p>
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
        <Skeleton className="h-10 w-10 rounded-lg bg-white/10" />
      </div>

      <Skeleton className="h-7 w-32 rounded-full bg-white/10" />

      <div className="flex min-h-[24px] items-center justify-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-6 w-6 rounded bg-white/10" />
        ))}
      </div>

      <div className="mt-4 w-full">
        <Skeleton className="mx-auto mb-4 h-7 w-24 rounded bg-white/10" />
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-6 rounded bg-white/10" />
          ))}
        </div>
      </div>

      <div className="mt-4 w-full">
        <Skeleton className="mx-auto mb-4 h-7 w-24 rounded bg-white/10" />
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="w-40 rounded-lg bg-black-100 p-4 text-center"
            >
              <Skeleton className="h-32 w-full rounded bg-white/10" />
              <Skeleton className="mx-auto mt-2 h-5 w-24 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileMainSkeleton() {
  return (
    <div
      className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8"
      aria-hidden="true"
    >
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded bg-white/10" />
          <Skeleton className="h-7 w-20 rounded bg-white/10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded bg-white/10" />
          <Skeleton className="h-4 w-11/12 rounded bg-white/10" />
          <Skeleton className="h-4 w-10/12 rounded bg-white/10" />
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-7 w-28 rounded bg-white/10" />
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="bg-black-100 mb-4 rounded-lg p-6">
            <Skeleton className="mb-2 h-5 w-48 rounded bg-white/10" />
            <Skeleton className="h-4 w-64 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-4 h-7 w-32 rounded bg-white/10" />
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="bg-black-100 mb-2 rounded-lg p-6">
            <Skeleton className="mb-2 h-5 w-40 rounded bg-white/10" />
            <Skeleton className="mb-2 h-4 w-56 rounded bg-white/10" />
            <Skeleton className="h-4 w-full rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileDetailSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
      <ProfileSidebarSkeleton />
      <ProfileMainSkeleton />
    </div>
  );
}

export function ProfileRatingSkeleton() {
  return (
    <div
      className="flex min-h-[24px] items-center justify-center gap-1"
      aria-busy="true"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-6 w-6 rounded bg-white/10" />
      ))}
    </div>
  );
}

export function ProfileProjectsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="mt-4 w-full" aria-busy="true" aria-hidden="true">
      <Skeleton className="mx-auto mb-4 h-7 w-24 rounded bg-white/10" />
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="w-40 rounded-lg bg-black-100 p-4 text-center"
          >
            <Skeleton className="h-32 w-full rounded bg-white/10" />
            <Skeleton className="mx-auto mt-2 h-5 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
