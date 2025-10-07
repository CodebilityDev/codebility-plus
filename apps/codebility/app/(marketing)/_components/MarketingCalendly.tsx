"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InlineWidget } from "react-calendly";

import Container from "./MarketingContainer";
import Section from "./MarketingSection";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const widgetVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Calendly = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section id="book" className="relative w-full pt-10 text-white overflow-hidden">
      <Container className="relative z-10 flex flex-col gap-6 text-white lg:flex-row lg:gap-10">
        <motion.div 
          ref={ref}
          className="flex w-full flex-1 flex-col justify-center gap-2 text-center lg:text-left"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold md:text-5xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
            variants={titleVariants}
          >
            Let&apos;s Connect
          </motion.h2>
          <motion.p 
            className="text-md lg:text-lg text-gray-300"
            variants={descriptionVariants}
          >
            Schedule a meeting with us to discuss your needs and have solutions. 
          </motion.p>

          {/* Enhanced CTA elements */}
          <motion.div 
            className="flex flex-col gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Feature highlights */}
            <div className="flex flex-col gap-2 text-sm lg:text-base">
              {[
                "✨ Free 30-minute consultation",
                "🚀 Tailored solutions for your business",
                "💡 Expert advice from our team"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                >
                  <span className="text-purple-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="calendly-widget-container w-full flex-1 justify-center lg:w-1/2 relative overflow-hidden"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={widgetVariants}
        >
          {/* Widget wrapper with enhanced styling */}
          <motion.div
            className="relative rounded-xl overflow-hidden"
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px -12px rgba(147, 71, 255, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Calendar widget */}
            <div className="relative z-10">
              <InlineWidget 
                styles={{ 
                  borderRadius: '0.75rem',
                  border: 'none',
                  height: '600px',
                }} 
                url="https://calendly.com/codebility-dev/30min" 
              />
            </div>
          </motion.div>
        </motion.div>
      </Container>
      {/* Enhanced background effects */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform blur-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: {
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <motion.div
          style={{
            clipPath:
              "polygon(0% 31.5%, 75.3% 19.5%, 100% 50%, 75.5% 80.5%, 0% 67.8%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[30rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-20 sm:w-[50rem]"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </Section>
  );
};

export default Calendly;
