// app/auth/onboarding/_components/HouseRulesSection.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement>;

const rules = [
  {
    n: 1,
    title: "Show Up With Purpose",
    desc: "Whether you're working on a task or attending a session, be present, prepared, and proactive. Treat this opportunity like it matters — because it does.",
  },
  {
    n: 2,
    title: "Own Your Growth",
    desc: "This isn’t school — it’s real-world learning. Be self-driven, take initiative, and don’t wait to be told what to do. If you’re stuck, ask. If you're curious, explore.",
  },
  {
    n: 3,
    title: "Respect Time — Yours and Others",
    desc: "Be on time. Meet deadlines. Communicate if you’re delayed. Time is a shared resource, and how you manage it reflects your professionalism.",
  },
  {
    n: 4,
    title: "Communicate Clearly, Kindly, and Often",
    desc: "Use our channels (Slack, Discord, etc.) responsibly. Give updates. Ask questions. Support others. Feedback is welcome — but make it constructive.",
  },
  {
    n: 5,
    title: "Be a Team Player",
    desc: "We build together. Be collaborative, helpful, and open‑minded. Celebrate wins — big or small — and lift others as you climb.",
  },
  {
    n: 6,
    title: "No Ghosting, No Vanishing",
    desc: "If you need to pause or step back, that’s okay — just communicate. Silence disrupts projects and team trust.",
  },
  {
    n: 7,
    title: "Keep It Professional",
    desc: "Treat everyone with respect, regardless of their background or role. Discrimination, harassment, or unprofessional behavior won't be tolerated.",
  },
  {
    n: 8,
    title: "Protect Our Space",
    desc: "Don’t share internal work or sensitive information outside Codebility without permission. Confidentiality matters — to us and our clients.",
  },
  {
    n: 9,
    title: "Celebrate Progress, Not Perfection",
    desc: "Mistakes are part of learning. Ask questions. Own errors. Share lessons. Growth is the goal, not flawless performance.",
  },
  {
    n: 10,
    title: "This Is a Stepping Stone — Make It Count",
    desc: "We’re not offering salaries — we’re offering experience, mentorship, and a launchpad for your future. What you build here, you take with you.",
  },
];

export default function HouseRulesSection({ className, ...rest }: Props) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black",
        "py-16 sm:py-20 lg:py-28",
        className,
      )}
      {...rest}
    >
      {/* soft vignette + motif glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-5xl text-center sm:mb-14 lg:mb-16">
          <h2
            className={cn(
              "text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl",
              "bg-gradient-to-b from-cyan-300 to-teal-100 bg-clip-text text-transparent",
              "drop-shadow-[0_0_18px_rgba(34,211,238,0.25)]",
            )}
          >
            HOUSE RULES
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-zinc-300/80 sm:text-base">
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
                  "border-white/5 bg-zinc-900/40 p-5 sm:p-6",
                  "transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_-12px_rgba(34,197,94,0.15)]",
                )}
              >
                {/* neon top bar */}
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 opacity-60" />

                <div className="flex items-start gap-4">
                  {/* numbered badge */}
                  <div className="relative">
                    <span
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-full text-lg font-extrabold text-white",
                        "bg-zinc-800/70 ring-2 ring-cyan-400/60",
                        "shadow-[0_0_20px_0_rgba(34,211,238,0.25)]",
                      )}
                    >
                      {r.n}
                    </span>
                    <span className="absolute inset-0 -z-10 rounded-full bg-cyan-400/0 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/15" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-300/90">
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
