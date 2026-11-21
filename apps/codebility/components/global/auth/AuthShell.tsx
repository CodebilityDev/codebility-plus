import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { AuthBrandPanel } from "@/components/global/auth/AuthBrandPanel";
import { Wordmark } from "@/components/global/design-system/Wordmark";

export type AuthBrandVariant = "signin" | "signup";

export interface AuthShellProps {
  children: ReactNode;
  brandVariant?: AuthBrandVariant;
  align?: "center" | "top";
  contentClassName?: string;
}

export function AuthShell({
  children,
  brandVariant = "signin",
  align = "center",
  contentClassName,
}: AuthShellProps) {
  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white lg:grid lg:grid-cols-2 lg:gap-4 lg:p-4">
      <div className="flex min-h-[100dvh] flex-col px-5 pb-6 pt-5 lg:min-h-[calc(100dvh-2rem)] lg:px-16 lg:py-8">
        <header className="flex shrink-0 items-center justify-between">
          <Link href="/" aria-label="Codebility home" className="w-fit">
            <Wordmark width={104} priority />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[14px] text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back to site
          </Link>
        </header>

        <main
          className={cn(
            "flex flex-1 py-10 lg:py-8",
            align === "top" ? "items-start" : "items-center",
          )}
        >
          <div
            className={cn(
              "mx-auto w-full",
              contentClassName ?? "max-w-[416px]",
            )}
          >
            {children}
          </div>
        </main>

        <footer className="flex shrink-0 items-center justify-center gap-5 text-[13px] text-white/45 lg:justify-start">
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-white/80"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="transition-colors hover:text-white/80"
          >
            Terms &amp; Conditions
          </Link>
        </footer>
      </div>

      <AuthBrandPanel
        variant={brandVariant}
        className="hidden lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-2rem)] lg:self-start"
      />
    </div>
  );
}
