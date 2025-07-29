"use client";

import { motion } from "framer-motion";
import {
  BadgeDollarSignIcon,
  BanIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";

const items = [
  {
    title: "A paid job",
    desc: "(unless explicitly contracted)",
    icon: <BadgeDollarSignIcon className="h-8 w-8 text-white" />,
    color: "bg-gradient-to-br from-fuchsia-700 to-pink-600",
  },
  {
    title: "A bootcamp with hand-holding or rigid lessons",
    icon: <WorkflowIcon className="h-8 w-8 text-white" />,
    color: "bg-gradient-to-br from-cyan-700 to-cyan-500",
  },
  {
    title: "A place for passive observers",
    icon: <UsersIcon className="h-8 w-8 text-white" />,
    color: "bg-gradient-to-br from-purple-700 to-pink-500",
  },
  {
    title: "A shortcut to success — effort and initiative are required",
    icon: <BanIcon className="h-8 w-8 text-white" />,
    color: "bg-gradient-to-br from-yellow-500 to-amber-400",
  },
];

export default function IsNotSection() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#10131a] px-6 py-24 text-white">
      <div className="w-full max-w-6xl text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
        >
          What <span className="text-white">CODE</span>
          <span className="text-white">BILITY</span>{" "}
          <span className="text-white">is</span>{" "}
          <span className="text-[3rem] font-black leading-none text-cyan-400 drop-shadow-lg md:text-[75px]">
            not
          </span>
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-6 text-left shadow-xl ${item.color}`}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-base font-semibold text-white">
                {item.title}
              </h3>
              {item.desc && (
                <p className="mt-1 text-sm leading-tight text-white/80">
                  {item.desc}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
