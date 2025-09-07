"use client";

import { motion as m } from "framer-motion";
import { Sparkles } from "lucide-react";

const expectations = [
  "Access to real-world projects to build your portfolio",
  "Guidance from mentors, team leads, and senior members",
  "A supportive learning environment focused on collaboration and growth",
  "Opportunities to get involved in internal or client-facing initiatives",
  "Exposure to modern tools and technologies",
  "Recognition for your progress and contributions",
];

export default function ExpectFromUs() {
  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden bg-gradient-to-br from-white via-slate-100 to-gray-200 px-6 py-20 text-gray-800">
      {/* soft vignette + motif glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-[120%] -translate-x-1/2 bg-gradient-to-t from-purple-400 to-transparent" />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl flex-col items-center justify-center">
        {/* Heading */}
        <div className="text-center">
          <h2 className="mb-20 text-center text-4xl font-bold leading-tight md:text-5xl">
            What you can{" "}
            <span className="text-[3.5rem] font-black text-purple-600 drop-shadow-lg md:text-[4.5rem]">
              EXPECT
            </span>
          </h2>

          <m.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mb-10 flex justify-center"
          >
            <Sparkles
              className="h-12 w-12 text-purple-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]"
              strokeWidth={1.5}
            />
          </m.div>
        </div>

        {/* Cards */}
        <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3">
          {expectations.map((text, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-xl"
            >
              <span className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-bold text-white shadow-lg ring-4 ring-white">
                {`0${index + 1}`}
              </span>
              <p className="mt-4 text-[15px] font-medium leading-relaxed text-gray-700">
                {text}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
