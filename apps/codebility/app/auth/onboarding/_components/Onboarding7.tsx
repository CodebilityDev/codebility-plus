import { cn } from '@codevs/ui'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

interface Onboarding1Props {
  onPrev: () => void;
  className?: string;
}

const Onboarding7: React.FC<Onboarding1Props> = ({ className, onPrev }) => {
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
      
      <div className="absolute inset-0 z-10 flex flex-col items-center sm:items-end justify-center text-white text-center sm:text-end px-4 sm:px-8 md:px-12 lg:px-20 pb-20 sm:pb-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-8xl font-medium mb-8 sm:mb-20 md:mb-30 lg:mb-40 text-center sm:text-right">Ready to start your journey?</h1>
        
        <div className="flex flex-col items-center sm:items-end justify-center max-w-2xl text-center sm:text-end">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-7xl font-medium mb-6 leading-6 sm:leading-7 md:leading-8">
            <span className='font-extrabold'>Join Codebility</span> and take the next step in your tech career!
          </h2>
          
          <Link href="/auth/sign-up" className="mt-6 sm:mt-8">
            <button className="bg-[#00904b] hover:bg-green text-white font-bold py-2 sm:py-3 px-6 sm:px-8 md:px-10 rounded-xl text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all duration-300">
              Apply Now
            </button>
          </Link>
        </div>
        
        <div className="hidden sm:block z-[-12] absolute left-0 ml-[-30px] top-1/2 transform -translate-y-1/2 rotate-[120deg] w-1/4 sm:w-1/3 md:w-1/4 lg:w-[800px]">
          <Image 
            src="/assets/images/onboarding/key.png" 
            alt="Key" 
            height={900}
            width={700}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default Onboarding7