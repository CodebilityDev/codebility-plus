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
    <footer className="pb-10 pt-10">
      <LandingContainer>
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
                Stay in the loop
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Project launches, open CoDev roles and engineering notes.
                Monthly, no spam.
              </p>
            </div>
            <NewsletterForm />
          </div>

          <div className="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Wordmark width={150} />
              <p className="max-w-[240px] text-sm leading-5 text-white/50">
                A dynamic hub for innovation: hire vetted Filipino developers
                or grow your career as a CoDev.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-[#f4f4f4]">
                  {column.title}
                </p>
                <div className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="w-fit text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Codebility. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}
