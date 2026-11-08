import { Clock, Mail, Sparkles } from "lucide-react";

import { Avatar } from "@/components/global/design-system/Avatar";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { IconTile } from "@/components/global/design-system/IconTile";
import { Rating } from "@/components/global/design-system/Rating";
import { ContactForm } from "@/components/landing/ContactForm";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { StrategyCallCard } from "@/components/landing/StrategyCallCard";

const benefits = [
  { icon: Clock, label: "Free 30-minute consultation" },
  { icon: Sparkles, label: "Tailored solutions for your business" },
  { icon: Mail, label: "Reply within one business day" },
];

export function LandingContact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/10 py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <div className="h-[720px] w-[1120px] shrink-0 rounded-full bg-[radial-gradient(closest-side,rgba(151,71,255,0.3),rgba(151,71,255,0))] blur-2xl" />
      </div>

      <LandingContainer className="relative">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <Eyebrow variant="outline">{"LET'S CONNECT"}</Eyebrow>
          <h2
            id="contact-heading"
            className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#f4f4f4] sm:text-4xl lg:text-[44px]"
          >
            Let&apos;s build something together
          </h2>
          <p className="mt-4 max-w-[560px] text-sm leading-6 text-white/60">
            Tell us about your project. Then pick a time for a free 30-minute
            strategy call.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
          <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0b3f52_0%,#123a68_30%,#3d1a8f_62%,#7a2ff5_100%)] p-6 text-white sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-[#9747ff]/40 blur-3xl"
            />

            <div className="relative flex h-full flex-col">
              <ul className="flex flex-col gap-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <li key={benefit.label} className="flex items-center gap-3">
                      <IconTile
                        variant="glass"
                        className="h-9 w-9 rounded-lg border-white/20 bg-white/10 text-white"
                      >
                        <Icon aria-hidden className="h-4 w-4" />
                      </IconTile>
                      <span className="text-sm font-medium leading-5 text-white">
                        {benefit.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <StrategyCallCard className="mt-7" />

              <figure className="mt-6">
                <Rating value={5} />
                <blockquote className="mt-3 text-sm leading-6 text-white">
                  &ldquo;Clear communication, weekly demos and a team that
                  genuinely cares about the product.&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Avatar
                    initials="CN"
                    alt="Client Name"
                    gradient="violet"
                    size={40}
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium leading-5 text-white">
                      Client Name
                    </span>
                    <span className="text-xs leading-[18px] text-white/60">
                      Founder, Partner Company
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
