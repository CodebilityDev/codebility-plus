"use client";

import Image from "next/image";
import { H2, Paragraph, SectionWrapper } from "@/components/shared/home";

const CompanyValues = () => {
  return (
    <SectionWrapper className="relative lg:w-full lg:overflow-hidden">
      <div className="z-10 flex h-full flex-col gap-12 lg:flex-row lg:gap-6">
        <div className="my-auto flex basis-[50%] flex-col gap-4 text-center lg:basis-[25%] lg:text-end">
          <H2 className="text-primaryColor">Our Purpose</H2>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px]">
            We build innovative software solutions that solve real-world problems 
            and drive business success for our clients across diverse industries.
          </Paragraph>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px]">
            Our team of skilled engineers, designers, and strategists work 
            collaboratively to deliver cutting-edge technology that makes an impact.
          </Paragraph>
        </div>
        <div className="relative hidden w-full items-center justify-center lg:flex lg:h-[600px] lg:basis-[50%]">
          <Image
            src="/assets/images/mission-vision-image.png"
            alt="Codebility Technology Solutions"
            fill
            sizes="1200px"
            className="absolute z-10 h-auto bg-center object-contain"
          />
        </div>
        <div className="my-auto flex basis-[50%] flex-col gap-4 text-center lg:basis-[25%] lg:text-start">
          <H2 className="text-primaryColor">Our Vision</H2>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px] lg:text-start">
            To be the leading technology partner that companies trust for 
            building scalable, secure, and innovative digital solutions.
          </Paragraph>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px] lg:text-start">
            We strive to create an environment where talented professionals 
            can thrive, innovate, and advance their careers while delivering 
            exceptional value to our clients.
          </Paragraph>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[30%] hidden transform-gpu overflow-hidden blur-3xl sm:-top-80 lg:block"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="from-customTeal to-customViolet-100 relative left-[calc(40%-10rem)] aspect-[855/678] w-[36.125rem] -translate-x-1/2 rotate-[60deg] bg-gradient-to-tr opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </SectionWrapper>
  );
};

export default CompanyValues;