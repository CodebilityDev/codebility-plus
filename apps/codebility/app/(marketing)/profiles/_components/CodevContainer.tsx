"use client";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";
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
        <div className="mb-4 text-white">
          <Heading3>Meet Our Skilled Team Network</Heading3>
        </div>
        <div className="text-gray-200">
          <IntroText>
            Discover our carefully vetted professionals, ready to join your team 
            and deliver exceptional results. Every member brings proven expertise,
            strong communication, and a passion for getting things done right. 
          </IntroText>
        </div>
      </motion.div>
    </div>
  );
}