"use client";

import { motion } from "framer-motion";
import { HandshakeIcon, RocketIcon, TrendingUpIcon } from "lucide-react";

const items = [
  {
    title: "We’re your launchpad, not your ladder.",
    desc: "Technology is transforming education, providing access to online courses, personalized learning experiences, and interactive tools.",
    icon: <RocketIcon className="h-10 w-10 text-white" />,
    bg: "bg-gradient-to-tr from-indigo-600 to-purple-700",
  },
  {
    title: "This is not an internship program with a Memorandum of Agreement",
    desc: "But if you’re serious about growth, you’ll walk away with experience that makes your resume stronger and your skills sharper.",
    icon: <HandshakeIcon className="h-10 w-10 text-white" />,
    bg: "bg-gradient-to-tr from-rose-500 to-pink-500",
  },
  {
    title: "This is not a shortcut to a paycheck—it’s a long-term investment.",
    desc: "We don’t promise immediate salaries or commissions. What we offer is something better: A stepping stone to future roles, freelance work, or even your own startup.",
    icon: <TrendingUpIcon className="h-10 w-10 text-white" />,
    bg: "bg-gradient-to-tr from-sky-500 to-cyan-400",
  },
];

export default function IsAndIsntSection() {
  return (
    <section className="relative overflow-hidden flex w-full items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white px-6 py-20 text-black lg:min-h-screen">
      {/* soft vignette + motif glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-[120%] -translate-x-1/2 bg-gradient-to-t from-purple-400 to-transparent" />
      </div>
      <div className="w-full max-w-6xl text-center">
        <h2 className="mb-16 text-4xl font-bold tracking-tight text-[#130a3d] md:text-5xl">
          What <span className="text-purple-600">Codebility</span> Is and Isn’t?
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`rounded-3xl p-8 text-left text-white shadow-xl ${item.bg}`}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="mb-3 text-lg font-semibold leading-tight">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/90">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
