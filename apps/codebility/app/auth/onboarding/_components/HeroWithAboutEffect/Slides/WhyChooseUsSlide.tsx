// components/HeroWithAboutEffect/WhyChooseUsSlide.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyChooseUsSlide() {
  const features = [
    {
      title: "Real-World Experience, Not Just Theory",
      desc: "At Codebility, you won’t just study—you’ll build. Join real projects, contribute to team efforts, and grow your portfolio with practical experience that employers actually value.",
      icon: BriefcaseIcon,
    },
    {
      title: "Community-Driven Growth",
      desc: "We’re not a bootcamp. We’re a collaborative tech community. You’ll learn alongside other aspiring devs, designers, and QAs—supported by mentors, team leads, and peers who genuinely want you to succeed.",
      icon: UsersIcon,
    },
    {
      title: "International Opportunities",
      desc: "Codebility opens doors. Through our client partnerships and industry exposure, we help talented members prepare for and land international remote jobs and freelance gigs.",
      icon: GlobeIcon,
    },
    {
      title: "Learn at Your Own Pace",
      desc: "No rigid curriculums. You bring your willingness to learn, and we’ll provide opportunities to apply, grow, and earn real-world credibility.",
      icon: LightbulbIcon,
    },
  ];

  return (
    <div className="slide relative flex w-screen flex-col justify-center text-white lg:h-screen">
      {/* Features Grid */}
      <div className="z-0 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24">
        <h2 className="mb-16 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Why Choose <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-teal-600 bg-clip-text text-transparent">Codebility</span>?
        </h2>
        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((item, i) => (
            <motion.div
              key={i}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/20"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
            >
              <div className="primary-gradient flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-white">
                <item.icon />
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-white/80">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
function BriefcaseIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16v12H4z" />
      <path d="M16 7V5a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17 20h5v-2a4 4 0 00-3-3.87" />
      <path d="M9 20H4v-2a4 4 0 013-3.87" />
      <circle cx="9" cy="7" r="4" />
      <circle cx="17" cy="7" r="4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 5.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3c1.5-1.2 3-3.2 3-5.7a7 7 0 00-7-7z" />
    </svg>
  );
}
