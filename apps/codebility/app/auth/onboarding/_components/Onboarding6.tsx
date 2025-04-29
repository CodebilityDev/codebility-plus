import { cn } from '@codevs/ui'
import React from 'react'


interface Onboarding1Props {
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const Onboarding6: React.FC<Onboarding1Props> = ({ className, onNext, onPrev }) => {
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
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-12 md:px-16 lg:px-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10">What should you EXPECT in joining Us?</h1>
        
        <div className="max-w-7xl ml-20 mb-20">
          <ul className="space-y-4 md:space-y-5 lg:space-y-6 text-left">
            <li className="flex items-start">
              <span className="text-white mr-3 text-4xl">•</span>
              <span className="text-lg md:text-xl lg:text-4xl">This is not structured like a bootcamp. We learn here through self-studying and mentorship.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3 text-4xl">•</span>
              <span className="text-lg md:text-xl lg:text-4xl">We will become your tool, accountability partner, and motivation to build your portfolio.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3 text-4xl">•</span>
              <span className="text-lg md:text-xl lg:text-4xl">This is not open for On-the-job trainings that requires Memorandum of Agreement for students. However, you may use this opportunity to boost your resume.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3 text-4xl">•</span>
              <span className="text-lg md:text-xl lg:text-4xl">This is NOT an immediate career path, but a stepping stone.</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-3 text-4xl">•</span>
              <span className="text-lg md:text-xl lg:text-4xl">This is NOT for people who immediately expect to have salaries/commission.</span>
            </li>
          </ul>
        </div>
        
        <div className="z-[-12] absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 md:w-1/4 lg:w-2/5 opacity-80">
          <img 
            src="/assets/images/onboarding/asterisk.png" 
            alt="Asterisk" 
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  </>
  )
}

export default Onboarding6