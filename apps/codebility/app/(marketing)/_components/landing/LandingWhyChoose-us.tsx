"use client";

import LandingImage from "./LandingImage";
import { motion } from "framer-motion";

import Container from "../MarketingContainer";
import Section from "../MarketingSection";
import AnimatedMetrics from "./AnimatedMetrics";

const VIEWPORT = { once: true, amount: 0.2 } as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const WhyChooseUs = () => {
  const stats = [
    { value: 120, suffix: "+", label: "Projects Completed", delay: 200 },
    { value: 98, suffix: "%", label: "Client Satisfaction", delay: 400 },
    { value: 100, suffix: "+", label: "Expert Developers", delay: 600 },
    { value: 24, suffix: "/7", label: "Support Available", delay: 800 },
  ];

  return (
    <Section id="whychooseus" className="relative w-full pt-10 text-white">
      <Container className="text-white">
        <div className="flex flex-col gap-6 md:gap-10">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="mb-8 text-xl md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Choose Codebility?
            </motion.h2>

            <motion.div
              className="mb-10 grid grid-cols-2 gap-6 rounded-xl border border-white/10 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 p-6 backdrop-blur md:grid-cols-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <AnimatedMetrics key={index} variant="stat" {...stat} />
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="flex grid-cols-1 grid-rows-4 flex-col gap-3 md:grid md:grid-cols-4 lg:gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <motion.div
              className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-1 row-end-1 overflow-hidden rounded-lg border-2 p-4 md:col-end-3 md:row-end-3 md:p-6"
              variants={cardVariants}
            >
              <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3 text-center">
                <div>
                  <LandingImage
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-approach.png"
                    alt="innovative approach"
                    width={300}
                    height={300}
                    className="h-[150px] w-[150px] object-contain lg:h-[300px] lg:w-[300px]"
                  />
                </div>
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Innovative Approach
                  </h3>
                  <p className="text-gray">
                    Embrace innovation with Codebility. Crafting revolutionary
                    digital solutions that create new posibilites
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-2 row-end-2 overflow-hidden rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-4 md:p-6"
              variants={cardVariants}
            >
              <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3">
                <div>
                  <LandingImage
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-shield.png"
                    alt="shield"
                    width={400}
                    height={400}
                    className="h-[150px] w-[150px] object-contain lg:h-[400px] lg:w-[400px]"
                  />
                </div>
                <motion.div
                  className="flex flex-col gap-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Reliable and Trusted
                  </h3>
                  <p className="text-gray">
                    Codebility has a proven track record across diverse
                    industries, trusted for our reliability, consistency, and
                    on-time delivery—your dependable digital partner.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="relative col-start-1 col-end-2 row-start-3 row-end-5 hidden overflow-hidden rounded-xl bg-customBlue-100 lg:block"
              variants={cardVariants}
            >
              <div>
                <LandingImage
                  src="https://codebility-cdn.pages.dev/assets/images/index/choose-hands.jpg"
                  alt="codevs"
                  width={300}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="border-dark-100 bg-black-600 relative col-start-1 col-end-1 row-start-3 row-end-3 overflow-hidden rounded-lg border-2 p-4 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-2"
              variants={cardVariants}
            >
              <div className="relative z-10 flex h-full flex-col place-items-center justify-around gap-3">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <LandingImage
                    src="https://codebility-cdn.pages.dev/assets/images/index/choose-heart.png"
                    alt="tailored"
                    width={200}
                    height={200}
                    className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                  />
                </motion.div>
                <motion.div
                  className="flex flex-col gap-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <h3 className="font-medium md:text-2xl">
                    Customer - Centric Solution
                  </h3>
                  <p className="text-gray">
                    Understanding your vision and helping you bring your online
                    vision to life.{" "}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="relative col-start-1 col-end-1 row-start-4 row-end-4 grid place-items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] md:col-start-3 md:col-end-5 md:row-end-5"
              variants={cardVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.p
                className="relative z-10 py-10 text-lg font-medium md:text-2xl lg:text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.8,
                  delay: 1.4,
                  type: "spring",
                  bounce: 0.4,
                }}
              >
                Your Uniqueness is our focus
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
