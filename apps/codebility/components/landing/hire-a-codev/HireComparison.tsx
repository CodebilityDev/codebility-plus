import { Check, Minus, X } from "lucide-react";

import { Wordmark } from "@/components/global/design-system/Wordmark";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import {
  hireComparisonRows,
} from "@/constants/landing/hire-a-codev/content";

function StatusIcon({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes") {
    return (
      <Check
        aria-hidden
        className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-success)]"
      />
    );
  }

  if (status === "no") {
    return (
      <X
        aria-hidden
        className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-pink)]"
      />
    );
  }

  return (
    <Minus
      aria-hidden
      className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-text-muted)]"
    />
  );
}

export function HireComparison() {
  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]">
      <HireContainer>
        <HireSectionHeading
          eyebrow="WHY CODEBILITY"
          title="The flexibility of freelancers,"
          accent="the support of a team"
        />

        <div className="mt-[var(--cb-space-56)] overflow-x-auto rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)]">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <caption className="sr-only">
              Codebility compared with freelance platforms and traditional
              agencies
            </caption>
            <thead>
              <tr className="border-b border-[color:var(--cb-border)]">
                <th className="w-[220px] p-[var(--cb-space-24)]" />
                <th className="border-x border-[color:color-mix(in_srgb,var(--cb-primary)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,transparent)] p-[var(--cb-space-24)] text-center">
                  <span className="inline-flex justify-center">
                    <Wordmark width={116} alt="Codebility" />
                  </span>
                </th>
                <th className="p-[var(--cb-space-24)] text-sm font-medium leading-5 text-[color:var(--cb-text-muted)]">
                  Freelance platform
                </th>
                <th className="p-[var(--cb-space-24)] text-sm font-medium leading-5 text-[color:var(--cb-text-muted)]">
                  Traditional agency
                </th>
              </tr>
            </thead>
            <tbody>
              {hireComparisonRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-[color:var(--cb-border)] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="p-[var(--cb-space-24)] text-sm font-medium leading-5 text-[color:var(--cb-text-secondary)]"
                  >
                    {row.label}
                  </th>
                  <td className="border-x border-[color:color-mix(in_srgb,var(--cb-primary)_15%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_8%,transparent)] p-[var(--cb-space-24)]">
                    <span className="flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-secondary)]">
                      <StatusIcon status={row.codebility.status} />
                      {row.codebility.text}
                    </span>
                  </td>
                  <td className="p-[var(--cb-space-24)]">
                    <span className="flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                      <StatusIcon status={row.freelance.status} />
                      {row.freelance.text}
                    </span>
                  </td>
                  <td className="p-[var(--cb-space-24)]">
                    <span className="flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                      <StatusIcon status={row.agency.status} />
                      {row.agency.text}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HireContainer>
    </section>
  );
}
