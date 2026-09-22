"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Section from "../MarketingSection";
import BlueBg from "./LandingBlueBg";
import ProgressiveMotion from "./ProgressiveMotion";
import LandingInternSkeleton from "./LandingInternSkeleton";

export default function LandingInternShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Section id="codevs" className="text-light-900 relative w-full pt-10">
      <div data-landing-section>
        <div data-landing-skeleton>
          <div className="flex w-full flex-col items-center">
            <h1 className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent">
              Codebility CoDevs
            </h1>
            <p className="w-full max-w-[1100px] px-4 pb-10 pt-8 text-center text-gray-300 md:px-44">
              Discover the driving force behind CODEVS&apos; success. Our CoDevs
              bring fresh advantage, high-level performance, and the power to turn
              ideas into impact—propelling us forward with energy and
              determination.
            </p>
            <div className="flex w-full flex-col items-center justify-center">
              <div className="w-full max-w-[1100px] px-4">
                <LandingInternSkeleton />
                <div className="mb-12 mt-8 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#9747FF] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/25">
                    Hire a CoDevs
                    <span>→</span>
                  </div>
                </div>
                <div>
                  <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-landing-content>
          <div className="w-full">
            <div className="flex w-full flex-col items-center">
              <ProgressiveMotion
                className="flex w-full flex-col items-center"
                y={24}
                duration={0.55}
                staggerChildren={0.12}
              >
                <h1
                  data-progressive-child
                  className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent"
                >
                  Codebility CoDevs
                </h1>
                <p
                  data-progressive-child
                  className="w-full max-w-[1100px] px-4 pb-10 pt-8 text-center text-gray-300 md:px-44"
                >
                  Discover the driving force behind CODEVS&apos; success. Our CoDevs
                  bring fresh advantage, high-level performance, and the power to
                  turn ideas into impact—propelling us forward with energy and
                  determination.
                </p>
              </ProgressiveMotion>

              <div className="flex w-full flex-col items-center justify-center">
                <div className="w-full max-w-[1100px] px-4">
                  {children}

                  <ProgressiveMotion
                    className="mb-12 mt-8 flex justify-center"
                    y={20}
                    duration={0.5}
                  >
                    <div className="relative">
                      <Link href="/hire-a-codev" className="relative z-10">
                        <Button
                          variant="purple"
                          size="lg"
                          rounded="full"
                          className="relative z-10 px-8 py-3 font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                        >
                          <span className="flex items-center gap-2">
                            Hire a CoDevs
                            <span>→</span>
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </ProgressiveMotion>

                  <div>
                    <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
