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
        
        <div className="mb-20  absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-6 md:px-12 lg:px-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-12">INTRODUCTION</h1>
          
          <div className="max-w-6xl mx-auto z-30">
            <p className="tracking-wide text-justify text-lg md:text-xl lg:text-4xl leading-relaxed md:leading-relaxed lg:leading-relaxed">
              <span className="font-bold">Codebility</span> is a dynamic learning community designed to help aspiring developers, career shifters, and tech enthusiasts gain real-world coding experience. We hire interns to work on projects, allowing them to enhance their skills, collaborate with a team, and build a strong portfolio, preparing them to secure jobs or clients in the future.
            </p>
          </div>
          
          <div className="z-20 absolute right-80 bottom-0 w-1/2 md:w-2/5 lg:w-1/3 opacity-80 m-[-15%]">
            <Image 
              src="/assets/images/onboarding/box.png" 
              alt="box" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding2