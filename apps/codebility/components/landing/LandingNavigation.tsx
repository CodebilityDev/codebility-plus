"use client";

import { X, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/global/design-system/Button";
import { IconButton } from "@/components/global/design-system/IconButton";
import { MenuGlyph } from "@/components/global/design-system/MenuGlyph";
import { NavItem } from "@/components/global/design-system/NavItem";
import { Wordmark } from "@/components/global/design-system/Wordmark";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { landingNavLinks } from "@/constants/landing/landing-content";

export function LandingNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/codevs?search=${encodeURIComponent(value)}` : "/codevs");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--cb-border)] bg-[color:color-mix(in_srgb,var(--cb-bg)_85%,transparent)] backdrop-blur-xl">
      <LandingContainer className="flex h-[var(--cb-size-64)] items-center gap-[var(--cb-space-16)]">
        <Link
          href="/"
          aria-label="Codebility home"
          className="shrink-0 rounded-[var(--cb-radius-full)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]"
        >
          <Wordmark width={170} priority />
        </Link>

        <nav
          aria-label="Primary"
          className="mx-auto hidden items-center gap-[var(--cb-space-4)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-4)] lg:flex"
        >
          {landingNavLinks.map((link) => (
            <NavItem
              key={link.href}
              asChild
              active={link.href === pathname}
            >
              <Link href={link.href}>{link.label}</Link>
            </NavItem>
          ))}
          <form
            onSubmit={handleSearch}
            className="ml-[var(--cb-space-4)] hidden h-[var(--cb-size-36)] w-[210px] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] px-[var(--cb-space-12)] focus-within:border-[color:var(--cb-primary)] focus-within:ring-2 focus-within:ring-[color:var(--cb-focus-glow)] xl:flex"
          >
            <Search className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-text-decorative)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search developers..."
              aria-label="Search developers"
              className="min-w-0 flex-1 bg-transparent text-xs text-[color:var(--cb-text)] outline-none placeholder:text-[color:var(--cb-text-muted)]"
            />
          </form>
        </nav>

        <div className="flex items-center gap-[var(--cb-space-8)]">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden lg:inline-flex"
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/bookacall">
              Book a Call
              <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </Button>

          <IconButton
            label={mobileOpen ? "Close menu" : "Open menu"}
            variant="outline"
            className="h-[var(--cb-size-44)] w-[var(--cb-size-44)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]" />
            ) : (
              <MenuGlyph />
            )}
          </IconButton>
        </div>
      </LandingContainer>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-[color:var(--cb-border)] bg-[color:var(--cb-bg)] lg:hidden">
          <LandingContainer className="flex flex-col gap-[var(--cb-space-16)] py-[var(--cb-space-16)]">
            <nav aria-label="Mobile" className="flex flex-col gap-[var(--cb-space-4)]">
              {landingNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-[var(--cb-size-44)] items-center rounded-[var(--cb-radius-full)] px-[var(--cb-space-16)] text-sm font-medium text-[color:var(--cb-text-secondary)] transition-colors hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form
              onSubmit={handleSearch}
              className="flex h-[var(--cb-size-44)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] px-[var(--cb-space-16)] focus-within:border-[color:var(--cb-primary)] focus-within:ring-2 focus-within:ring-[color:var(--cb-focus-glow)]"
            >
              <Search className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-text-decorative)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search developers..."
                aria-label="Search developers"
                className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--cb-text)] outline-none placeholder:text-[color:var(--cb-text-muted)]"
              />
            </form>
            <div className="grid grid-cols-2 gap-[var(--cb-space-8)]">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/bookacall">Book a Call</Link>
              </Button>
            </div>
          </LandingContainer>
        </div>
      ) : null}
    </header>
  );
}
