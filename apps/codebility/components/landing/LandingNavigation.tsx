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
import { LandingContainer } from "@/components/landing/LandingContainer";
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030303]/85 backdrop-blur-xl">
      <LandingContainer className="flex h-16 items-center gap-4">
        <Link
          href="/"
          aria-label="Codebility home"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
        >
          <Wordmark width={170} priority />
        </Link>

        <nav
          aria-label="Primary"
          className="mx-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:flex"
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
            className="ml-1 hidden h-9 w-[210px] items-center gap-2 rounded-full px-3 focus-within:border-[#9747ff] focus-within:ring-2 focus-within:ring-[#9747ff]/20 xl:flex"
          >
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search developers..."
              aria-label="Search developers"
              className="min-w-0 flex-1 bg-transparent text-xs text-[#f4f4f4] outline-none placeholder:text-white/50"
            />
          </form>
        </nav>

        <div className="flex items-center gap-2">
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
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <IconButton
            label={mobileOpen ? "Close menu" : "Open menu"}
            variant="outline"
            className="h-11 w-11 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <MenuGlyph />
            )}
          </IconButton>
        </div>
      </LandingContainer>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-white/10 bg-[#030303] lg:hidden">
          <LandingContainer className="flex flex-col gap-4 py-4">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {landingNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center rounded-full px-4 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form
              onSubmit={handleSearch}
              className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 focus-within:border-[#9747ff] focus-within:ring-2 focus-within:ring-[#9747ff]/20"
            >
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search developers..."
                aria-label="Search developers"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#f4f4f4] outline-none placeholder:text-white/50"
              />
            </form>
            <div className="grid grid-cols-2 gap-2">
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
