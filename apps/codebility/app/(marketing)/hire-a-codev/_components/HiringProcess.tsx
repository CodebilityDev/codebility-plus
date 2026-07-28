"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import { SectionWrapper } from "@/components/shared/home";
import { User, MessageSquare, UserCheck, Handshake } from "lucide-react";

// ─── Static per-card color classes (dynamic Tailwind classes fail at build) ───
// Each card gets explicit static classes instead of `text-${color}` interpolation.
const hiringSteps = [
  {
    id: 1,
    step: "01",
    title: "Tell Us Your Needs",
    description:
      "Share your project requirements, tech stack preferences, timeline, and team size. We'll help you define the perfect developer profile for your project.",
    icon: MessageSquare,
    // Static Tailwind classes — no interpolation
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    stepColor: "text-teal-400",
  },
  {
    id: 2,
    step: "02",
    title: "Meet Pre-Vetted Talent",
    description:
      "We present 3-5 carefully selected CoDevs who match your criteria. Each developer has been thoroughly vetted for technical skills and communication abilities.",
    icon: User,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    stepColor: "text-violet-400",
  },
  {
    id: 3,
    step: "03",
    title: "Interview & Select",
    description:
      "Conduct interviews with your shortlisted candidates. We facilitate the process and provide technical assessments to help you make the best choice.",
    icon: UserCheck,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    stepColor: "text-blue-400",
  },
  {
    id: 4,
    step: "04",
    title: "Start Building",
    description:
      "Your selected CoDevs integrate seamlessly with your team. We provide ongoing support to ensure successful project delivery and smooth collaboration.",
    icon: Handshake,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    stepColor: "text-purple-400",
  },
];

// Staggered vertical offsets for alternating layout (cards 1&3 up, 2&4 down)
// Matches the design reference wave pattern
const STAGGER_OFFSETS = ["mt-0", "mt-16", "mt-0", "mt-16"];

// Animation delay per card for cascading reveal (0ms, 200ms, 400ms, 600ms)
const ANIMATION_DELAYS = [0, 200, 400, 600];

const HiringProcess = () => {
  // Ref to the cards container — used to attach IntersectionObserver
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards) return;

    // IntersectionObserver fires animation only when section enters viewport
    // (task requirement: no animation on load before section is visible)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const delay = card.dataset.delay ?? "0";

            // Apply visible class after delay — triggers CSS transition
            setTimeout(() => {
              card.classList.add("opacity-100", "translate-y-0");
              card.classList.remove("opacity-0", "translate-y-8");
            }, Number(delay));

            // Stop observing once animated — each card animates once
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.15 } // Fire when 15% of card is visible
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper className="relative lg:w-full lg:overflow-hidden py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ── Section Header ── */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200 mb-4">
            Hiring Process
          </span>
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
            How to Hire CoDevs
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Our streamlined process makes it easy to find and hire the perfect developers
            for your project. From initial consultation to project delivery, we&apos;re with you every step of the way.
          </p>
        </div>

        {/* ── Desktop: Staggered alternating layout ── */}
        <div ref={sectionRef} className="hidden lg:block relative">

          {/* SVG connector path linking all 4 cards */}
          {/* Rendered behind cards (z-0), cards sit on z-10 */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            preserveAspectRatio="none"
            viewBox="0 0 1200 220"
          >
            <defs>
              {/* Glow gradient matching design reference purple/teal flow line */}
              <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
              </linearGradient>
              {/* Blur filter for the glow effect */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/*
              Curved path connecting card centers in the staggered layout:
              Card 1 center ≈ x=150, y=80 (top row)
              Card 2 center ≈ x=450, y=140 (bottom row, +64px offset)
              Card 3 center ≈ x=750, y=80 (top row)
              Card 4 center ≈ x=1050, y=140 (bottom row)
              Uses cubic bezier curves for smooth wave
            */}
            <path
              d="M 150 80 C 250 80, 350 140, 450 140 S 650 80, 750 80 S 950 140, 1050 140"
              fill="none"
              stroke="url(#connectorGradient)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
          </svg>

          {/* Cards grid — staggered via mt offsets */}
          <div className="relative z-10 grid grid-cols-4 gap-8 items-start">
            {hiringSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  // data-card: selector for IntersectionObserver
                  // data-delay: staggered animation delay in ms
                  data-card
                  data-delay={ANIMATION_DELAYS[index]}
                  className={`
                    group relative
                    ${STAGGER_OFFSETS[index]}
                    opacity-0 translate-y-8
                    transition-all duration-700 ease-out
                  `}
                >
                  {/* Glassmorphism card — semi-transparent dark bg, subtle border */}
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8">

                    {/* Hover glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />

                    <div className="relative z-10">
                      {/* Icon + step number row */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className={`rounded-lg ${step.iconBg} p-3`}>
                          <Icon className={`h-6 w-6 ${step.iconColor}`} />
                        </div>
                        <span className={`text-2xl font-bold ${step.stepColor}`}>
                          {step.step}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile/Tablet: Single column vertical stack ── */}
        {/* Animations preserved — same IntersectionObserver targets [data-card] */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden">
          {hiringSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                data-card
                data-delay={ANIMATION_DELAYS[index]}
                className="group relative opacity-0 translate-y-8 transition-all duration-700 ease-out"
              >
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-4">
                      <div className={`rounded-lg ${step.iconBg} p-3`}>
                        <Icon className={`h-6 w-6 ${step.iconColor}`} />
                      </div>
                      <span className={`text-2xl font-bold ${step.stepColor}`}>
                        {step.step}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          className="mt-16 px-4 sm:px-6 lg:px-0"
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm transition-all duration-300">

            {/* Ambient animated glow background */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 50%, rgba(45,212,191,0.15), transparent 60%)",
                    "radial-gradient(circle at 70% 50%, rgba(124,58,237,0.15), transparent 60%)",
                    "radial-gradient(circle at 30% 50%, rgba(45,212,191,0.15), transparent 60%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="relative flex flex-col gap-10 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">

              {/* Column 1: Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-4 min-w-0"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white leading-tight">
                  Ready to Build Your Dream Team?
                </h3>
                <p className="text-base sm:text-xs text-gray-300">
                  Start your hiring journey today. Get matched with skilled developers who can bring your vision to life.
                </p>
              </motion.div>

              {/* Column 2: Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-end shrink-0 w-full md:w-auto"
              >
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  href="/contact"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[#7C3AED] px-8 py-2.5 text-sm sm:text-base font-medium text-white transition-all hover:bg-[#7C3AED]/90"
                >
                  Start Hiring
                </motion.a>
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  href="/bookacall"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-customTeal/20 bg-transparent px-8 py-2.5 text-sm sm:text-base font-medium text-customTeal transition-all hover:bg-customTeal/20 hover:border-customTeal/40"
                >
                  Schedule a Call
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background decoration (unchanged from original) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[20%] hidden transform-gpu overflow-hidden blur-3xl sm:-bottom-80 lg:block"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="from-customViolet-100 to-customTeal relative left-[calc(50%-15rem)] aspect-[855/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
    </SectionWrapper>
  );
};

export default HiringProcess;