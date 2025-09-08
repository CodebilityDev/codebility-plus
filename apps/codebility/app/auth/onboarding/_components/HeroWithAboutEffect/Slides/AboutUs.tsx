// components/HeroWithAboutEffect/AboutUs.tsx

"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function AboutUsSlide() {
  return (
    <div className="slide flex lg:h-screen w-screen flex-col items-center justify-center px-6 md:flex-row md:px-16">
      {/* LEFT: Lottie Animation */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <Lottie
          animationData={require("@/public/assets/images/onboarding/animation/developer-01-whoooa.json")}
          className="w-[280px] sm:w-[400px] md:w-[500px] lg:w-[550px]"
          loop
          autoplay
        />
      </div>

      {/* RIGHT: Text Content */}
      <div className="mt-10 w-full text-stone-900 md:mt-0 md:w-1/2 md:pl-10">
        <h2 className="text-center text-4xl font-bold sm:text-5xl md:text-left">
          ABOUT <span className="text-purple-600">US</span>
        </h2>

        <p className="mt-6 text-base leading-relaxed md:text-lg">
          Codebility is not a traditional bootcamp. It’s a growing community of
          aspiring and experienced developers who collaborate, learn, and build
          real-world projects together. Think of it as a supportive ecosystem
          where members gain experience, grow their skills, and boost their
          portfolios through teamwork and mentorship.
        </p>

        <div className="mt-6 space-y-2 text-base">
          <p className="font-semibold">We provide:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Access to mini-projects and internal tools</li>
            <li>Guidance from experienced team leads</li>
            <li>Opportunities to get involved in client or open-source work</li>
          </ul>
        </div>

        <p className="mt-6 text-base leading-relaxed md:text-lg">
          However, joining Codebility doesn’t replace the need to study and
          build your own foundation. Members are expected to continue learning
          on their own, and then apply those skills in the community to
          accelerate their growth.
        </p>
      </div>
    </div>
  );
}
