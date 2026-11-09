import { HeroDeveloperCard } from "@/components/landing/HeroDeveloperCard";
import { LandingSearchClear } from "@/components/landing/LandingSearchClear";
import { LandingSearchPagination } from "@/components/landing/LandingSearchPagination";
import { searchHeroCodevs } from "@/lib/landing/hero-codevs";

interface LandingSearchResultsProps {
  query: string;
  page: number;
}

async function LandingSearchResults({
  query,
  page,
}: LandingSearchResultsProps) {
  const result = await searchHeroCodevs(query, page);
  const hasResults = result.codevs.length > 0;

  return (
    <section
      aria-label="Developer search results"
      aria-live="polite"
      className="w-full"
    >
      <div className="flex w-full flex-col gap-[var(--cb-space-24)]">
        <div className="flex flex-wrap items-end justify-between gap-[var(--cb-space-12)]">
          <div className="flex flex-col gap-[var(--cb-space-4)]">
            <p className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
              Search results
            </p>
            <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
              {hasResults
                ? `CoDevs matching "${result.query}"`
                : `No CoDevs matched "${result.query}"`}
            </p>
          </div>
          {result.total > 0 ? (
            <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
              {result.total} found
            </p>
          ) : null}
        </div>

        {hasResults ? (
          <>
            <div className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4">
              {result.codevs.map((codev) => (
                <HeroDeveloperCard key={codev.id} codev={codev} />
              ))}
            </div>
            {result.totalPages > 1 ? (
              <LandingSearchPagination
                query={result.query}
                page={result.page}
                totalPages={result.totalPages}
              />
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] px-[var(--cb-space-24)] py-[var(--cb-space-32)] text-center">
            <p className="text-sm text-[color:var(--cb-text-muted)]">
              No CoDevs found for &quot;{result.query}&quot;.
            </p>
            <LandingSearchClear />
          </div>
        )}
      </div>
    </section>
  );
}

export { LandingSearchResults };
