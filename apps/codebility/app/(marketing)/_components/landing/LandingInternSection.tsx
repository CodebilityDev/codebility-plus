import React from "react";
import Link from "next/link";
import BlueBg from "./LandingBlueBg";
import Section from "../MarketingSection";
import LandingInternPagination from "./LandingIntern-CodevPagination";
import { Button } from "@/components/ui/button";

export default function InternSectionContainer(){
    return (
        <Section id="codevs" className="text-light-900 relative w-full pt-10">
            <div className="w-full">
                <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    Codebility CoDevs
                </h1>
                <div className="flex flex-col items-center justify-center">
                    <div className="max-w-[1100px] px-4">
                        <p className="pt-8 pb-10 text-center md:px-44 text-gray-300">
                            Discover the driving force behind CODEVS&apos; success. Our CoDevs bring fresh 
                            advantage, high-level performance, and the power to turn ideas into impact—propelling 
                            us forward with energy and determination.
                        </p>
                        
                        <div>
                            <LandingInternPagination />
                        </div>
                        
                        {/* Hire a CoDevs Button */}
                        <div className="flex justify-center mt-8 mb-12">
                            <div className="relative">
                                <Link href="/hire-a-codev" className="relative z-10">
                                    <Button 
                                        variant="purple" 
                                        size="lg" 
                                        rounded="full" 
                                        className="relative z-10 px-8 py-3 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                                    >
                                        <span className="flex items-center gap-2">
                                            Hire a CoDevs
                                            <span>→</span>
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        <div>
                            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}