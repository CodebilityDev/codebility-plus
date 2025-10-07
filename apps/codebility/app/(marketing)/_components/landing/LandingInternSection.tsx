"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import BlueBg from "./LandingBlueBg";
import Section from "../MarketingSection";
import LandingInternPagination from "./LandingIntern-CodevPagination";
import { Button } from "@/components/ui/button";

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

const titleVariants = {
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

const descriptionVariants = {
  hidden: { opacity: 0, y: 30 },
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

const buttonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function InternSectionContainer(){
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <Section id="codevs" className="text-light-900 relative w-full pt-10">
            <motion.div 
                ref={ref}
                className="w-full"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.h1 
                    className="text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                    variants={titleVariants}
                >
                    Codebility CoDevs
                </motion.h1>
                <div className="flex flex-col items-center justify-center">
                    <div className="max-w-[1100px] px-4">
                        <motion.p 
                            className="pt-8 pb-10 text-center md:px-44 text-gray-300"
                            variants={descriptionVariants}
                        >
                            Discover the driving force behind CODEVS&apos; success. Our CoDevs bring fresh 
                            advantage, high-level performance, and the power to turn ideas into impact—propelling 
                            us forward with energy and determination.
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <LandingInternPagination />
                        </motion.div>
                        
                        {/* Hire a CoDevs Button */}
                        <motion.div 
                            className="flex justify-center mt-8 mb-12"
                            variants={buttonVariants}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                {/* Animated border gradient */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 p-[2px]"
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <div className="h-full w-full rounded-full bg-black-400" />
                                </motion.div>
                                
                                <Link href="/hire-a-codev" className="relative z-10">
                                    <Button 
                                        variant="purple" 
                                        size="lg" 
                                        rounded="full" 
                                        className="relative z-10 px-8 py-3 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                                    >
                                        <motion.span
                                            initial={{ opacity: 0.8 }}
                                            whileHover={{ opacity: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            Hire a CoDevs
                                            <motion.span
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ 
                                                    duration: 2, 
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                →
                                            </motion.span>
                                        </motion.span>
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 1, delay: 0.7 }}
                        >
                            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Section>
    );
}