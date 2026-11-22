import { Clock, FileText, ShieldCheck } from "lucide-react";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { LegalContactCard } from "@/components/global/marketing/LegalContactCard";
import { LegalDocumentTabs } from "@/components/global/marketing/LegalDocumentTabs";
import { LegalSidebar } from "@/components/global/marketing/LegalSidebar";
import {
  privacyContactEmail,
  privacySections,
} from "@/constants/landing/privacy-policy/privacy-policy-content";

const privacyLastUpdated = "2024-03";
const privacyLastUpdatedLabel = "March 2024";

const wordCount = privacySections
  .flatMap((section) => [
    section.summary,
    ...section.paragraphs,
    ...(section.items ?? []).map(
      (item) => `${item.title ?? ""} ${item.text}`,
    ),
  ])
  .join(" ")
  .split(/\s+/).length;

const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

export default function PrivacyPolicyContent() {
  return (
    <div className="bg-[color:var(--cb-bg)] text-[color:var(--cb-text)]">
      <section className="bg-[radial-gradient(ellipse_60%_100%_at_0%_0%,rgb(151_71_255/0.22),transparent_70%)]">
        <LandingContainer className="pb-[var(--cb-space-40)] pt-[var(--cb-space-56)] lg:pt-[var(--cb-space-72)]">
          <Eyebrow variant="outline" className="gap-[var(--cb-space-6)]">
            <ShieldCheck size={14} aria-hidden />
            Legal
          </Eyebrow>
          <h1 className="mt-[var(--cb-space-20)] text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-[var(--cb-space-16)] max-w-[640px] text-base text-[color:var(--cb-text-muted)] sm:text-lg">
            How Codebility collects, uses and protects your personal
            information.
          </p>
          <div className="mt-[var(--cb-space-32)] flex flex-col gap-[var(--cb-space-20)] border-b border-[color:var(--cb-border)] pb-[var(--cb-space-40)] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-[var(--cb-space-24)] gap-y-[var(--cb-space-8)] text-sm text-[color:var(--cb-text-muted)]">
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <Clock size={16} aria-hidden />
                Last updated{" "}
                <time dateTime={privacyLastUpdated}>
                  {privacyLastUpdatedLabel}
                </time>
              </span>
              <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                <FileText size={16} aria-hidden />
                {readMinutes} min read
              </span>
            </div>
            <LegalDocumentTabs active="privacy" />
          </div>
        </LandingContainer>
      </section>

      <LandingContainer className="pb-[var(--cb-space-96)]">
        <div className="grid gap-[var(--cb-space-48)] lg:grid-cols-[240px_minmax(0,720px)] lg:gap-[var(--cb-space-48)]">
          <LegalSidebar
            sections={privacySections}
            contactEmail={privacyContactEmail}
            contactDescription="Email us about anything in this policy."
          />

          <article
            className="pt-[var(--cb-space-40)]"
            aria-label="Privacy policy"
          >
            <div className="leading-7 text-[color:var(--cb-text-secondary)]">
              <p className="text-lg leading-7 text-[color:var(--cb-text)]">
                Thank you for choosing to be part of our community at Codebility
                (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;). We are committed to protecting your personal
                information and your right to privacy. If you have any questions
                or concerns about our policy or our practices with regard to your
                personal information, please contact us at{" "}
                <a
                  href={`mailto:${privacyContactEmail}`}
                  className="text-[color:var(--cb-link-text)] underline underline-offset-4 hover:text-[color:var(--cb-text)]"
                >
                  {privacyContactEmail}
                </a>
                . When you visit our website and use our services, you trust us
                with your personal information.
              </p>
              <p className="mt-[var(--cb-space-16)]">
                We take your privacy very seriously. In this privacy policy, we
                describe our privacy policy. We seek to explain to you in the
                clearest way possible what information we collect, how we use
                it, and what rights you have in relation to it. We hope you take
                some time to read through it carefully, as it is important. If
                there are any terms in this privacy policy that you do not agree
                with, please discontinue the use of our Sites and our services.
              </p>
              <p className="mt-[var(--cb-space-16)]">
                This privacy policy applies to all information collected through
                our website (
                <a
                  href="https://www.codebility.tech/"
                  className="text-[color:var(--cb-link-text)] underline underline-offset-4 hover:text-[color:var(--cb-text)]"
                >
                  https://www.codebility.tech/
                </a>
                ), and/or any related services, sales, marketing, or events (we
                refer to them collectively in this privacy policy as the
                &quot;Services&quot;).
              </p>
              <p className="mt-[var(--cb-space-16)]">
                Please read this privacy policy carefully as it will help you
                make informed decisions about sharing your personal information
                with us.
              </p>
            </div>

            {privacySections.map((section, index) => {
              const number = index + 1;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-title`}
                  className="mt-[var(--cb-space-40)] scroll-mt-24 border-t border-[color:var(--cb-border)] pt-[var(--cb-space-40)]"
                >
                  <h2
                    id={`${section.id}-title`}
                    className="flex items-baseline gap-[var(--cb-space-12)] text-2xl font-semibold tracking-[-0.01em]"
                  >
                    <span className="text-sm font-medium tabular-nums text-[color:var(--cb-accent-text)]">
                      {String(number).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="mt-[var(--cb-space-20)] flex gap-[var(--cb-space-12)] rounded-[var(--cb-radius-12)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] p-[var(--cb-space-16)] text-sm leading-6 text-[color:var(--cb-text-secondary)]">
                    <span className="shrink-0 font-semibold text-[color:var(--cb-accent-text)]">
                      In short:
                    </span>
                    <p>{section.summary}</p>
                  </div>
                  {section.subheading ? (
                    <h3 className="mt-[var(--cb-space-20)] text-base font-semibold text-[color:var(--cb-text)]">
                      {section.subheading}
                    </h3>
                  ) : null}
                  <div className="mt-[var(--cb-space-12)] flex flex-col gap-[var(--cb-space-12)] leading-7 text-[color:var(--cb-text-secondary)]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>
                        {paragraph}
                        {section.contact ? (
                          <>
                            {" "}
                            <a
                              href={`mailto:${privacyContactEmail}`}
                              className="text-[color:var(--cb-link-text)] underline underline-offset-4 hover:text-[color:var(--cb-text)]"
                            >
                              {privacyContactEmail}
                            </a>
                            .
                          </>
                        ) : null}
                      </p>
                    ))}
                  </div>
                  {section.items ? (
                    <ul className="mt-[var(--cb-space-16)] flex list-disc flex-col gap-[var(--cb-space-12)] pl-5 leading-7 text-[color:var(--cb-text-secondary)] marker:text-[color:var(--cb-accent-text)]">
                      {section.items.map((item) => (
                        <li key={item.text}>
                          {item.title ? (
                            <strong className="font-semibold text-[color:var(--cb-text)]">
                              {item.title}{" "}
                            </strong>
                          ) : null}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            <LegalContactCard
              title="Questions about your data?"
              description="Contact us and we'll get back to you."
              email={privacyContactEmail}
            />
          </article>
        </div>
      </LandingContainer>
    </div>
  );
}
