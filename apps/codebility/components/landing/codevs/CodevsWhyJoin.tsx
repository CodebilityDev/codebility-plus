import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { FeatureCard } from "@/components/global/design-system/FeatureCard";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { SkillCategoryCard } from "@/components/global/design-system/SkillCategoryCard";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { benefits, tracks } from "@/constants/landing/codevs/codevs-content";

function CodevsWhyJoin() {
  return (
    <section
      id="why-join"
      className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-[112px]"
    >
      <LandingContainer>
        <SectionHeader
          align="center"
          eyebrowVariant="outline"
          eyebrow="WHY JOIN"
          eyebrowClassName="tracking-[0.24em]"
          title={
            <>
              Experience employers{" "}
              <span className="cb-accent-text">actually value</span>
            </>
          }
          description="You bring the willingness to learn. We bring the projects, mentors and team."
          className="[&_p]:max-w-[64ch]"
        />

        <div className="mt-[var(--cb-space-56)] grid grid-cols-1 gap-[var(--cb-space-20)] md:grid-cols-2 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2">
          <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-[22rem] w-[30rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_0%,transparent_70%)]"
            />
            <div className="relative">
              <Eyebrow variant="outline" className="tracking-[0.24em]">
                TRACKS
              </Eyebrow>
              <h3 className="mt-[var(--cb-space-16)] text-2xl font-semibold leading-[30px] text-[color:var(--cb-text)]">
                Pick your craft
              </h3>
              <p className="mt-[var(--cb-space-16)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                Join a team in the area you want to grow, and add more as you
                level up.
              </p>

              <ul className="mt-[var(--cb-space-32)] grid grid-cols-1 gap-[var(--cb-space-12)] sm:grid-cols-2">
                {tracks.map((track) => {
                  const Icon = track.icon;

                  return (
                    <li key={track.title} className="flex">
                      <SkillCategoryCard
                        icon={<Icon />}
                        title={track.title}
                        skills={track.skills}
                        tone="neutral"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <FeatureCard
                key={benefit.title}
                icon={<Icon aria-hidden />}
                iconVariant="tint"
                title={benefit.title}
                description={benefit.description}
                className="min-h-[220px]"
              />
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}

export { CodevsWhyJoin };
