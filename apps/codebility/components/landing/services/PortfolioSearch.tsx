"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { usePortfolioNavigate } from "@/components/landing/services/PortfolioTransition";
import {
  normalizePortfolioCategory,
  portfolioHref,
} from "@/constants/landing/services/content";

function PortfolioSearchShell({
  value,
  onSubmit,
}: {
  value?: string;
  onSubmit?: (search: string) => void;
}) {
  return (
    <form
      action="/services"
      onSubmit={(event) => {
        if (!onSubmit) return;
        event.preventDefault();
        const input = event.currentTarget.elements.namedItem(
          "search",
        ) as HTMLInputElement | null;
        onSubmit(input?.value ?? "");
      }}
      className="flex h-[var(--cb-size-40)] w-full items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[#262626] bg-[#0F0F0F] px-[var(--cb-space-16)] focus-within:border-[color:var(--cb-primary)] focus-within:ring-2 focus-within:ring-[color:var(--cb-focus-glow)] lg:w-[325px]"
    >
      <Search
        aria-hidden
        className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-text-muted)]"
      />
      <input
        type="search"
        name="search"
        defaultValue={value}
        placeholder="Search projects..."
        aria-label="Search projects"
        className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-[color:var(--cb-text)] outline-none placeholder:text-[color:var(--cb-text-muted)]"
      />
    </form>
  );
}

export function PortfolioSearchFallback() {
  return <PortfolioSearchShell />;
}

export function PortfolioSearch() {
  const searchParams = useSearchParams();
  const navigate = usePortfolioNavigate();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  return (
    <PortfolioSearchShell
      value={value}
      onSubmit={(search) => {
        setValue(search);
        navigate(
          portfolioHref({
            category: normalizePortfolioCategory(searchParams.get("category")),
            search: search.trim() || undefined,
          }),
        );
      }}
    />
  );
}
