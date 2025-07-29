"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const items = [
  {
    number: "01",
    text: "A self-driven attitude — you’re responsible for your own learning",
    color: "bg-cyan-500",
  },
  {
    number: "02",
    text: "Professionalism in communication, time management, and behavior",
    color: "bg-emerald-500",
  },
  {
    number: "03",
    text: "Active participation in tasks, meetings, and community discussions",
    color: "bg-rose-500",
  },
  {
    number: "04",
    text: "Respect for team members, deadlines, and project goals",
    color: "bg-indigo-500",
  },
  {
    number: "05",
    text: "Willingness to grow from feedback and mistakes",
    color: "bg-amber-500",
  },
  {
    number: "06",
    text: "Transparency — especially if you’re unavailable, struggling, or need support",
    color: "bg-fuchsia-500",
  },
];

export default function ExpectSection() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && lineRef.current) {
          lineRef.current.style.height = "100%";
        }
      },
      { threshold: 0.2 },
    );

    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#10131a] px-6 py-24 text-white">
      <div className="w-full max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center text-4xl font-bold leading-tight md:text-5xl"
        >
          What we expect from{" "}
          <span className="text-[3.5rem] font-black text-pink-400 drop-shadow-lg md:text-[4.5rem]">
            YOU
          </span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing vertical line */}
          <motion.div
            ref={lineRef}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-1/2 hidden w-[5px] -translate-x-1/2 animate-pulse bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.7)] md:block"
          />

          {/* Steps */}
          <div className="flex flex-col gap-14">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col items-center md:flex-row ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Connector line above */}
                  {i !== 0 && (
                    <div className="absolute left-1/2 top-[-24px] z-0 hidden h-full w-1 -translate-x-1/2 bg-white/20 md:block" />
                  )}

                  {/* Content wrapper with flex gap */}
                  <div
                    className={`z-10 flex flex-col items-center gap-4 md:w-[calc(50%-1.5rem)] md:flex-row ${
                      isLeft
                        ? "md:order-2 md:ml-0 md:mr-auto"
                        : "flex-row-reverse md:order-1 md:ml-auto md:mr-0"
                    }`}
                  >
                    {/* Number bubble */}
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-xl ${item.color}`}
                    >
                      {item.number}
                    </div>

                    {/* Card */}
                    <div
                      className={`mt-4 w-full rounded-xl bg-white/5 p-5 text-left text-sm md:mt-0 ${
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
