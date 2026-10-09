"use client";


import { motion } from "framer-motion";
import { BriefcaseIcon } from "@/components/auth/onboarding/BriefcaseIcon";
import { GlobeIcon } from "@/components/auth/onboarding/GlobeIcon";
import { LightbulbIcon } from "@/components/auth/onboarding/LightbulbIcon";
import { UsersIcon } from "@/components/auth/onboarding/UsersIcon";


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
