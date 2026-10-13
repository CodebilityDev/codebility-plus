"use client";

import { useRef } from "react";
import { useIntersection } from "@/hooks/global/useIntersection";
import { motion } from "framer-motion";
import { items } from "@/constants/auth/onboarding/onboarding";


export default function ExpectSectionLight() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView } = useIntersection<HTMLElement>({ threshold: 0.25 });

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-950 px-6 py-24 text-white lg:min-h-screen"
    >
      {/* soft pastel glows for dark motif */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(236,72,153,0.1),transparent_60%),radial-gradient(800px_480px_at_10%_80%,rgba(20,184,166,0.1),transparent_60%)]" />

      <div className="w-full max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          What we expect from{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-teal-600 bg-clip-text font-extrabold text-transparent">
            YOU
          </span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Subtle vertical line */}
          <motion.div
            ref={lineRef}
            initial={{ height: 0 }}
            animate={{ height: inView ? "100%" : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400/50 via-purple-500/50 to-pink-400/50 md:block"
          />

          {/* Steps */}
          <div className="flex flex-col gap-12">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  className={`relative flex flex-col items-center md:flex-row ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Row */}
                  <div
                    className={`z-10 flex w-full flex-col items-center gap-6 md:w-[calc(50%-1rem)] md:flex-row ${
                      isLeft
                        ? "md:order-2 md:mr-auto"
                        : "flex-row-reverse md:order-1 md:ml-auto"
                    }`}
                  >
                    {/* Number badge (enhanced with gradient) */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${item.color} shadow-lg ring-2 ring-white/40`}
                    >
                      {item.number}
                    </motion.div>

                    {/* Card (dark theme with larger text) */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] p-6 text-center text-base leading-relaxed text-white/90 shadow-md backdrop-blur-md md:mt-0 md:text-lg ${
                        isLeft ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      {item.text}
                    </motion.div>
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