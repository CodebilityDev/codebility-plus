"use client";

import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";
import { Codev } from "@/types/home/codev";
import { motion } from "framer-motion";

export default function CodevContainer() {
  return (
    <div className="relative flex flex-col gap-6">
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="relative z-10 mx-auto"
      >
        <H2 className="text-white drop-shadow-lg">Codevs</H2>
      </motion.div>
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="relative z-10 mx-auto max-w-[700px] rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-xl backdrop-blur-sm"
      >
        <Heading3 className="mb-4 text-white">
          Meet Our Skilled Developer Network
        </Heading3>
        <IntroText className="text-gray-200">
          Discover our carefully vetted CoDevs ready to join your team. Each
          developer brings proven expertise, strong communication skills, and a
          passion for delivering exceptional results on your projects.
        </IntroText>
      </motion.div>
    </div>
  );
}
