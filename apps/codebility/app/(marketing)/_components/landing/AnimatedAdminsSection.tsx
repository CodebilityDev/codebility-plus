"use client";

import { motion } from "framer-motion";
import { Codev } from "@/types/home/codev";

import AdminCard from "./LandingAdminCard";
import BlueBg from "./LandingBlueBg";

interface AnimatedAdminsSectionProps {
  title: string;
  description: string;
  members: Codev[];
  sectionId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

const AnimatedAdminsSection = ({
  title,
  description,
  members,
  sectionId,
}: AnimatedAdminsSectionProps) => {
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-section={sectionId}
    >
      <motion.h1
        className="text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        {title}
      </motion.h1>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <motion.p
            className="pt-8 text-center md:px-44 text-gray-300"
            variants={itemVariants}
          >
            {description}
          </motion.p>

          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {members.map((member: Codev) => (
              <motion.div
                key={member.id}
                className="h-full relative"
                variants={itemVariants}
              >
                <AdminCard admin={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedAdminsSection;