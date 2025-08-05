import React from "react";
import ServicesCard from "@/app/(marketing)/_components/landing/LandingServicesCard";
import { Button } from "@/components/ui/button";

import { ServicesCardData } from "@/constants/landing_data";

const Services = () => {
  return (
    <div id="2" className="text-light-900 relative min-h-screen  w-full pt-20">
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1000px] px-4">
          <h1 className="text-left text-lg text-[#9747FF]">
            In the tech industry
          </h1>
          <h2 className="text-left text-3xl">
            Codebility sparks for a passion for{" "}
            <strong>
              technology <br />
              and innovation
            </strong>
          </h2>
          <p>
            Our programs go beyond skill acquisition, because acquisition,
            because we believe in the <br /> trans-formative power of coding
          </p>

          <div className="z-[9999999999999999999999999] grid w-full grid-cols-1 gap-4 pt-14 md:grid-cols-3">
            {ServicesCardData.map((data, index) => (
              <ServicesCard
                key={index}
                imageAlt={data.imageAlt}
                imageUrl={data.imageUrl}
                description={data.description}
                title={data.title}
                className={`cursor-pointer text-sm md:text-base md:last:w-[400px] [&:nth-child(3)]:bg-[#9747FF] ${
                  index === 3 || index === 4 ? "md:ml-[70px]" : ""
                }`}
              />
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-6 md:pt-20">
            <Button
              variant="outline"
              className="hover:opacity-70"
              rounded="full"
            >
              Hire Codebility
            </Button>
            <p>Will provide you with top-notch developers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
