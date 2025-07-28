import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import BlueBg from "./LandingBlueBg";
import PurpleBg from "./LandingPurpleBg";

const WhyChoose = () => {
  return (
    <div id="3" className="text-light-900  relative  w-full p-2 md:p-12">
      <div className="flex flex-col items-center justify-center ">
        <div className=" max-w-[1200px] md:px-14">
          <h1 className="px-4 text-2xl font-bold md:px-0 md:text-3xl">
            Why Choose Codebility?
          </h1>
          <div className="flex w-full flex-col  gap-2 px-4 pt-10 md:flex-row md:items-center md:justify-center md:px-0 ">
            {/* 1st col */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-light-900/25 flex h-[400px] w-full flex-col justify-between rounded-lg p-6 md:max-w-[700px]">
                <h1 className="gap-4">
                  01 <span>Pushing Creativity Boundaries</span>
                </h1>
                <div>
                  <h2 className="text-3xl font-bold">Innovative Approach</h2>
                  <p>
                    Embrace innovation with Codebility. Crafting <br />
                    revolutionary digital solutions that create new posibilites
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <div className=" h-[320px] w-full   rounded-lg  ">
                  <Image

                    alt="A guy sitting"
                    src="/assets/images/campaign/guy-sitting.png"
                    width={300}
                    height={90}
                    className="h-[320px] w-full rounded-lg object-cover"
                  />
                </div>
                <div className="flex h-[320px] w-full flex-col gap-4 rounded-lg bg-[#0A0A0A] p-4 md:max-w-[600px]">
                  <h1>03</h1>
                  <h2 className="text-[#02FFE2]">Tailored for you</h2>
                  <h3 className="text-lg font-bold">
                    Customer- <br />
                    Centric Solution
                  </h3>
                  <p>
                    Understanding your vision and helping you bring your online
                    vision to life.{" "}
                  </p>
                </div>
              </div>
            </div>
            {/* 2nd col */}
            <div className="flex flex-col items-center justify-center gap-4 ">
              <div className="flex h-[400px] w-full flex-col  justify-between rounded-lg bg-[#6A78F2] p-6 md:h-[540px] md:pl-6 md:pt-6">
                <h1 className="gap-4">
                  02 <span>Digital Maestros Collective</span>
                </h1>
                <div className="flex flex-row">
                  <div className="flex max-w-[600px] flex-col">
                    <h2 className="pt-14 text-3xl font-bold">Expert Team</h2>

                    <p className=" pt-4">
                      At codebility our passionate experts bring their A-Game to
                      ensure you get top notch results.
                    </p>
                  </div>
                  <Image
                    src="/assets/images/campaign/laptop-browsing.png"
                    alt="Laptop Browsing"

                    width={410}
                    height={120}
                    className="hidden  md:block md:size-60 md:object-cover md:pt-36"
                  />
                </div>
              </div>
              <div className="bg-light-900/5 flex h-[180px]  w-full items-center justify-center rounded-lg">
                <h1 className="px-2 text-center text-2xl font-bold md:text-3xl">
                  Your Uniqueness is our focus
                </h1>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-10  pt-10 md:flex-row md:pt-40">
            <div className=" flex w-full flex-col rounded-lg  p-4  md:h-[560px]">
              <div className="w-full rounded-lg md:h-[400px] ">
                <Image
                  src="/assets/images/campaign/inquire.png"
                  alt="projects"
                  width={100}
                  className="w-full rounded-lg object-cover"

                  height={100}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="pt-0 md:pt-2">
                  Build your own website with us today and ensure a <br />{" "}
                  reliable, cutting-edge online presence.
                </h1>
                <Link
                  href="/services"
                  className="flex items-end justify-end md:pt-6"
                >
                  <Button
                    rounded="full"
                    variant="default"
                    className="border-light-900 border bg-[#0A0A0A] text-white"
                  >
                    Inquire Codebility
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-row justify-evenly">
              <BlueBg className="h-[400px] w-full max-w-[550px] lg:left-[15%] lg:top-[65%]" />
              <PurpleBg className="hidden h-[300px] w-full max-w-[450px] md:block lg:left-[55%] lg:top-[75%]" />
            </div>
            <div className="bg-light-900/5 flex w-full flex-col rounded-lg p-4 md:h-[560px]">
              <div className="w-full rounded-lg md:h-[400px]">
                <Image
                  src="/assets/images/campaign/codevs.png"
                  alt="codevs"
                  width={100}
                  height={100}
                  className="w-full rounded-lg object-cover"

                />
              </div>
              <div className="flex flex-col">
                <h1 className="pt-0 md:pt-2">
                  Connect with the best developer to meet your <br /> needs
                  through our top-rated professionals.
                </h1>
                <Link
                  href="/codev"
                  className="flex items-end justify-end md:pt-6"
                >
                  <Button
                    variant="purple"
                    rounded="full"
                    className="flex items-center justify-evenly gap-2"
                  >
                    Hire a CoDev{" "}
                    <span className="text-black-400 flex size-7 flex-col items-center justify-center rounded-full bg-white">
                      <Image
                        alt="arrow-right-icon"
                        src="/assets/svgs/icon-arrow-right.svg"
                        width={7}
                        height={7}
                        className="size-5 text-[#9747FF]"
                      />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
