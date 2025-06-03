"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

import Container from "./MarketingContainer";
import Section from "./MarketingSection";

const Calendly = () => {
  return (
    <Section id="book" className="relative w-full pt-10 text-white">
      <Container className="relative z-10 flex flex-col gap-6 text-white lg:flex-row lg:gap-10">
        <div className="flex w-full flex-1 flex-col justify-center gap-2 text-center lg:text-left">
          <h2 className="text-3xl font-bold md:text-5xl">
            Let&apos;s Connect
          </h2>
          <p className="text-md lg:text-lg">
            Schedule a meeting with us to discuss your needs and have solutions. 
          </p>
        </div>

        <div className="calendly-widget-container w-full flex-1 justify-center lg:w-1/2">
          <InlineWidget styles={{ borderRadius: '0.5rem' }} url="https://calendly.com/codebility-dev/30min" />
        </div>
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(0% 31.5%, 75.3% 19.5%, 100% 50%, 75.5% 80.5%, 0% 67.8%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default Calendly;
