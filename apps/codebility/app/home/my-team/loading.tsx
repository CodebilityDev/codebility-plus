export default function MyTeamLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header skeleton */}
        <div className="mb-20 text-center">
          <div className="mb-6">
            <div className="mx-auto h-12 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
          </div>
          <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </div>
        
        {/* Team cards skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Project header skeleton */}
              <div className="mb-6">
                <div className="h-7 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
              </div>
              
              {/* Team lead skeleton */}
              <div className="mb-6">
                <div className="mb-3 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
                  <div>
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                    <div className="mt-1 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                  </div>
                </div>
              </div>
              
              {/* Members skeleton */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
                <div className="space-y-2 pt-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}