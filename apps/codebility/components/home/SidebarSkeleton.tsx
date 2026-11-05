import { Skeleton } from "@codevs/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <aside
      aria-busy="true"
      aria-label="Loading navigation"
      className="fixed left-0 top-0 z-40 hidden h-screen flex-col gap-8 overflow-hidden p-1 bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 lg:flex flex-shrink-0"
      style={{
        minWidth: "16rem",
        maxWidth: "16rem",
        width: "16rem",
      }}
    >
      <div className="flex items-center justify-center px-4 pt-2">
        <Skeleton className="h-8 w-40" />
      </div>
      <nav className="flex flex-col overflow-y-auto" aria-hidden="true">
        <div>
          <Skeleton className="ml-2 mt-4 h-3 w-16" />
          <ul className="mt-3 flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <div className="mt-2 flex items-center gap-4 rounded-sm px-4 py-4">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
