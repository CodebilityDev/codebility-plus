"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import Container from "../MarketingContainer";
import Section from "../MarketingSection";

// Animated counter component for stats
const AnimatedStat = ({ 
  value, 
  suffix = "", 
  prefix = "",
  label,
  delay = 0 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  label: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const duration = 2500;
        const steps = 80;
        let current = 0;
        let step = 0;

        const counter = setInterval(() => {
          step++;
          current = (step / steps) * value;
          
          if (step >= steps) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(current);
          }
        }, duration / steps);

        return () => clearInterval(counter);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        type: "spring",
        bounce: 0.4
      }}
    >
      <motion.div 
        className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
        animate={isInView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: (delay / 1000) + 0.3 }}
      >
        {prefix}{Math.floor(displayValue)}{suffix}
      </motion.div>
      <motion.p 
        className="text-sm md:text-base text-gray-300 mt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: (delay / 1000) + 0.5 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
  },
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

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Stats data
  const stats = [
    { value: 120, suffix: "+", label: "Projects Completed", delay: 200 },
    { value: 98, suffix: "%", label: "Client Satisfaction", delay: 400 },
    { value: 100, suffix: "+", label: "Expert Developers", delay: 600 },
    { value: 24, suffix: "/7", label: "Support Available", delay: 800 },
  ];

  return (
    <Section id="whychooseus" className="relative w-full pt-10 text-white">
      <Container className="text-white">
        <div className="flex flex-col gap-6 md:gap-10">
          {/* Header with stats */}
          <motion.div 
            ref={ref}
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-xl md:text-3xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Choose Codebility?
            </motion.h2>
            
            {/* Animated stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 p-6 rounded-xl bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <AnimatedStat key={index} {...stat} />
              ))}
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex grid-cols-1 grid-rows-4 flex-col gap-3 md:grid md:grid-cols-4 lg:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-1 row-end-1 rounded-lg border-2 p-4 md:col-end-3 md:row-end-3 md:p-6 relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="flex h-full flex-col place-items-center justify-around gap-3 text-center relative z-10">
                <div>
                  <Image
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-approach.png"
                    alt="innovative approach"
                    width={300}
                    height={300}
                    className="h-[150px] w-[150px] object-contain lg:h-[300px] lg:w-[300px]"
                  />
                </div>
                <motion.div 
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Innovative Approach
                  </h3>
                  <p className="text-gray">
                    Embrace innovation with Codebility. Crafting revolutionary
                    digital solutions that create new posibilites
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-2 row-end-2 rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-4 md:p-6 relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="flex h-full flex-col place-items-center justify-around gap-3 relative z-10">
                <div>
                  <Image
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-shield.png"
                    alt="shield"
                    width={400}
                    height={400}
                    className="h-[150px] w-[150px] object-contain lg:h-[400px] lg:w-[400px]"
                  />
                </div>
                <motion.div 
                  className="flex flex-col gap-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Reliable and Trusted
                  </h3>
                  <p className="text-gray">
                    Codebility has a proven track record across diverse
                    industries, trusted for our reliability, consistency, and
                    on-time delivery—your dependable digital partner.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="col-start-1 col-end-2 row-start-3 row-end-5 hidden overflow-hidden rounded-xl bg-customBlue-100 lg:block relative"
              variants={cardVariants}
            >
              <div>
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/choose-hands.jpg"
                  alt="codevs"
                  width={300}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div 
              className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-3 row-end-3 rounded-lg border-2 p-4 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-2 relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="flex h-full flex-col place-items-center justify-around gap-3 relative z-10">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-heart.png"
                    alt="tailored"
                    width={200}
                    height={200}
                    className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                  />
                </motion.div>
                <motion.div 
                  className="flex flex-col gap-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <h3 className="font-medium md:text-2xl">
                    Customer - Centric Solution
                  </h3>
                  <p className="text-gray">
                    Understanding your vision and helping you bring your online
                    vision to life.{" "}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="col-start-1 col-end-1 row-start-4 row-end-4 grid place-items-center rounded-xl bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] md:col-start-3 md:col-end-5 md:row-end-5 relative overflow-hidden"
              variants={cardVariants}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.p 
                className="py-10 text-lg font-medium md:text-2xl lg:text-3xl relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 1.4, type: "spring", bounce: 0.4 }}
              >
                Your Uniqueness is our focus
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
