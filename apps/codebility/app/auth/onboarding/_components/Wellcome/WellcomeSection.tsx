"use client";

import dynamic from "next/dynamic";
// IMPORTANT: place your JSON at /public/assets/images/onboarding/animation/confetti.json
import confetti from "@/public/assets/images/onboarding/animation/confetti.json";
import { motion as m } from "framer-motion";

// Load Lottie on client only
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function WellcomeSection() {
  return (
    <section
      id="welcome-section"
      className="
        relative isolate min-h-[90vh] w-full overflow-hidden
        bg-gradient-to-br from-slate-50 via-white to-slate-100
        text-[#1e1d17]
      "
    >
      {/* soft decor blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      {/* Lottie background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      >
        <Lottie
          animationData={confetti as unknown as object}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
        {/* soft radial vignette for depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_80%_-10%,rgba(124,58,237,0.08),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_10%_110%,rgba(99,102,241,0.08),transparent)]" />
      </div>

      {/* Content */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 sm:py-32 md:py-40">
        <m.h1
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            text-center text-5xl font-extrabold
            leading-[0.95]
            drop-shadow-[0_2px_0_rgba(255,255,255,0.65)] sm:text-6xl md:text-7xl lg:text-8xl
          "
        >
          Let’s Get
          <br className="hidden sm:block" />
          <span className="ml-2 inline-block rounded-2xl bg-clip-text">
            Started!
          </span>
        </m.h1>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="mt-8"
        >
          <div
            className=" relative  overflow-hidden
              rounded-2xl border border-slate-300/70 bg-white/70  p-4 px-6 py-3
              text-center text-sm leading-relaxed text-neutral-700 shadow-sm
              backdrop-blur
              sm:px-7 sm:py-3.5 sm:text-2xl
            "
          >
            We’re excited to have you! Let’s work,
            <br className="sm:hidden" /> learn, and grow together.
            {/* subtle accent line */}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 opacity-70" />
          </div>
        </m.div>

        {/* subtle floating sparkle accent */}
        <m.div
          aria-hidden
          className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full bg-white/50 blur-2xl sm:h-32 sm:w-32"
          initial={{ opacity: 0.0, scale: 0.9 }}
          animate={{ opacity: 0.6, scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
