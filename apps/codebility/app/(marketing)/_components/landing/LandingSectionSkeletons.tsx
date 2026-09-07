"use client";

import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { ServicesCardData } from "@/constants/landing_data";

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

const WORK_WITH_US_CARDS = [
  {
    id: "portfolio",
    title: "Our Portfolio",
    description:
      "Build your next digital experience with a team that delivers reliable, cutting-edge work from discovery to launch.",
    linkText: "Explore Work",
  },
  {
    id: "hire-developers",
    title: "Hire Developers",
    description:
      "Accelerate delivery with vetted engineers, designers, and strategists who integrate seamlessly with your roadmap.",
    linkText: "Hire CoDevs",
  },
  {
    id: "developer-journey",
    title: "Be a Codev",
    description:
      "Join our community, sharpen your craft through real projects, and unlock career opportunities across the globe.",
    linkText: "Join the Program",
  },
  {
    id: "careers",
    title: "Career Opportunities",
    description:
      "Explore exciting career opportunities with our team. Join a dynamic environment where innovation meets collaboration.",
    linkText: "View Careers",
  },
] as const;

export function LandingWorkWithUsSkeleton() {
  return (
    <div
      className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 text-white md:px-6 lg:px-8"
      aria-hidden
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200">
          Work With Us
        </span>
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
          Build meaningful products with a partner that keeps momentum high.
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
          Whether you need a seasoned project team, specialist talent, or a
          launchpad for your own journey, Codebility brings world-class execution,
          mentorship, and community to every collaboration.
        </p>
      </div>

      <div className="mt-14 grid w-full grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-12">
        {WORK_WITH_US_CARDS.map((card, index) => (
          <div key={card.id} className="group relative w-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-gradient-to-br from-white/10 via-white/5 to-purple-950/20 p-6 shadow-xl backdrop-blur-md md:p-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-white/10" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-6 text-white md:mt-10">
                <h3 className="text-2xl font-semibold md:text-3xl">{card.title}</h3>
                <p className="text-base leading-relaxed text-white/75 md:text-lg">
                  {card.description}
                </p>
                <div className="pt-2">
                  <div className="inline-flex h-12 items-center justify-center rounded-full bg-[#9747FF] px-6 text-lg text-white shadow-lg shadow-purple-500/20">
                    {card.linkText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPartnersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white" aria-hidden>
      <div className="mb-12 text-center">
        <h2 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:text-5xl">
          Our Partners
        </h2>
        <p className="text-center text-lg text-gray-300 sm:text-xl">
          Meet Our Trusted Partners
        </p>
      </div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="relative flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <Skeleton className="h-full w-full rounded-md bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
