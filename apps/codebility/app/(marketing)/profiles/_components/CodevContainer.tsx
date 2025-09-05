"use client";

import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";
import { Codev } from "@/types/home/codev";
import { motion } from "framer-motion";

export default function CodevContainer() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="mx-auto"
      >
        <H2 className="text-white">Codevs</H2>
      </motion.div>
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="text-gray mx-auto max-w-[650px] text-center"
      >
        <Heading3>Introducing Our Team of Developers</Heading3>
        <IntroText>
          We are thrilled to have you join our core team - the CoDevs. Our
          talented and dedicated developers are shaping the digital future with
          their skills and passion.
        </IntroText>
      </motion.div>
    </div>
  );
}
