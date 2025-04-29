"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFadeAnimation } from "@/hooks/useFadeAnimation";

import { cn } from "@codevs/ui";
const { backgroundFade, fadeIn, timing } = useFadeAnimation()
const Onboarding1 = ({ className }: { className?: string }) => {
  return (
    <>
      <div className="bg-black-400 relative w-screen h-screen overflow-hidden">
        <div
          className={cn(
            "opacity-70 absolute inset-0 z-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#017780,_#441e70_40%,_#130a3d_70%,_#000000_100%)]",
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
           className="mb-6 text-4xl font-thin" >Welcome To</motion.h1>
          <motion.h1
           initial="hidden"
           animate="visible"
           variants={backgroundFade}
           transition={timing.background}
           className="mb-6 text-9xl font-bold">CODEBILITY</motion.h1>
          
        </div>
      </div>
    </>
  );
};

export default Onboarding1;
