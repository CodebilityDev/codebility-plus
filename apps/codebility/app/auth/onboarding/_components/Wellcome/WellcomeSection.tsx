// app/auth/onboarding/_components/WellcomeSection.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
// IMPORTANT: place your JSON at /public/assets/images/onboarding/animation/confetti.json
import confetti from "@/public/assets/images/onboarding/animation/confetti.json";
import { motion as m } from "framer-motion";

// Load Lottie on client only
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// create a motion-enabled Link
const MotionLink = m(Link);
export default function WellcomeSection() {
  return (
    <section
      id="welcome-section"
      className="
        relative isolate w-full overflow-hidden
        bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
        text-white lg:min-h-[90vh]
      "
    >
      {/* soft decor glows for dark motif */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_85%_10%,rgba(99,102,241,0.10),transparent_60%),radial-gradient(1100px_560px_at_15%_90%,rgba(124,58,237,0.10),transparent_60%)]" />
      </div>

      {/* Lottie background (subtle on dark) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-45"
      >
        <Lottie
          animationData={confetti as unknown as object}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
        {/* soft radial vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_520px_at_80%_-10%,rgba(124,58,237,0.10),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_460px_at_10%_110%,rgba(99,102,241,0.10),transparent)]" />
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 sm:py-32 md:py-40">
        {/* Mobile-only Codebility logo BEFORE the heading */}
        <div className="mb-24 flex items-center justify-center">
          <span className="-mr-4 text-[clamp(32px,10vw,48px)] text-white">
            Co
          </span>
          <Image
            src="/assets/images/onboarding/code_logo.svg"
            alt="d"
            width={66}
            height={66}
            className="object-contain"
            priority
          />
          <span className="-ml-4 text-[clamp(32px,10vw,48px)] text-white">
            ebility
          </span>
        </div>

        <m.h1
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            text-center text-5xl font-extrabold leading-[0.95]
            sm:text-6xl md:text-7xl lg:text-8xl
          "
        >
          Let’s Get
          <br className="hidden sm:block" />
          <span
            className="
              ml-2 inline-block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-200
              bg-clip-text text-transparent drop-shadow-[0_6px_30px_rgba(34,211,238,0.12)]
            "
          >
            Started!
          </span>
        </m.h1>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="mt-8 w-full max-w-2xl"
        >
          <div
            className="
              relative overflow-hidden rounded-2xl border border-white/10
              bg-white/[0.06] px-6 py-4 text-center text-sm leading-relaxed text-white/85
              shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur
              sm:px-7 sm:py-4 sm:text-lg
            "
          >
            We’re excited to have you! Let’s work,
            <br className="sm:hidden" /> learn, and grow together.
            {/* subtle accent line */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 opacity-60" />
          </div>
        </m.div>

        {/* CTA: Signup Now! */}
        <MotionLink
          href="/auth/sign-up"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="
    group relative mt-6 inline-flex items-center justify-center rounded-2xl
    bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-8 py-4 text-lg font-bold text-white
    shadow-[0_12px_40px_-12px_rgba(168,85,247,0.45)] transition
    hover:brightness-[1.05] focus:outline-none focus:ring-2 focus:ring-cyan-400/60
    active:scale-[0.98]
  "
        >
          <span className="relative z-10">Signup Now!</span>

          {/* glow ring */}
          <span className="pointer-events-none absolute inset-0 -z-0 rounded-2xl ring-1 ring-white/20" />

          {/* animated shine */}
          <span
            className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-2xl"
            aria-hidden
          >
            <span
              className="absolute -left-1/3 top-0 h-full w-1/3 translate-x-0 skew-x-[-12deg]
                 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[350%]"
            />
          </span>
        </MotionLink>

        {/* subtle floating sparkle accent */}
        <m.div
          aria-hidden
          className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl sm:h-32 sm:w-32"
          initial={{ opacity: 0.0, scale: 0.9 }}
          animate={{ opacity: 0.5, scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
