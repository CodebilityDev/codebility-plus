"use client";

import roadmapBg from "@/public/assets/images/onboarding/animation/infinite_road.json";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

export default function RoadMapIntro() {
  return (
    <section className="relative w-full overflow-hidden bg-[#3b3636] lg:min-h-screen">
      {/* Lottie Background */}
      <div className="pointer-events-none absolute inset-0 z-0 scale-[1.4] md:scale-[1.7]">
        <Lottie
          animationData={roadmapBg}
          loop
          autoplay
          className="h-full w-full object-cover"
        />
      </div>

      {/* Centered Text */}
      <div className="bg-black-600/65 relative z-10 flex flex-col items-center justify-center py-20 text-center lg:min-h-screen">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-[40px] font-extrabold text-pink-600 sm:text-[100px] md:text-[130px] lg:text-[170px]"
        >
          ROADMAP TO SUCCESS
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 text-base font-medium text-pink-600 sm:text-lg md:text-2xl"
        >
          Check your journey below
        </motion.h2>
      </div>
    </section>
  );
}
