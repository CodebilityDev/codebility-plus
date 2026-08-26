"use client";

import { Clock, Lightbulb, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { InlineWidget } from "react-calendly";

import Container from "./MarketingContainer";
import Section from "./MarketingSection";

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

const Calendly = () => {
  return (
    <Section
      id="book"
      className="relative w-full overflow-hidden pt-10 text-white 2xl:pt-24"
    >
      <Container className="relative z-10 flex flex-col gap-6 text-white lg:flex-row lg:gap-10">
        <motion.div
          className="flex w-full flex-1 flex-col justify-start gap-2 text-center lg:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-3xl font-bold text-transparent md:text-5xl"
          >
            Let&apos;s Connect
          </motion.h2>
          <motion.p variants={itemVariants} className="text-md text-gray-300 lg:text-lg">
            Schedule a meeting with us to discuss your needs and have solutions.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3 text-sm lg:text-base">
              {[
                { icon: Clock, text: "Free 30-minute consultation" },
                { icon: Rocket, text: "Tailored solutions for your business" },
                { icon: Lightbulb, text: "Expert advice from our team" },
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-purple-400" />
                  <span className="text-purple-300">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="calendly-widget-container relative w-full flex-1 justify-center overflow-hidden lg:w-1/2"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <div className="relative z-10">
              <InlineWidget
                styles={{
                  borderRadius: "0.75rem",
                  border: "none",
                  height: "600px",
                }}
                url="https://calendly.com/codebility-dev/30min"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Calendly;
