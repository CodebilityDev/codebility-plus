"use client";

import { Skeleton } from "@/components/global/ui/skeleton";

export function LandingWhyChooseSkeleton() {
  return (
    <div className="flex flex-col gap-6 text-white md:gap-10" aria-hidden>
      <div className="w-full text-center">
        <h2 className="mb-8 text-xl md:text-3xl">Why Choose Codebility?</h2>
        <div className="mb-10 grid grid-cols-2 gap-6 rounded-xl border border-white/10 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 p-6 backdrop-blur md:grid-cols-4">
          {[
            { value: "120+", label: "Projects Completed" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "100+", label: "Expert Developers" },
            { value: "24/7", label: "Support Available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent md:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-gray-300 md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex grid-cols-1 grid-rows-4 flex-col gap-3 md:grid md:grid-cols-4 lg:gap-4">
        <div className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-1 row-end-1 overflow-hidden rounded-lg border-2 p-4 md:col-end-3 md:row-end-3 md:p-6">
          <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3 text-center">
            <Skeleton className="h-[150px] w-[150px] rounded-lg bg-white/10 lg:h-[300px] lg:w-[300px]" />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                Innovative Approach
              </h3>
              <p className="text-gray">
                Embrace innovation with Codebility. Crafting revolutionary digital
                solutions that create new posibilites
              </p>
            </div>
          </div>
        </div>

        <div className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-2 row-end-2 overflow-hidden rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-4 md:p-6">
          <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3">
            <Skeleton className="h-[150px] w-[150px] rounded-lg bg-white/10 lg:h-[400px] lg:w-[400px]" />
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                Reliable and Trusted
              </h3>
              <p className="text-gray">
                Codebility has a proven track record across diverse industries,
                trusted for our reliability, consistency, and on-time
                delivery—your dependable digital partner.
              </p>
            </div>
          </div>
        </div>

        <div className="relative col-start-1 col-end-2 row-start-3 row-end-5 hidden overflow-hidden rounded-xl bg-customBlue-100 lg:block">
          <Skeleton className="absolute inset-0 h-full w-full rounded-xl bg-white/10" />
        </div>

        <div className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-3 row-end-3 overflow-hidden rounded-lg border-2 p-4 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-2">
          <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3">
            <Skeleton className="h-[150px] w-[150px] rounded-lg bg-white/10 lg:h-[200px] lg:w-[200px]" />
            <div className="flex flex-col gap-2 text-center">
              <h3 className="font-medium md:text-2xl">
                Customer - Centric Solution
              </h3>
              <p className="text-gray">
                Understanding your vision and helping you bring your online vision
                to life.{" "}
              </p>
            </div>
          </div>
        </div>

        <div className="relative col-start-1 col-end-1 row-start-4 row-end-4 grid place-items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] md:col-start-3 md:col-end-5 md:row-end-5">
          <p className="relative z-10 py-10 text-lg font-medium md:text-2xl lg:text-3xl">
            Your Uniqueness is our focus
          </p>
        </div>
      </div>
    </div>
  );
}
