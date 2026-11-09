function LandingPeopleGridSkeleton() {
  return (
    <div role="status" aria-label="Loading team members" className="w-full">
      <span className="sr-only">Loading team members</span>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-[var(--cb-space-24)] sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[360px] animate-pulse rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)]"
          />
        ))}
      </div>
    </div>
  );
}

export { LandingPeopleGridSkeleton };
