import { cn } from '@codevs/ui'
import React from 'react'
import Link from 'next/link'

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
      
      <div className="mb-20 absolute inset-0 z-10 flex flex-col items-end justify-center text-white text-end">
        <h1 className="text-5xl  md:text-6xl lg:text-8xl font-medium mb-40 mr-20 text-end">Ready to start your journey?</h1>
        
        <div className="flex flex-col items-end justify-center max-w-2xl text-end mr-20">
          <h2 className="text-3xl md:text-4xl lg:text-7xl font-medium mb-6 text-center leading-8">
            <span className='font-extrabold'>Join Codebility</span> and take the next step in your tech career!
          </h2>
          
          <Link href="/auth/sign-up" className="mt-8 mx-auto">
            <button className="bg-[#00904b] hover:bg-green text-white font-bold py-2 px-10 rounded-xl text-3xl transition-all duration-300">
              Apply Now
            </button>
          </Link>
        </div>
        
        <div className="z-[-12] absolute mt-28 left-0 ml-[-30px] top-1/2 transform -translate-y-1/2 rotate-[120deg] w-1/3 md:w-1/4 lg:w-[800px]">
          <img 
            src="/assets/images/onboarding/key.png" 
            alt="Key" 
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default Onboarding7