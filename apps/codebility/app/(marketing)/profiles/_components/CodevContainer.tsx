"use client";

import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";
import { Codev } from "@/types/home/codev";
import { motion } from "framer-motion";

export default function CodevContainer() {
  return (
    <div className="flex flex-col gap-6 relative">
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="mx-auto relative z-10"
      >
        <H2 className="text-white drop-shadow-lg">Codevs</H2>
      </motion.div>
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="mx-auto max-w-[700px] text-center relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <Heading3 className="text-white mb-4">Meet Our Skilled Developer Network</Heading3>
        <IntroText className="text-gray-200">
          Discover our carefully vetted CoDevs ready to join your team. Each developer 
          brings proven expertise, strong communication skills, and a passion for delivering 
          exceptional results on your projects.
        </IntroText>
      </motion.div>
    </div>
  );
}
