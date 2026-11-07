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
        "flex h-[72px] w-full items-center gap-4 rounded-3xl border border-white/10 bg-[#0a0a0a] p-4",
        className,
      )}
    >
      <Link
        href={logoHref}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
      >
        <Wordmark width={140} />
      </Link>

      <div className="flex flex-1 items-center justify-center gap-1">
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
        className="hidden h-9 w-[200px] shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-50 xl:flex"
      >
        <Search className="h-4 w-4 shrink-0" />
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
