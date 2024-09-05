import React from "react";
import Image from "next/image";
import { Button } from "@/Components/ui/button";

import { MarketingCardData } from "../../_lib/dummy-data";
import GridBg from "./landing-grid-bg";
import MarketingCard from "./landing-marketing-card";
import PurpleBg from "./landing-purple-bg";

const Marketing = () => {
  return (
    <div className="w-full">
      <PurpleBg className="h-[600px] w-full max-w-[700px] lg:left-[25%] lg:top-[25%]" />
      <GridBg />
      <section
        id="1"
        className="text-light-900 relative flex min-h-screen w-full md:flex-row  md:justify-between "
      >
        <div className="hidden pt-32 md:block">
          <Image
            src="/assets/images/campaign/left-task.png"
            unoptimized
            alt=""
            width={200}
            height={100}
            className="h-[400px] w-[250px]"
          />
        </div>
        <div className="z-[9999] flex flex-col items-center justify-center">
          <div className="max-w-[704px] px-4">
            <h1 className="pt-20 text-center text-2xl font-bold uppercase md:pt-32 md:text-2xl">
              Codebility
            </h1>
            <h2 className="pt-2 text-center text-3xl font-bold md:text-5xl">
              We lead in digital <br /> innovation & design
            </h2>
            <h3 className="py-4 text-center text-lg">
              Helping you achieve impact results
            </h3>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row ">
              <Button variant="purple" rounded="full">
                Start your custom solution
              </Button>
              <Button
                variant="outlined"
                className="hover:opacity-15"
                rounded="full"
              >
                Learn more.
              </Button>
            </div>
            <div className=" grid w-full grid-cols-1 pt-10 md:grid md:grid-cols-2  md:pt-20 ">
              {MarketingCardData.map((data, index) => (
                <MarketingCard
                  key={index}
                  title={data.title}
                  description={data.description}
                  className={`${index === 0 ? "bg-white/40" : "bg-white/5"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block md:pt-80">
          <Image
            src="/assets/images/campaign/right-task.png"
            unoptimized
            alt=""
            width={200}
            height={100}
            className="h-[300px] w-[200px]"
          />
        </div>
      </section>
    </div>
  );
};

export default Marketing;
