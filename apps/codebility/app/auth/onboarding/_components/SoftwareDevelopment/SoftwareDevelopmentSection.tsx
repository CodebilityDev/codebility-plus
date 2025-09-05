// SoftwareDevelopmentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import SoftwareDevelopmentBackground from "./SoftwareDevelopmentBackground";

const techStacks = [
  {
    title: "Front End",
    items: [
      "React.js / Next.js",
      "Tailwind CSS / Material UI",
      "TypeScript / JavaScript",
      "HTML5 / CSS3",
    ],
  },
  {
    title: "Back End",
    items: [
      "Node.js / Express.js",
      "PostgreSQL / MongoDB",
      "Prisma / Mongoose",
      "Firebase / Supabase",
    ],
  },
  {
    title: "Mobile Development",
    items: ["React Native", "Expo"],
  },
  {
    title: "DevOps & Deployment",
    items: [
      "Docker",
      "Vercel / Netlify",
      "GitHub Actions",
      "AWS / Digital Ocean",
    ],
  },
  {
    title: "UI/UX Design",
    items: ["Figma", "Adobe XD"],
  },
  {
    title: "Project Team & Management",
    items: ["Notion", "Trello / Jira", "Slack / Discord", "GitHub Projects"],
  },
];

export default function SoftwareDevelopmentSection() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <section
      id="software-dev"
      className="relative z-10 overflow-visible bg-gradient-to-br from-purple-100 to-purple-200 lg:min-h-screen"
    >
      {/* Background visuals */}
      <SoftwareDevelopmentBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="w-full px-4 sm:px-8 lg:w-2/3 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 text-left text-4xl font-bold text-purple-900 sm:text-5xl lg:text-6xl"
          >
            Software <span className="text-pink-600">Development</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2"
          >
            {techStacks.map((stack) => (
              <div
                key={stack.title}
                className="rounded-xl border border-purple-300 bg-white/60 shadow-xl backdrop-blur-md transition-shadow duration-300 hover:shadow-purple-400/30"
              >
                <div className="px-6 py-5">
                  <h3 className="mb-3 text-lg font-semibold uppercase text-purple-700">
                    {stack.title}
                  </h3>
                  <ul className="space-y-1 text-sm text-purple-800">
                    {stack.items.map((item) => (
                      <li key={item} className="list-inside list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
