// SoftwareDevelopmentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  CloudCog,
  Code2,
  Palette,
  Server,
  Smartphone,
  Users2,
} from "lucide-react";

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
      className=" relative z-10 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black lg:min-h-screen"
    >
      {/* soft decor glows for dark theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
      {/* Background visuals */}
      <SoftwareDevelopmentBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="w-full px-4 sm:px-8 lg:w-2/3 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12 text-left text-4xl font-bold text-purple-500 sm:text-5xl lg:text-6xl"
          >
            Software {" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-teal-600 bg-clip-text text-transparent">
              Development
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2"
          >
            {techStacks.map((stack) => {
              const cardThemes: Record<
                string,
                { icon: React.ElementType; color: string; iconBg: string }
              > = {
                "Front End": {
                  icon: Code2,
                  color: "text-indigo-400",
                  iconBg: "bg-indigo-500/20",
                },
                "Back End": {
                  icon: Server,
                  color: "text-emerald-400",
                  iconBg: "bg-emerald-500/20",
                },
                "Mobile Development": {
                  icon: Smartphone,
                  color: "text-orange-400",
                  iconBg: "bg-orange-500/20",
                },
                "DevOps & Deployment": {
                  icon: CloudCog,
                  color: "text-cyan-400",
                  iconBg: "bg-cyan-500/20",
                },
                "UI/UX Design": {
                  icon: Palette,
                  color: "text-fuchsia-400",
                  iconBg: "bg-fuchsia-500/20",
                },
                "Project Team & Management": {
                  icon: Users2,
                  color: "text-purple-400",
                  iconBg: "bg-purple-500/20",
                },
              };

              const theme = cardThemes[stack.title] ?? {
                icon: Code2,
                color: "text-white/70",
                iconBg: "bg-white/10",
              };
              const Icon = theme.icon;

              return (
                <div
                  key={stack.title}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/60 p-5 shadow-lg backdrop-blur-md transition hover:border-white/20"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ring-white/10 ${theme.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${theme.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase text-white/90">
                      {stack.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-sm text-white/80">
                    {stack.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-white/10"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${theme.color.replace(
                            "text-",
                            "bg-",
                          )}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
