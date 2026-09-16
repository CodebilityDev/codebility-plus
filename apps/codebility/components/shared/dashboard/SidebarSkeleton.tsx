import { Skeleton } from "@/components/ui/skeleton/skeleton";

/**
 * Placeholder for the sidebar's own Suspense boundary. Mirrors the real
 * `LeftSidebarClient` shell: fixed, 16rem open / 5rem closed, lg and up only.
 * Collapsed width is used so the streamed sidebar can only expand into space
 * that was already reserved.
 */
export function SidebarSkeleton() {
  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen flex-col gap-8 overflow-hidden border-r border-gray-200/50 bg-white/80 p-1 backdrop-blur-xl lg:flex dark:border-gray-800/50 dark:bg-gray-950/90"
      style={{ width: "5rem", minWidth: "5rem", maxWidth: "5rem" }}
      role="complementary"
      aria-label="Main navigation sidebar"
      aria-busy="true"
    >
      <div className="flex items-center justify-center px-4 pt-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-col items-center gap-3">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
      </div>
    </aside>
  );
}
