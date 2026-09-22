"use client";

import { Clock, Lightbulb, Rocket } from "lucide-react";
import { InlineWidget } from "react-calendly";

import MarketingProgressiveSection from "../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../_shared/ProgressiveMotion";
import Container from "./MarketingContainer";
import Section from "./MarketingSection";

const Calendly = () => {
  const skeleton = (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
      <div className="flex w-full flex-1 flex-col justify-start gap-2 text-center lg:text-left">
        <h2 className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
          Let&apos;s Connect
        </h2>
        <p className="text-md text-gray-300 lg:text-lg">
          Schedule a meeting with us to discuss your needs and have solutions.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3 text-sm lg:text-base">
            {[
              { icon: Clock, text: "Free 30-minute consultation" },
              { icon: Rocket, text: "Tailored solutions for your business" },
              { icon: Lightbulb, text: "Expert advice from our team" },
            ].map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-center gap-3">
                <Icon className="size-5 shrink-0 text-purple-400" />
                <span className="text-purple-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="calendly-widget-container relative w-full flex-1 justify-center overflow-hidden lg:w-1/2">
        <div className="relative overflow-hidden rounded-xl">
          <div className="relative z-10 min-h-[600px] rounded-xl bg-gray-900/50" />
        </div>
      </div>
    </div>
  );

  return (
    <Section
      id="book"
      className="relative w-full overflow-hidden pt-10 text-white 2xl:pt-24"
    >
      <Container className="relative z-10">
        <MarketingProgressiveSection skeleton={skeleton}>
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <ProgressiveMotion
              className="flex w-full flex-1 flex-col justify-start gap-2 text-center lg:text-left"
              y={24}
              duration={0.55}
              staggerChildren={0.12}
            >
              <h2
                data-progressive-child
                className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-3xl font-bold text-transparent md:text-5xl"
              >
                Let&apos;s Connect
              </h2>
              <p
                data-progressive-child
                className="text-md text-gray-300 lg:text-lg"
              >
                Schedule a meeting with us to discuss your needs and have solutions.
              </p>

              <div
                data-progressive-child
                className="mt-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 text-sm lg:text-base">
                  {[
                    { icon: Clock, text: "Free 30-minute consultation" },
                    { icon: Rocket, text: "Tailored solutions for your business" },
                    { icon: Lightbulb, text: "Expert advice from our team" },
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="size-5 shrink-0 text-purple-400" />
                      <span className="text-purple-300">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ProgressiveMotion>

            <ProgressiveMotion
              className="calendly-widget-container relative w-full flex-1 justify-center overflow-hidden lg:w-1/2"
              y={32}
              duration={0.6}
            >
              <div data-progressive-child className="relative overflow-hidden rounded-xl">
                <div className="relative z-10">
                  <InlineWidget
                    styles={{
                      borderRadius: "0.75rem",
                      border: "none",
                      height: "600px",
                    }}
                    url="https://calendly.com/codebility-dev/30min"
                  />
                </div>
              </div>
            </ProgressiveMotion>
          </div>
        </MarketingProgressiveSection>
      </Container>
    </Section>
  );
};

export default Calendly;
