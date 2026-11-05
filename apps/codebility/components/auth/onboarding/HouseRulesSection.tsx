"use client";


import { cn } from "@/utils/global/cn";
import { rules } from "@/constants/auth/onboarding/onboarding";
import type { HouseRulesSectionProps } from "@/types/auth/onboarding/onboarding";


export default function HouseRulesSection({ className, ...rest }: HouseRulesSectionProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-950",
        "py-16 sm:py-20 lg:py-28",
        className,
      )}
      {...rest}
    >
      {/* soft pastel glows for dark motif */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(236,72,153,0.1),transparent_60%),radial-gradient(800px_480px_at_10%_80%,rgba(20,184,166,0.1),transparent_60%)]" />

      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-5xl text-center sm:mb-14 lg:mb-16">
          <h2
            className="translate-y-0 bg-gradient-to-r from-pink-400 via-purple-500 to-teal-600 bg-clip-text
            text-center text-3xl font-extrabold tracking-tight text-transparent opacity-100
            transition-all duration-700 sm:text-4xl md:text-5xl"
          >
            House Rules
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-white/70 sm:text-base">
            A simple playbook for how we work and grow together at Codebility.
          </p>
        </div>

        {/* Two-column list */}
        <ol className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {rules.map((r) => (
            <li key={r.n} className="group">
              <article
                className={cn(
                  "relative overflow-hidden rounded-2xl border",
                  "border-white/10 bg-white/[0.06] p-5 shadow-sm sm:p-6 backdrop-blur-md",
                  "transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/20",
                )}
              >
                {/* pastel accent bar */}
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 opacity-70" />

                <div className="flex items-start gap-4">
                  {/* numbered badge */}
                  <div className="relative">
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-full text-lg font-extrabold",
                        "bg-white/10 text-white ring-2 ring-cyan-400/50",
                        "shadow-md",
                      )}
                    >
                      {r.n}
                    </span>
                    <span className="absolute inset-0 -z-10 rounded-full bg-cyan-400/0 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/20" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-white/90 sm:text-lg">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
