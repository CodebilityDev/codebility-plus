import { Mail } from "lucide-react";
import { LegalToc } from "@/components/global/marketing/LegalToc";
import type { LegalSidebarProps } from "@/types/global/legal-documents";

export function LegalSidebar({
  sections,
  contactEmail,
  contactDescription,
}: LegalSidebarProps) {
  return (
    <aside className="self-stretch" aria-label="Page navigation and contact">
      <div className="flex flex-col gap-[var(--cb-space-24)] lg:sticky lg:top-[var(--cb-space-96)] lg:max-h-[calc(100dvh-var(--cb-space-96)-var(--cb-space-24))] lg:overflow-y-auto">
        <LegalToc sections={sections} />
        <div className="hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)] lg:block">
          <p className="text-sm font-semibold text-[color:var(--cb-text)]">
            Questions?
          </p>
          <p className="mt-[var(--cb-space-4)] text-xs text-[color:var(--cb-text-muted)]">
            {contactDescription}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-[var(--cb-space-12)] inline-flex items-center gap-[var(--cb-space-8)] text-xs text-[color:var(--cb-link-text)] hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
          >
            <Mail size={14} aria-hidden />
            {contactEmail}
          </a>
        </div>
      </div>
    </aside>
  );
}
