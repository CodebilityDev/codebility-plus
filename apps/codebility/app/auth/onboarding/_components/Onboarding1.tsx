"use client";

import React from "react";
import { useFadeAnimation } from "@/hooks/useFadeAnimation";
import { motion } from "framer-motion";

import { cn } from "@codevs/ui";

interface Onboarding1Props {
  onNext: () => void;
  className?: string;
}

const Onboarding1: React.FC<Onboarding1Props> = ({ className, onNext }) => {
  const { backgroundFade, timing } = useFadeAnimation();
  return (
    <>
      <div className="bg-black-400 relative h-screen w-screen overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 z-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_#017780,_#441e70_40%,_#130a3d_70%,_#000000_100%)] opacity-70",
            className,
          )}
        ></div>

        {/* Optional grid overlay */}
        <div className="absolute inset-0 z-[1] bg-[url('https://codebility-cdn.pages.dev/assets/images/index/hero-grid.png')] bg-repeat opacity-70"></div>

        <div className="mb-30 absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={backgroundFade}
            transition={timing.background}
            className="mb-6 text-4xl font-thin"
          >
            Welcome To
          </motion.h1>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={backgroundFade}
            transition={timing.background}
            className="mb-6 text-9xl font-bold"
          >
            CODEBILITY
          </motion.h1>
        </div>
      </div>
    </>
  );
};

export default Onboarding1;
