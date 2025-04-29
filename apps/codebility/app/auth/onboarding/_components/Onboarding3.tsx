import { cn } from '@codevs/ui'
import Image from 'next/image';
import React from 'react'

interface Onboarding1Props {
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const Onboarding3: React.FC<Onboarding1Props> = ({ className, onNext, onPrev }) => {
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
      
      <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-white px-16 md:px-24 lg:px-32">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10">MISSION</h1>
        
        <div className="max-w-6xl mb-20 z-20">
          <div className="flex flex-col space-y-6 text-xl/10 md:text-2xl lg:text-5xl  text-justify leading-8">
            <p className=''>We empower students, career shifters, and tech enthusiasts by providing a supportive learning environment.
          Through hands-on experience and mentorship, we help them develop coding skills, upskill, and advance their careers. </p>
          </div>
        </div>
        
        <div className="z-10 absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 md:w-2/5 lg:w-2/2 opacity-90">
          <Image
            src="/assets/images/onboarding/hourglass.png" 
            alt="Hourglass" 
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default Onboarding3