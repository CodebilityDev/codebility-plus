"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Chip } from "@/components/global/design-system/Chip";
import { Search } from "@/components/global/design-system/Search";
import { heroTags } from "@/constants/landing/landing-content";

function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function goToResults(value: string) {
    const trimmed = value.trim();
    router.push(
      trimmed ? `/codevs?search=${encodeURIComponent(trimmed)}` : "/codevs",
    );
  }

  return (
    <div className="mx-auto mt-8 flex w-full max-w-[700px] flex-col items-center gap-5">
      <Search
        value={query}
        onValueChange={setQuery}
        onSearch={goToResults}
        placeholder="Search by skill: React, Flutter, UI/UX..."
        buttonLabel="Find developers"
        inputAriaLabel="Search developers by skill"
        className="w-full"
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {heroTags.map((tag) => (
          <Chip
            key={tag}
            selected={query.trim().toLowerCase() === tag.toLowerCase()}
            className="h-9 px-4"
            onClick={() => {
              setQuery(tag);
              goToResults(tag);
            }}
          >
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export { HeroSearch };
