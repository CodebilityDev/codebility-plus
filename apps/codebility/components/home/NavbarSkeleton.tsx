import { Skeleton } from "@codevs/ui/skeleton";

export default function NavbarSkeleton() {
  return (
    <nav
      aria-busy="true"
      aria-label="Loading navigation bar"
      className="fixed top-0 z-20 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
      role="banner"
    >
      <div className="flex w-full min-w-full items-center justify-end px-8 py-2">
        <div className="flex items-center gap-4" aria-hidden="true">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </nav>
  );
}
