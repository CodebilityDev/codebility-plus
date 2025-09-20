import React from "react";
import BlueBg from "./LandingBlueBg";
import Section from "../MarketingSection";
import LandingInternPagination from "./LandingInternPagination";

export default async function InternSectionContainer(){
    return (
        <Section id="interns" className="text-light-900 relative w-full pt-10">
            <div className="w-full">
                    <h1 className="text-center text-3xl font-bold">Codebility Interns</h1>
                    <div className="flex flex-col items-center justify-center">
                      <div className="max-w-[1100px] px-4">
                        <p className="pt-8 pb-10 text-center md:px-44">
                          Discover the driving force behind CODEVS&apos; success. Our Interns bring fresh 
                          advantage, high-level performance, and the power to turn ideas into impact—propelling 
                          us forward with energy and determination.
                        </p>
                        <LandingInternPagination />
                        <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
                        <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
                          {/* All active interns in all position to be display here with pagination */}
                        </div>
                      </div>
                    </div>
                  </div>
        </Section>
    );
}