"use client";

import { Skeleton } from "@/components/global/ui/skeleton";
import { ServicesCardData } from "@/constants/global/landing-data";

export function LandingFeaturesSkeleton() {
  return (
    <div className="flex flex-col gap-10 text-white" aria-hidden>
      <div className="mx-auto flex w-full max-w-[650px] flex-col gap-3 text-center">
        <p className="text-customViolet-100 text-lg md:text-2xl">
          In the Tech Industry
        </p>
        <h2 className="text-xl md:text-3xl">
          Codebility sparks a passion for{" "}
          <strong className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Technology and Innovation.
          </strong>
        </h2>
        <p className="text-gray">
          Our programs go beyond skill acquisition, because we believe in the
          transformative power of coding
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {ServicesCardData.map((data) => (
          <div
            key={data.title}
            className="border-dark-100 bg-black-600 z-10 w-full rounded-lg border-2 p-4"
          >
            <div className="flex flex-col gap-3">
              <div className="block overflow-hidden rounded-lg">
                <Skeleton className="aspect-[3/2] w-full rounded-lg bg-white/10" />
              </div>
              <h3 className="text-lg font-semibold">{data.title}</h3>
              <p className="text-sm text-gray-300">{data.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="md:mx-auto">
        <div className="inline-flex h-14 items-center justify-center rounded-full bg-[#9747FF] px-6 text-lg text-white">
          Book a call
        </div>
      </div>
    </div>
  );
}
