import { Search } from "@/components/global/design-system/Search";
import { heroTags } from "@/constants/landing/landing-content";

function HeroSearchShell() {
  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-[var(--cb-space-24)]">
      <Search
        placeholder="Search by skill: React, Flutter, UI/UX..."
        buttonLabel="Find developers"
        inputAriaLabel="Search developers by skill"
        iconOnlyOnMobile
        className="w-full"
      />
      <div className="flex flex-wrap items-center justify-center gap-[var(--cb-space-8)]">
        {heroTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-[var(--cb-size-32)] items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border-solid)] bg-[color:color-mix(in_srgb,var(--cb-bg)_25%,transparent)] px-[var(--cb-space-16)] text-xs text-[color:var(--cb-text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export { HeroSearchShell };
