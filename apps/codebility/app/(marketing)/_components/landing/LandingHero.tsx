"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { MarketingCardData } from "@/constants/landing_data";
import Container from "../MarketingContainer";
import HeroBackground from "./LandingHeroBg";
import HeroCard from "./LandingHeroCard";
import FloatingParticles from "./FloatingParticles";
import AnimatedMetrics from "./AnimatedMetrics";

const HIGHLIGHT_METRICS = [
  { label: "Projects shipped", value: 120, suffix: "+", format: "number" },
  { label: "Avg. client satisfaction", value: 4.9, suffix: "/5", format: "decimal" },
  { label: "Specialists on demand", value: 80, suffix: "+", format: "number" },
];

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const metricsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const Hero = () => {
  return (
    <div className="relative">
      <HeroBackground />
      <FloatingParticles />

      <section className="relative flex w-full flex-col items-center justify-center py-20 text-white">
        <Container className="relative z-10 flex w-full max-w-[1400px] flex-col gap-20 px-8 py-20 md:px-12 md:py-24 lg:flex-row lg:items-start lg:gap-20 lg:px-16">
          <motion.div 
            className="flex w-full flex-col items-center gap-12 text-center lg:w-[58%] lg:items-start lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex flex-col gap-6" variants={itemVariants}>
              <motion.span 
                className="inline-flex items-center gap-2 self-center rounded-full border border-purple-300/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100 md:self-start"
                variants={itemVariants}
              >
                Strategic Digital Partner
              </motion.span>
              <motion.h1
                className="flex flex-col gap-2 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
                variants={titleVariants}
              >
                <span>Turn your ideas into</span>
                <span className="bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">
                  profitable digital products
                </span>
              </motion.h1>
              <motion.p 
                className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
                variants={subtitleVariants}
              >
                We combine strategy, creative marketing, and engineering to launch experiences your audience remembers. From
                high-converting landing pages to full digital ecosystems, Codebility moves modern brands forward.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center gap-4 md:flex-row lg:items-center"
              variants={buttonVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto"
              >
                <Link href="/bookacall" className="w-full md:w-auto">
                  <Button variant="purple" size="lg" rounded="full" className="w-full md:w-auto">
                    Book a Strategy Call
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto"
              >
                <Link href="/services" className="w-full md:w-auto">
                  <Button variant="outline" rounded="full" size="lg" className="w-full border-white/40 text-white md:w-auto">
                    View Our Built Apps
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-3"
              variants={metricsVariants}
            >
              {HIGHLIGHT_METRICS.map((metric) => (
                <motion.div
                  key={metric.label}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-lg shadow-purple-500/10 backdrop-blur"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <AnimatedMetrics
                    value={metric.value}
                    suffix={metric.suffix}
                    format={metric.format as "number" | "decimal"}
                    delay={0}
                  />
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60 md:text-sm">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative flex w-full max-w-[520px] flex-col gap-8 self-center lg:w-[45%] lg:self-start"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10"
              variants={containerVariants}
            >
              {MarketingCardData.slice(0, 5).map((data, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HeroCard
                    title={data.title}
                    description={data.description}
                    url={data.url}
                    category={data.category}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
        >
          <motion.div
            className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-purple-400/30 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -3, 0],
            }}
            transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-16 right-12 h-56 w-56 rounded-full bg-gradient-to-r from-purple-400/25 via-white/10 to-cyan-400/30 blur-3xl"
            animate={{
              y: [0, -12, 0],
              x: [0, 10, -6, 0],
            }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />
      </section>
    </div>
  );
};

export default Hero;
