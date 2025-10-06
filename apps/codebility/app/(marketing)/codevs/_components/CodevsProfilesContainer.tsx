"use client";

import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";
import { motion } from "framer-motion";

export default function CodevsProfilesContainer() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="mx-auto"
      >
        <H2 className="text-white">Meet Our CoDevs</H2>
      </motion.div>
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="text-gray mx-auto max-w-[650px] text-center"
      >
        <Heading3>See Who You'll Be Working With</Heading3>
        <IntroText>
          Get inspired by our current CoDevs who started their journey just like you. 
          These talented developers have grown their skills through real-world projects 
          and are now contributing to amazing products worldwide.
        </IntroText>
      </motion.div>
    </div>
  );
}