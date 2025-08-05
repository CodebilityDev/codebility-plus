"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";

import { Button } from "@codevs/ui/button";

export default function NdaSuccessPage() {
  return (
    <div className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
        <Logo />
        <div>
          <p className="mb-2 text-lg md:text-lg lg:text-3xl">
            Your NDA has been signed successfully.
          </p>
          <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
            Thank you for completing this important step. You can now proceed with your Codebility journey.
          </p>
        </div>
        <Link href="/">
          <Button className="from-customTeal to-customViolet-100 h-10 w-32 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36">
            <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
              Go to Home
            </span>
          </Button>
        </Link>

        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
