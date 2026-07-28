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
    viewport={{ once: false, amount: 0.3 }}
    className="relative z-10 mx-auto"
  >
    <H2 className="text-white drop-shadow-lg">Our Skilled Network</H2>
  </motion.div>
  <motion.div
    variants={fadeInOutDownToUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, amount: 0.3 }}
    className="relative z-10 mx-auto max-w-auto px-6 py-2 text-center shadow-xl backdrop-blur-sm"
  >
    <p className="text-gray-200 text-2xl leading-relaxed">
      Discover our carefully vetted professionals, ready to join your team and deliver exceptional results. Every member brings proven expertise, strong communication, and a passion for getting things done right.
    </p>
  </motion.div>
</div>
  );
}