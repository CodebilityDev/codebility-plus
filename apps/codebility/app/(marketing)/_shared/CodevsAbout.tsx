"use client";

import Image from "next/image";
import H2 from "@/components/shared/home/H2";
import IntroText from "@/components/shared/home/IntroText";
import SectionWrapper from "@/components/shared/home/SectionWrapper";
import { services } from "@/constants/services";
import moon from "public/assets/images/moon.png";

import AboutCard from "./CodevsAboutCard";
import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";

const AboutSection = () => {
  const skeleton = (
    <div className="flex flex-col gap-10 lg:flex-row">
      <div className="flex basis-1/2 flex-col justify-center gap-6">
        <div>
          <H2 className="text-white">What We Do</H2>
          <IntroText>
            Codebility sparks a passion for technology and innovation. Beyond
            teaching coding, we immerse learners in the coding culture,
            replicating real-world company standards. Our programs go beyond
            skill acquisition, offering gateways to new horizons in the tech
            industry.
          </IntroText>
        </div>
        <div className="flex flex-col gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex flex-row gap-4">
              <p className="text-gray font-semibold">{service.number}</p>
              <div className="border-gray w-[20px] -translate-y-3 border-b-2"></div>
              <p className="text-gray">{service.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="basis-1/2">
        <div className="flex flex-col gap-6 py-10 lg:flex-row">
          <div className="flex flex-1 flex-col gap-6">
            <AboutCard
              icon="icon-code.svg"
              title="Skill Mastery"
              desc="Committed to empowering individuals to become Full Stack Developers."
            />
            <AboutCard
              icon="icon-community.svg"
              title="Community Building"
              desc="We connect like-minded individuals, providing a supportive network"
            />
          </div>
          <div className="flex flex-1 flex-col gap-6 lg:-translate-y-14">
            <AboutCard
              icon="icon-team-2.svg"
              title="Innovation"
              desc="We serve as a dynamic hub for innovation, fostering a creative environment"
            />
            <AboutCard
              icon="icon-crosshair.svg"
              title="Real-world Applications"
              desc="Beyond theoretical knowledge, our focus is on practical, real-world applications of coding"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SectionWrapper id="about">
      <div className="relative">
        <Image
          src={moon}
          alt="Moon"
          className="invisible absolute -left-72 -top-60 h-auto w-[400px] lg:visible"
        />
      </div>
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="flex flex-col gap-10 lg:flex-row">
          <ProgressiveMotion
            className="flex basis-1/2 flex-col justify-center gap-6"
            y={30}
            duration={0.6}
            staggerChildren={0.1}
          >
            <div data-progressive-child>
              <H2 className="text-white">What We Do</H2>
              <IntroText>
                Codebility sparks a passion for technology and innovation. Beyond
                teaching coding, we immerse learners in the coding culture,
                replicating real-world company standards. Our programs go beyond
                skill acquisition, offering gateways to new horizons in the tech
                industry.
              </IntroText>
            </div>

            <div data-progressive-child className="flex flex-col gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex flex-row gap-4">
                  <p className="text-gray font-semibold">{service.number}</p>
                  <div className="border-gray w-[20px] -translate-y-3 border-b-2"></div>
                  <p className="text-gray">{service.label}</p>
                </div>
              ))}
            </div>

            <div data-progressive-child>
              <IntroText>
                We believe in the transformative power of coding. With Codebility,
                you won&apos;t just learn coding; you&apos;ll wield a tool for a
                brighter future. Join us in sculpting your path as tomorrow&apos;s
                digital architect.
              </IntroText>
            </div>
          </ProgressiveMotion>

          <div className="basis-1/2">
            <ProgressiveMotion
              className="flex flex-col gap-6 py-10 lg:flex-row"
              y={24}
              duration={0.55}
              staggerChildren={0.08}
            >
              <div className="flex flex-1 flex-col gap-6">
                <div data-progressive-child>
                  <AboutCard
                    icon="icon-code.svg"
                    title="Skill Mastery"
                    desc="Committed to empowering individuals to become Full Stack Developers."
                  />
                </div>
                <div data-progressive-child>
                  <AboutCard
                    icon="icon-community.svg"
                    title="Community Building"
                    desc="We connect like-minded individuals, providing a supportive network"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-6 lg:-translate-y-14">
                <div data-progressive-child>
                  <AboutCard
                    icon="icon-team-2.svg"
                    title="Innovation"
                    desc="We serve as a dynamic hub for innovation, fostering a creative environment"
                  />
                </div>
                <div data-progressive-child>
                  <AboutCard
                    icon="icon-crosshair.svg"
                    title="Real-world Applications"
                    desc="Beyond theoretical knowledge, our focus is on practical, real-world applications of coding"
                  />
                </div>
              </div>
            </ProgressiveMotion>
          </div>
        </div>
      </MarketingProgressiveSection>
    </SectionWrapper>
  );
};

export default AboutSection;
