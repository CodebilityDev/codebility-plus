"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { ServicesCardData } from "@/constants/landing_data";
import Container from "../MarketingContainer";
import Section from "../MarketingSection";
import FeaturesCard from "./LandingFeaturesCard";
import ProgressiveMotion from "./ProgressiveMotion";
import { LandingFeaturesSkeleton } from "./LandingSectionSkeletons";

const Features = () => {
  return (
    <Section id="features" className="relative w-full pt-10 text-white">
      <div data-landing-section>
        <div data-landing-skeleton>
          <Container>
            <LandingFeaturesSkeleton />
          </Container>
        </div>
        <div data-landing-content>
          <Container className="flex flex-col gap-10 text-white">
            <ProgressiveMotion
              className="mx-auto flex w-full max-w-[650px] flex-col gap-3 text-center"
              y={50}
              duration={0.8}
              staggerChildren={0.12}
            >
              <p
                data-progressive-child
                className="text-customViolet-100 text-lg md:text-2xl"
              >
                In the Tech Industry
              </p>
              <h2
                data-progressive-child
                className="text-xl md:text-3xl"
              >
                Codebility sparks a passion for{" "}
                <strong className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Technology and Innovation.
                </strong>
              </h2>
              <p data-progressive-child className="text-gray">
                Our programs go beyond skill acquisition, because we believe in the
                transformative power of coding
              </p>
            </ProgressiveMotion>

            <ProgressiveMotion
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
              y={60}
              duration={0.8}
              staggerChildren={0.2}
            >
              {ServicesCardData.map((data, index) => (
                <motion.div
                  key={index}
                  data-progressive-child
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ perspective: "1000px" }}
                >
                  <FeaturesCard
                    imageAlt={data.imageAlt}
                    imageName={data.imageUrl}
                    description={data.description}
                    title={data.title}
                    index={index}
                  />
                </motion.div>
              ))}
            </ProgressiveMotion>

            <ProgressiveMotion className="md:mx-auto" y={30} duration={0.6}>
              <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
                <a href="#book">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden rounded-full"
                  >
                    <Button
                      variant="purple"
                      size="lg"
                      rounded="full"
                      className="relative z-10 h-14"
                    >
                      Book a call
                    </Button>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 opacity-0"
                      whileHover={{ opacity: 0.8, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </a>
              </div>
            </ProgressiveMotion>
          </Container>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-[#6A78F2] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default Features;
