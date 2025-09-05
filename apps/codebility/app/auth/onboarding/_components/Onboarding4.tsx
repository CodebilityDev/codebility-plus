import { cn } from '@codevs/ui'
import Image from 'next/image';

import React from 'react'

interface Onboarding1Props {
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const Onboarding4: React.FC<Onboarding1Props> = ({ className, onNext, onPrev }) => {
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
      
      <div className="absolute inset-0 z-10 flex flex-col items-end justify-center text-white px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 md:mb-10 text-right">VISION</h1>
        
        <div className="max-w-5xl text-right mb-10 sm:mb-15 md:mb-20 z-20 pl-4 sm:pl-8 md:pl-0">
          <div className="flex flex-col space-y-4 text-sm sm:text-base md:text-xl lg:text-2xl xl:text-5xl leading-6 sm:leading-7 md:leading-8 lg:leading-relaxed text-justify sm:text-right">
            <p>Our goal is to become a leading tech community that nurtures top-tier developers.
            We aim to equip them with real-world experience and industry-relevant skills to succeed in the tech industry.</p>
          </div>
        </div>
        
        <div className="hidden sm:block z-[-12] absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[10%] w-1/4 sm:w-1/3 md:w-2/5 lg:w-3/3 opacity-90">
          <Image
            src="/assets/images/onboarding/gear.png" 
            alt="Gear" 
            height={900}
            width={700}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default Onboarding4