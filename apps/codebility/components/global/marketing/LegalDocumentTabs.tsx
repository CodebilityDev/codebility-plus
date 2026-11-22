import Link from "next/link";

import { cn } from "@codevs/ui";

export type LegalDocument = "privacy" | "terms" | "faq";

const tabs = [
  { key: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { key: "terms", label: "Terms & Conditions", href: "/terms-and-conditions" },
  { key: "faq", label: "FAQs", href: "/faq" },
] satisfies { key: LegalDocument; label: string; href: string }[];

export function LegalDocumentTabs({
  active,
  className,
}: {
  active: LegalDocument;
  className?: string;
}) {
  return (
    <nav
      aria-label="Legal documents"
      className={cn(
        "inline-flex w-fit gap-[var(--cb-space-4)] rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] p-[var(--cb-space-4)]",
        className,
      )}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? "page" : undefined}
          className={
            tab.key === active
              ? "rounded-[var(--cb-radius-8)] bg-[color:var(--cb-selected-fill)] px-[var(--cb-space-16)] py-[var(--cb-space-8)] text-sm text-[color:var(--cb-text)]"
              : "rounded-[var(--cb-radius-8)] px-[var(--cb-space-16)] py-[var(--cb-space-8)] text-sm text-[color:var(--cb-text-muted)] transition-colors hover:text-[color:var(--cb-text)]"
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
