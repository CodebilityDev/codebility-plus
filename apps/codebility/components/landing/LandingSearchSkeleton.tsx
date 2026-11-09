const skeletonBlock =
  "rounded-[var(--cb-radius-4)] bg-[color:color-mix(in_srgb,var(--cb-text)_12%,transparent)]";

function LandingSearchSkeleton() {
  return (
    <div role="status" aria-label="Loading search results" className="w-full">
      <span className="sr-only">Loading search results</span>
      <div className="flex w-full flex-col gap-[var(--cb-space-24)]">
        <div className="flex animate-pulse items-end justify-between gap-[var(--cb-space-12)]">
          <div className="flex flex-col gap-[var(--cb-space-8)]">
            <div className={`h-7 w-40 ${skeletonBlock}`} />
            <div className={`h-5 w-56 ${skeletonBlock}`} />
          </div>
          <div className={`h-5 w-16 ${skeletonBlock}`} />
        </div>

        <div className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[148px] animate-pulse rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-16)]"
            >
              <div className="flex items-start gap-[var(--cb-space-12)]">
                <div className="h-[var(--cb-size-48)] w-[var(--cb-size-48)] shrink-0 rounded-full bg-[color:color-mix(in_srgb,var(--cb-text)_12%,transparent)]" />
                <div className="flex min-w-0 flex-1 flex-col gap-[var(--cb-space-8)] pt-[var(--cb-space-4)]">
                  <div className={`h-3.5 w-32 ${skeletonBlock}`} />
                  <div className={`h-3 w-24 ${skeletonBlock}`} />
                </div>
              </div>
              <div className="mt-[var(--cb-space-20)] flex gap-[var(--cb-space-8)]">
                <div className={`h-6 w-20 ${skeletonBlock}`} />
                <div className={`h-6 w-20 ${skeletonBlock}`} />
                <div className={`h-6 w-20 ${skeletonBlock}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { LandingSearchSkeleton };
