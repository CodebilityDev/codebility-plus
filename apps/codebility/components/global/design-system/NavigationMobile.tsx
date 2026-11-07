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
        "flex h-[72px] w-full items-center gap-4 border border-white/10 bg-[#0a0a0a] p-4",
        className,
      )}
    >
      <Link
        href={logoHref}
        className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
      >
        <Wordmark width={140} />
      </Link>

      <IconButton
        className="ml-auto h-11 w-11"
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
