// AboutSlides.tsx

"use client";

import { RefObject } from "react";

interface AboutSlidesProps {
  slidesRef: RefObject<HTMLDivElement | null>;
}

export default function AboutSlides({ slidesRef }: AboutSlidesProps) {
  return (
    <div
      ref={slidesRef}
      className="flex h-full transition-transform duration-500"
      style={{ width: `calc(100vw * 4)` }}
    >
      <div className="flex w-screen items-center justify-center bg-red-500">
        <h3>About</h3>
      </div>
      <div className="flex w-screen items-center justify-center bg-green-500">
        <h3>Mission</h3>
      </div>
      <div className="flex w-screen items-center justify-center bg-blue-500">
        <h3>Vision</h3>
      </div>
      <div className="flex w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <h2 className="mb-2 text-4xl font-bold">Core Values</h2>
          <p className="text-lg opacity-70">Let’s Get Started</p>
        </div>
      </div>
    </div>
  );
}
