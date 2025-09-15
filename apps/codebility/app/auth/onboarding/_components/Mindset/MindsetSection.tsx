"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  HandCoins,
  Lightbulb,
  Users,
} from "lucide-react";

const cards = [
  {
    title: "YOU GET WHAT YOU GIVE",
    description: "The more effort you put in, the more value you gain.",
    icon: HandCoins,
  },
  {
    title: "WE GROW TOGETHER",
    description: "Your growth contributes to the growth of others.",
    icon: Users,
  },
  {
    title: "YOU ARE YOUR BRAND",
    description: "What you build and how you work reflects your future career.",
    icon: BadgeCheck,
  },
  {
    title: "EVERY PROJECT IS AN OPPORTUNITY",
    description: "Treat it like a portfolio piece - because it is.",
    icon: Briefcase,
  },
];

export default function MindsetSection() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-white px-6 py-20 text-black lg:min-h-screen">
        {/* soft pastel glows for light motif */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(236,72,153,0.15),transparent_60%),radial-gradient(800px_480px_at_10%_80%,rgba(20,184,166,0.15),transparent_60%)]" />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* LEFT: Heading + Lightbulb (Centered) */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center md:items-center md:text-center"
          >
            <h2 className="text-3xl font-bold leading-tight text-neutral-800 sm:text-4xl md:text-5xl">
              the Codebility <span className="text-purple-600">mindset</span>
            </h2>

            {/* Animated Glowing Lightbulb */}
            <m.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8"
            >
              <Lightbulb
                className="h-32 w-32 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                strokeWidth={1.5}
              />
            </m.div>
          </m.div>

          {/* RIGHT: Mindset Cards */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 px-6 py-4 text-white shadow-lg"
              >
                <card.icon className="mt-1 h-6 w-6 shrink-0 text-white" />
                <div>
                  <h3 className="text-sm font-extrabold sm:text-base md:text-lg">
                    {card.title}
                  </h3>
                  <p className="text-xs opacity-90 sm:text-sm md:text-base">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
