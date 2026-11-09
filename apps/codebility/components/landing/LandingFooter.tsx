import { Globe, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/global/design-system/Wordmark";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { footerColumns } from "@/constants/landing/landing-content";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/codebility", icon: Linkedin },
  { label: "Website", href: "https://www.codebility.tech", icon: Globe },
  { label: "Email", href: "mailto:hello@codebility.tech", icon: Mail },
];

export function LandingFooter() {
  return (
    <footer className="pb-[var(--cb-space-40)] pt-[var(--cb-space-40)]">
      <LandingContainer>
        <div className="rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] lg:p-[var(--cb-space-40)]">
          <div className="flex flex-col gap-[var(--cb-space-24)] border-b border-[color:var(--cb-border)] pb-[var(--cb-space-32)] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold leading-[30px] text-[color:var(--cb-text)]">
                Stay in the loop
              </h2>
              <p className="mt-[var(--cb-space-4)] text-sm text-[color:var(--cb-text-muted)]">
                Project launches, open CoDev roles and engineering notes.
                Monthly, no spam.
              </p>
            </div>
            <NewsletterForm />
          </div>

          <div className="grid gap-[var(--cb-space-32)] py-[var(--cb-space-32)] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-[var(--cb-space-16)]">
              <Wordmark width={150} />
              <p className="max-w-[240px] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                A dynamic hub for innovation: hire vetted Filipino developers
                or grow your career as a CoDev.
              </p>
              <div className="flex items-center gap-[var(--cb-space-12)]">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)]"
                    >
                      <Icon className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-[var(--cb-space-12)]">
                <p className="text-sm font-semibold text-[color:var(--cb-text)]">
                  {column.title}
                </p>
                <div className="flex flex-col gap-[var(--cb-space-8)]">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="w-fit text-sm text-[color:var(--cb-text-muted)] transition-colors hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[var(--cb-space-12)] border-t border-[color:var(--cb-border)] pt-[var(--cb-space-24)] text-xs text-[color:var(--cb-text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Codebility. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-[var(--cb-space-16)]">
              <Link href="/privacy-policy" className="transition-colors hover:text-[color:var(--cb-text)]">
                Terms
              </Link>
              <Link href="/privacy-policy" className="transition-colors hover:text-[color:var(--cb-text)]">
                Privacy
              </Link>
              <Link href="/privacy-policy" className="transition-colors hover:text-[color:var(--cb-text)]">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}
