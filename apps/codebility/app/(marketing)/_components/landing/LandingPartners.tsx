"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import Section from "../MarketingSection";

const partners = [
  {
    name: "Genius Web Services",
    logo: "/assets/images/partners/genius-web-services.png",
  },
  { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
  { name: "Netmedia", logo: "/assets/images/partners/netmedia.png" },
  { name: "Zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
  { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
  { name: "Ai", logo: "/assets/images/partners/ai.png" },
  { name: "Averps", logo: "/assets/images/partners/averps.png" },
  { name: "Tolle Design", logo: "/assets/images/partners/tolle-design.png" },
  { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
  {
    name: "Federal PLANS",
    logo: "/assets/images/partners/federal-plans.png",
  },
  { name: "Web Divine", logo: "/assets/images/partners/web-divine.png" },
  { name: "FixFlow.ai", logo: "/assets/images/partners/fixflow-ai.png" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
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

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const gridVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const partnerCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.8,
    rotateY: -15
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
};

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section id="partners" className="relative w-full pt-10 text-white">
      <motion.div 
        ref={ref}
        className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2 
          className="mb-6 text-center text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent sm:text-5xl"
          variants={titleVariants}
        >
          Our Partners
        </motion.h2>
        
        <motion.p 
          className="mb-12 text-center text-lg text-gray-300 sm:text-xl"
          variants={subtitleVariants}
        >
          Meet Our Trusted Partners
        </motion.p>
        
        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
          variants={gridVariants}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="group relative flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300"
              variants={partnerCardVariants}
              whileHover={{ 
                scale: 1.08,
                y: -8,
                rotateY: 5,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ 
                  x: "100%", 
                  opacity: [0, 1, 0],
                  transition: { 
                    duration: 0.8,
                    ease: "easeInOut"
                  }
                }}
              />
              
              <motion.div
                className="relative z-10 h-full w-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </motion.div>
              
              {/* Floating particles effect */}
              <motion.div
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100"
                animate={{
                  y: [0, -8, 0],
                  x: [0, 4, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100"
                animate={{
                  y: [0, 6, 0],
                  x: [0, -3, 0],
                  scale: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 h-24 w-24 rounded-full bg-gradient-to-r from-cyan-500/10 to-transparent blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </Section>
  );
}
