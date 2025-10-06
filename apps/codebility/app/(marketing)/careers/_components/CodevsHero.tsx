"use client";

import { Rowdies } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import pathsConfig from "@/config/paths.config";

import SideNavMenu from "../../_components/MarketingSidenavMenu";
import OrbitingCirclesBackground from "./CodevsOrbitingCirclesBg";

const rowdies = Rowdies({
  weight: "300",
  subsets: ["latin"],
});

export default function CodevHero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-no-repeat"
    >
      <SideNavMenu />
      <div
        className="absolute left-1/2 top-1/2 h-[1100px] w-96 -translate-x-1/2 -translate-y-1/2 blur-3xl md:w-full xl:-left-10 xl:-top-96 xl:h-[1562.01px] xl:w-[1044.36px] xl:-translate-x-0 xl:-translate-y-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(151, 71, 255, 0.3) 0%, rgba(3, 3, 3, 0.3) 100%)",
        }}
      ></div>
      <OrbitingCirclesBackground />
      <div className="z-10 flex w-full flex-col gap-3 p-4 text-center text-white">
        <p className="text-sm lg:text-xl">Build Your Career With Us</p>
        <div className="relative">
          <h1
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl uppercase tracking-widest opacity-5 md:text-6xl lg:text-9xl ${rowdies.className}`}
          >
            Codebility
          </h1>
          <h2 className="text-xl font-semibold lg:text-5xl">
            Advance Your Tech Career{" "}
          </h2>
        </div>
        <p className="text-xs md:text-sm lg:text-2xl">
          Where Innovation Meets Opportunity and Talent Thrives
        </p>
        <div className="mx-auto mt-6 flex w-full flex-col justify-center gap-6 md:flex-row">
          <button
            onClick={() => {
              document.getElementById('open-positions')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="inline-flex h-11 items-center justify-center rounded-full bg-customViolet-100 px-8 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-customViolet-100/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:w-40"
          >
            View Jobs
          </button>
        </div>
      </div>

      <div className="hero-bubble">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
    </section>
  );
}
