import React from "react";

import { cn } from "@codevs/ui";
import Image from "next/image";


interface Onboarding1Props {
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

const Onboarding5: React.FC<Onboarding1Props> = ({ className, onNext, onPrev }) => {
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

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-white pb-20">
          <h1 className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            What are the <span className="text-white">BENEFITS</span>?
          </h1>

          <div className="mx-auto max-w-5xl">
            <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-left">
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-4xl">
                  Gain hands-on, practical experience by working on real
                  projects.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-4xl">
                  Collaborate with like-minded individuals and industry
                  professionals.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-4xl">
                  Expand your network and connect with mentors and peers.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-4xl">
                  Build and refine your personal portfolio to showcase your
                  skills.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 text-xl sm:text-2xl md:text-3xl text-white flex-shrink-0">•</span>
                <span className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-4xl">
                  Develop marketable skills that can help you land a job or
                  secure clients in the future.
                </span>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block absolute bottom-20 right-[34%] w-1/4 sm:w-1/3 translate-x-2/4 translate-y-1/4 transform opacity-80 mb-12">
            <Image
              src="/assets/images/onboarding/envelop.png"
              alt="Purple folder"
              height={900}
              width={700}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding5;
