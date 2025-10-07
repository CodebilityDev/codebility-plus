"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { ServicesCardData } from "@/constants/landing_data";
import Container from "../MarketingContainer";
import Section from "../MarketingSection";
import FeaturesCard from "./LandingFeaturesCard";

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

const headerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateY: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section id="features" className="relative w-full pt-10 text-white">
      <Container className="flex flex-col gap-10 text-white">
        <motion.div 
          ref={ref}
          className="flex max-w-[650px] flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.p 
            className="text-customViolet-100 text-left text-lg md:text-2xl"
            variants={headerVariants}
          >
            In the Tech Industry
          </motion.p>
          <motion.h2 
            className="text-left text-xl md:text-3xl"
            variants={headerVariants}
          >
            Codebility sparks a passion for{" "}
            <motion.strong
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8,
                type: "spring",
                bounce: 0.4
              }}
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Technology and Innovation.
            </motion.strong>
          </motion.h2>
          <motion.p 
            className="text-gray"
            variants={headerVariants}
          >
            Our programs go beyond skill acquisition, 
            because we believe in the transformative power of coding
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {ServicesCardData.map((data, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: "1000px" }}
            >
              <FeaturesCard
                imageAlt={data.imageAlt}
                imageName={data.imageUrl}
                description={data.description}
                title={data.title}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="md:mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <a href="#book">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden rounded-full"
              >
                <Button
                  variant="purple"
                  size="lg"
                  rounded="full"
                  className="h-14 relative z-10"
                >
                  Book a call
                </Button>
                {/* Magnetic effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-0"
                  whileHover={{ opacity: 0.8, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </a>
          </div>
        </motion.div>
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-[#6A78F2] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default Features;
