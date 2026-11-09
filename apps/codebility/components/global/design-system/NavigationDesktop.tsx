import Link from "next/link";
import { Search } from "lucide-react";

import { cn } from "@codevs/ui";
import { Button } from "@/components/global/design-system/Button";
import { NavItem } from "@/components/global/design-system/NavItem";
import { Wordmark } from "@/components/global/design-system/Wordmark";

export interface NavigationDesktopProps {
  links: { label: string; href: string }[];
  activeHref?: string;
  searchPlaceholder?: string;
  onSearch?: () => void;
  signInHref?: string;
  signInLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
  logoHref?: string;
  className?: string;
}

function NavigationDesktop({
  links,
  activeHref,
  searchPlaceholder = "Search developers...",
  onSearch,
  signInHref = "/auth/sign-in",
  signInLabel = "Sign in",
  ctaHref = "/bookacall",
  ctaLabel = "Book a Call",
  logoHref = "/",
  className,
}: NavigationDesktopProps) {
  return (
    <nav
      aria-label="Main"
      className={cn(
        "flex h-[var(--cb-size-72)] w-full items-center gap-[var(--cb-space-16)] rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)]",
        className,
      )}
    >
      <Link
        href={logoHref}
        className="shrink-0 rounded-[var(--cb-radius-full)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]"
      >
        <Wordmark width={140} />
      </Link>

      <div className="flex flex-1 items-center justify-center gap-[var(--cb-space-4)]">
        {links.map((link) => (
          <NavItem
            key={`${link.href}-${link.label}`}
            asChild
            active={link.href === activeHref}
          >
            <Link href={link.href}>{link.label}</Link>
          </NavItem>
        ))}
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="hidden h-[var(--cb-size-36)] w-[var(--cb-size-200)] shrink-0 items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] px-[var(--cb-space-12)] text-xs text-[color:var(--cb-text-muted)] transition-colors hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50 xl:flex"
      >
        <Search className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0" />
        <span className="truncate">{searchPlaceholder}</span>
      </button>

      <Button asChild variant="ghost" size="sm">
        <Link href={signInHref}>{signInLabel}</Link>
      </Button>

      <Button asChild variant="primary" size="sm">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </nav>
  );
}

export { NavigationDesktop };
