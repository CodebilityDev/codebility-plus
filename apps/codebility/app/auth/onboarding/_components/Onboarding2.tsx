import { cn } from '@codevs/ui'
import Image from 'next/image';
import React from 'react'

interface Onboarding2Props {
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const Onboarding2: React.FC<Onboarding2Props> = ({ className, onNext, onPrev }) => {
  return (
    <>
      <div className="bg-black-400 relative w-screen h-screen overflow-hidden">
        <div
          className={cn(
            "opacity-70 absolute inset-0 z-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_#017780,_#441e70_40%,_#130a3d_70%,_#000000_100%)]",
            className,
          )}
        ></div>
        
        <div className="absolute inset-0 z-[1] bg-[url('https://codebility-cdn.pages.dev/assets/images/index/hero-grid.png')] bg-repeat opacity-70"></div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-12 lg:px-20 pb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-center">INTRODUCTION</h1>
          
          <div className="max-w-6xl mx-auto z-30 relative">
            <p className="tracking-wide text-justify text-sm sm:text-base md:text-lg lg:text-xl xl:text-4xl leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed">
              <span className="font-bold">Codebility</span> is a dynamic learning community designed to help aspiring developers, career shifters, and tech enthusiasts gain real-world coding experience. We hire interns to work on projects, allowing them to enhance their skills, collaborate with a team, and build a strong portfolio, preparing them to secure jobs or clients in the future.
            </p>
          </div>
          
          <div className="hidden sm:block z-20 absolute right-0 sm:right-20 md:right-40 lg:right-80 bottom-0 w-1/3 sm:w-1/2 md:w-2/5 lg:w-1/3 opacity-80 transform translate-y-[15%]">
            <Image 
              src="/assets/images/onboarding/box.png" 
              alt="box" 
              height={900}
              width={800}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding2