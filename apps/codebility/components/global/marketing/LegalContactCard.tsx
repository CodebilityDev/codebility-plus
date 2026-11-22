import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/global/design-system/Button";

export function LegalContactCard({
  title,
  description,
  email,
  buttonLabel = "Email us",
}: {
  title: string;
  description: string;
  email: string;
  buttonLabel?: string;
}) {
  return (
    <div className="mt-[var(--cb-space-48)] flex flex-col gap-[var(--cb-space-20)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[linear-gradient(90deg,rgb(151_71_255/0.18),transparent_70%)] p-[var(--cb-space-24)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-[var(--cb-space-16)]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--cb-radius-12)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-accent-text)]">
          <Mail size={18} aria-hidden />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-[color:var(--cb-text-muted)]">
            {description}
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="w-fit">
        <a href={`mailto:${email}`}>
          {buttonLabel}
          <ArrowRight size={16} aria-hidden />
        </a>
      </Button>
    </div>
  );
}
