import { Skeleton } from "@/components/ui/skeleton/skeleton";

/**
 * Shown the instant a navigation to /home starts, so the route commits
 * immediately instead of waiting on the dashboard's server data.
 *
 * Mirrors the real layout in `DashboardContent`: a 60/40 split with the profile,
 * current project, points and roadmap stacked on the left, leaderboard right.
 */
const Loading = () => {
  return (
    <div className="w-full">
      <div className="relative mb-8 flex flex-col gap-4 pt-4">
        <div className="relative z-10 flex flex-col gap-6">
          {/* Header is static in page.tsx, but the shell still needs its space. */}
          <div className="mb-6 mt-3">
            <div className="mb-2 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64 rounded-lg" />
                <Skeleton className="h-4 w-80 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="md:basis-[50%] xl:basis-[60%]">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
            <div className="md:basis-[50%] xl:basis-[40%]">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
