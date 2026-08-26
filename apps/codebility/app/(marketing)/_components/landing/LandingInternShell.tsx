"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import Section from "../MarketingSection";
import BlueBg from "./LandingBlueBg";

const VIEWPORT = { once: true, amount: 0.2 } as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function LandingInternShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Section id="codevs" className="text-light-900 relative w-full pt-10">
      <div className="w-full">
        <div className="flex w-full flex-col items-center">
          <motion.div
            className="flex w-full flex-col items-center"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent"
            >
              Codebility CoDevs
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="w-full max-w-[1100px] px-4 pb-10 pt-8 text-center text-gray-300 md:px-44"
            >
              Discover the driving force behind CODEVS&apos; success. Our CoDevs
              bring fresh advantage, high-level performance, and the power to
              turn ideas into impact—propelling us forward with energy and
              determination.
            </motion.p>
          </motion.div>

          <div className="flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-[1100px] px-4">
              {children}

              <motion.div
                className="mb-12 mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <Link href="/hire-a-codev" className="relative z-10">
                    <Button
                      variant="purple"
                      size="lg"
                      rounded="full"
                      className="relative z-10 px-8 py-3 font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                    >
                      <span className="flex items-center gap-2">
                        Hire a CoDevs
                        <span>→</span>
                      </span>
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <div>
                <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
