import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import { hireProcessSteps } from "@/constants/landing/hire-a-codev/content";

export function HireProcess() {
  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]">
      <HireContainer>
        <HireSectionHeading
          eyebrow="HOW HIRING WORKS"
          title="From first call to"
          accent="first commit"
          description="Four steps. You stay in control of who joins your team."
        />

        <div className="relative mt-[var(--cb-space-72)]">
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-[19px] hidden h-px bg-[linear-gradient(90deg,color-mix(in_srgb,var(--cb-primary)_20%,transparent),var(--cb-primary),color-mix(in_srgb,var(--cb-primary)_20%,transparent))] lg:block"
          />

          <ol className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4">
            {hireProcessSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="relative flex flex-col items-center"
                >
                  <span
                    aria-hidden
                    className="relative z-10 flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-full)] border-[3px] border-[color:var(--cb-bg)] bg-[color:var(--cb-primary)] text-sm font-semibold text-[color:var(--cb-text)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--cb-primary)_55%,transparent),0_0_26px_color-mix(in_srgb,var(--cb-primary)_38%,transparent)]"
                  >
                    {index + 1}
                  </span>

                  <div className="mt-[var(--cb-space-32)] flex w-full flex-1 flex-col items-center rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)] text-center">
                    <span className="flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:color-mix(in_srgb,var(--cb-primary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,transparent)] text-[color:var(--cb-p300)]">
                      <Icon
                        aria-hidden
                        className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]"
                      />
                    </span>
                    <h3 className="mt-[var(--cb-space-16)] text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
                      {step.title}
                    </h3>
                    <p className="mt-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </HireContainer>
    </section>
  );
}
