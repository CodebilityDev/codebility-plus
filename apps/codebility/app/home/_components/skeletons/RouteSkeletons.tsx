import Box from "@/components/shared/dashboard/Box";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

/**
 * Shared route skeletons. Four shapes cover all 20 routes that lacked a
 * `loading.tsx`, so each route needs only a three-line file rather than a
 * bespoke skeleton. Server components: no "use client", no effects.
 */

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-4">
    {children}
  </div>
);

/** Header bar + 8 table rows. Tables and list views. */
export const ListSkeleton = () => (
  <Shell>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-4 w-72 rounded-lg" />
    </div>
    <Box className="flex flex-col gap-3">
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded-lg" />
            <Skeleton className="hidden h-4 w-32 rounded-lg sm:block" />
            <Skeleton className="hidden h-4 w-24 rounded-lg md:block" />
            <Skeleton className="h-8 w-16 shrink-0 rounded-lg" />
          </div>
        ))}
    </Box>
  </Shell>
);

/** Title + 6 labelled field blocks. Forms and detail/edit panes. */
export const FormSkeleton = () => (
  <Shell>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-56 rounded-lg" />
      <Skeleton className="h-4 w-80 rounded-lg" />
    </div>
    <Box className="flex flex-col gap-6">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </Box>
  </Shell>
);

/** Responsive grid of 6 cards. Feed and gallery views. */
export const CardsSkeleton = () => (
  <Shell>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-4 w-72 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <Box key={i} className="flex flex-col gap-2">
            <Skeleton className="mb-2 aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </Box>
        ))}
    </div>
  </Shell>
);

/** Sidebar column + main pane. Master/detail routes. */
export const DetailSkeleton = () => (
  <Shell>
    <Skeleton className="h-8 w-56 rounded-lg" />
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="lg:basis-1/3">
        <Box className="flex flex-col gap-3">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="mt-2 h-10 w-full rounded-lg" />
        </Box>
      </div>
      <div className="flex flex-col gap-4 lg:basis-2/3">
        <Box className="flex flex-col gap-3">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </Box>
        <Box className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </Box>
      </div>
    </div>
  </Shell>
);
