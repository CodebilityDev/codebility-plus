"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const items = [
  {
    number: "01",
    text: "A self-driven attitude — you’re responsible for your own learning",
    color: "bg-cyan-400",
  },
  {
    number: "02",
    text: "Professionalism in communication, time management, and behavior",
    color: "bg-emerald-400",
  },
  {
    number: "03",
    text: "Active participation in tasks, meetings, and community discussions",
    color: "bg-rose-400",
  },
  {
    number: "04",
    text: "Respect for team members, deadlines, and project goals",
    color: "bg-indigo-400",
  },
  {
    number: "05",
    text: "Willingness to grow from feedback and mistakes",
    color: "bg-amber-400",
  },
  {
    number: "06",
    text: "Transparency — especially if you’re unavailable, struggling, or need support",
    color: "bg-fuchsia-400",
  },
];

export default function ExpectSectionLight() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = sectionRef.current;
    const line = lineRef.current;
    if (!target || !line) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) line.style.height = "100%";
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-center overflow-hidden bg-white px-6 py-24 text-zinc-800 lg:min-h-screen"
    >
      {/* very soft background accents */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-100 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-pink-100 blur-2xl" />
      </div>

      <div className="w-full max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center text-3xl font-extrabold tracking-tight"
        >
          What we expect from{" "}
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-cyan-600 bg-clip-text font-extrabold text-transparent">
            YOU
          </span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Subtle vertical line */}
          <motion.div
            ref={lineRef}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute left-1/2 hidden w-px -translate-x-1/2 bg-zinc-200 md:block"
          />

          {/* Steps */}
          <div className="flex flex-col gap-12">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className={`relative flex flex-col items-center md:flex-row ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Connector (super soft) */}
                  {i !== 0 && (
                    <div className="absolute left-1/2 top-[-18px] z-0 hidden h-full w-px -translate-x-1/2 bg-zinc-100 md:block" />
                  )}

                  {/* Row */}
                  <div
                    className={`z-10 flex w-full flex-col items-center gap-4 md:w-[calc(50%-1rem)] md:flex-row ${
                      isLeft
                        ? "md:order-2 md:mr-auto"
                        : "flex-row-reverse md:order-1 md:ml-auto"
                    }`}
                  >
                    {/* Number badge (light, with border) */}
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white ${item.color} shadow-sm ring-1 ring-white/60`}
                    >
                      {item.number}
                    </div>

                    {/* Card (light, subtle shadow) */}
                    <div
                      className={`mt-2 w-full rounded-xl border border-zinc-200 bg-white/80 p-5 text-center text-sm leading-relaxed shadow-sm backdrop-blur-sm md:mt-0 ${
                        isLeft ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
