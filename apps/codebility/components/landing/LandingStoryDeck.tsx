"use client";

import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

import { QuoteCard } from "@/components/global/design-system/QuoteCard";
import { landingTestimonials } from "@/constants/landing/landing-content";

const stackClasses = [
  "z-30 translate-y-0 scale-100 opacity-100",
  "z-20 translate-y-[14px] scale-[0.98] opacity-50 lg:translate-y-[22px]",
  "z-10 translate-y-[-14px] scale-[0.98] opacity-40 lg:translate-y-[-22px]",
];

function LandingStoryDeck() {
  const [active, setActive] = useState(0);
  const count = landingTestimonials.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="relative w-full"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -bottom-24 top-0 rounded-[48px] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_34%,transparent)_0%,color-mix(in_srgb,var(--cb-pink)_12%,transparent)_45%,transparent_72%)] blur-3xl"
      />

      <p aria-live="polite" className="sr-only">
        {landingTestimonials[active]?.name}
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-2 left-1/2 h-16 w-[72%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_38%,transparent)_0%,transparent_72%)] blur-2xl"
      />

      <div className="relative grid pt-8 lg:pt-[46px]">
        {landingTestimonials.map((testimonial, index) => {
          const position = (index - active + count) % count;
          const isActive = position === 0;

          return (
            <div
              key={testimonial.name}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 w-full origin-top transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${stackClasses[position]}`}
            >
              <div className="relative">
                <QuoteCard
                  className={`min-h-[204px] [&>*]:transition-opacity [&>*]:duration-500 ${isActive ? "" : "[&>*]:opacity-0"}`}
                  avatarGradient="cyan"
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  initials={testimonial.initials}
                  rating={testimonial.rating}
                  page={active + 1}
                  pageCount={count}
                />
                <Quote
                  aria-hidden
                  className={`pointer-events-none absolute right-6 top-6 h-[var(--cb-size-40)] w-[var(--cb-size-40)] text-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] transition-opacity duration-500 ${isActive ? "" : "opacity-0"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { LandingStoryDeck };
