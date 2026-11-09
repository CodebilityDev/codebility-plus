import Link from "next/link";

import { cn } from "@codevs/ui";
import { IconButton } from "@/components/global/design-system/IconButton";
import { MenuGlyph } from "@/components/global/design-system/MenuGlyph";
import { Wordmark } from "@/components/global/design-system/Wordmark";

export interface NavigationMobileProps {
  logoHref?: string;
  onMenuClick?: () => void;
  menuLabel?: string;
  className?: string;
}

function NavigationMobile({
  logoHref = "/",
  onMenuClick,
  menuLabel = "Open menu",
  className,
}: NavigationMobileProps) {
  return (
    <nav
      aria-label="Main"
      className={cn(
        "flex h-[var(--cb-size-72)] w-full items-center gap-[var(--cb-space-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)]",
        className,
      )}
    >
      <Link
        href={logoHref}
        className="shrink-0 rounded-[var(--cb-radius-full)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]"
      >
        <Wordmark width={140} />
      </Link>

      <IconButton
        className="ml-auto h-[var(--cb-size-44)] w-[var(--cb-size-44)]"
        variant="outline"
        label={menuLabel}
        onClick={onMenuClick}
      >
        <MenuGlyph />
      </IconButton>
    </nav>
  );
}

export { NavigationMobile };
