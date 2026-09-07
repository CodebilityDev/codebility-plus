import { Rowdies } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import OrbitingCirclesBackground from "./CodevsOrbitingCirclesBg";

const rowdies = Rowdies({
  weight: "300",
  subsets: ["latin"],
});

const heroContentClassName =
  "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-4 text-center text-white";

export default function Hero() {
  const skeleton = (
    <div className={heroContentClassName}>
      <p className="text-sm lg:text-xl">Find Your Next Developer</p>
      <div className="relative">
        <h1
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl uppercase tracking-widest opacity-5 md:text-6xl lg:text-9xl ${rowdies.className}`}
        >
          Codebility
        </h1>
        <h2 className="text-xl font-semibold lg:text-5xl">
          Hire Talented Codevs
        </h2>
      </div>
      <p className="text-xs md:text-sm lg:text-2xl">
        Connect with skilled developers ready to bring your projects to life
      </p>
      <div className="mx-auto mt-6 flex w-full justify-center">
        <Link href="#codevs">
          <Button className="from-customTeal to-customViolet-100 h-12 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br md:w-40">
            <span className="bg-black-500 flex h-full w-full items-center justify-center rounded-full text-sm text-white lg:text-lg">
              Hire Codevs
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-cover bg-no-repeat pt-24"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[1100px] w-96 -translate-x-1/2 -translate-y-1/2 blur-3xl md:w-full xl:-left-10 xl:-top-96 xl:h-[1562.01px] xl:w-[1044.36px] xl:-translate-x-0 xl:-translate-y-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(151, 71, 255, 0.3) 0%, rgba(3, 3, 3, 0.3) 100%)",
        }}
      />
      <OrbitingCirclesBackground />
      <MarketingProgressiveSection className="z-10 w-full flex-1" skeleton={skeleton}>
        <div className={heroContentClassName}>
          <p className="text-sm lg:text-xl">Find Your Next Developer</p>
          <div className="relative">
            <h1
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl uppercase tracking-widest opacity-5 md:text-6xl lg:text-9xl ${rowdies.className}`}
            >
              Codebility
            </h1>
            <h2 className="text-xl font-semibold lg:text-5xl">
              Hire Talented Codevs
            </h2>
          </div>
          <p className="text-xs md:text-sm lg:text-2xl">
            Connect with skilled developers ready to bring your projects to life
          </p>
          <div className="mx-auto mt-6 flex w-full justify-center">
            <Link href="#codevs">
              <Button className="from-customTeal to-customViolet-100 h-12 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br md:w-40">
                <span className="bg-black-500 flex h-full w-full items-center justify-center rounded-full text-sm text-white lg:text-lg">
                  Hire Codevs
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </MarketingProgressiveSection>

      <div className="hero-bubble">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
    </section>
  );
}
