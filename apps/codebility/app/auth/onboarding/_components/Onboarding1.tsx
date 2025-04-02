"use client";

import React from "react";
import HeroBackground from "@/app/(marketing)/_components/landing/LandingHeroBg";

import { cn } from "@codevs/ui";

const Onboarding1 = ({ className }: { className?: string }) => {
  return (
    <>
      <div className="bg-black-400 relative w-screen h-screen overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 z-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#017780,_#441e70_40%,_#130a3d_70%,_#000000_100%)]",
            className,
          )}
        ></div>
        
        {/* Optional grid overlay */}
        <div className="absolute inset-0 z-[1] bg-[url('https://codebility-cdn.pages.dev/assets/images/index/hero-grid.png')] bg-repeat opacity-20"></div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
          <h1 className="mb-6 text-6xl font-bold">Welcome To</h1>
          <h1 className="mb-6 text-9xl font-bold">CODEBILITY</h1>
          
        </div>
      </div>
    </>
  );
};

export default Onboarding1;
