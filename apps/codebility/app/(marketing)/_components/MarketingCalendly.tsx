"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

import Container from "./MarketingContainer";
import Section from "./MarketingSection";

const Calendly = () => {
  return (
    <Section id="book" className="relative w-full pt-10 text-white overflow-hidden">
      <Container className="relative z-10 flex flex-col gap-6 text-white lg:flex-row lg:gap-10">
        <div className="flex w-full flex-1 flex-col justify-center gap-2 text-center lg:text-left">
          <h2 className="text-3xl font-bold md:text-5xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Let&apos;s Connect
          </h2>
          <p className="text-md lg:text-lg text-gray-300">
            Schedule a meeting with us to discuss your needs and have solutions. 
          </p>

          {/* Enhanced CTA elements */}
          <div className="flex flex-col gap-4 mt-6">
            {/* Feature highlights */}
            <div className="flex flex-col gap-2 text-sm lg:text-base">
              {[
                "✨ Free 30-minute consultation",
                "🚀 Tailored solutions for your business",
                "💡 Expert advice from our team"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-purple-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calendly-widget-container w-full flex-1 justify-center lg:w-1/2 relative overflow-hidden">
          {/* Widget wrapper with enhanced styling */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Calendar widget */}
            <div className="relative z-10">
              <InlineWidget 
                styles={{ 
                  borderRadius: '0.75rem',
                  border: 'none',
                  height: '600px',
                }} 
                url="https://calendly.com/codebility-dev/30min" 
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Calendly;
