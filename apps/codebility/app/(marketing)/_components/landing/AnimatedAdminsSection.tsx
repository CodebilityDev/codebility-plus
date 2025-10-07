"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Codev } from "@/types/home/codev";
import AdminCard from "./LandingAdminCard";
import BlueBg from "./LandingBlueBg";

interface AnimatedAdminsSectionProps {
  title: string;
  description: string;
  members: Codev[];
  sectionId: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateY: -15,
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

const AnimatedAdminsSection = ({ 
  title, 
  description, 
  members, 
  sectionId 
}: AnimatedAdminsSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
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
        {title}
      </motion.h1>
      
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <motion.p 
            className="pt-8 text-center md:px-44 text-gray-300"
            variants={descriptionVariants}
          >
            {description}
          </motion.p>
          
          {/* Enhanced BlueBg with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4"
            variants={containerVariants}
          >
            {members.map((member: Codev, index: number) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                custom={index}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  transition: { 
                    duration: 0.3,
                    type: "spring",
                    bounce: 0.4
                  }
                }}
                whileTap={{ scale: 0.95 }}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="h-full relative"
                  whileHover={{
                    boxShadow: "0 20px 40px -12px rgba(147, 71, 255, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminCard
                    color={`bg-gradient-to-br ${
                      index % 4 === 0 ? 'from-purple-500/80 to-pink-500/80' :
                      index % 4 === 1 ? 'from-cyan-500/80 to-blue-500/80' :
                      index % 4 === 2 ? 'from-green-500/80 to-teal-500/80' :
                      'from-orange-500/80 to-red-500/80'
                    }`}
                    admin={member}
                  />
                  
                  {/* Hover overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedAdminsSection;