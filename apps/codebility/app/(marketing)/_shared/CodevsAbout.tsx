import Image from "next/image";
import H2 from "@/components/shared/home/H2";
import IntroText from "@/components/shared/home/IntroText";
import SectionWrapper from "@/components/shared/home/SectionWrapper";
import { services } from "@/constants/services";
import { motion } from "framer-motion";
import moon from "public/assets/images/moon.png";

import AboutCard from "./CodevsAboutCard";

const AboutSection = () => {
  return (
    <SectionWrapper id="about">
      <div className="relative">
        <Image
          src={moon}
          alt="Moon"
          className="invisible absolute -left-72 -top-60 h-auto w-[400px] lg:visible"
        />
      </div>
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

          <IntroText>
            We believe in the transformative power of coding. With Codebility,
            you won{`'`}t just learn coding; you{`'`}
            ll wield a tool for a brighter future. Join us in sculpting your
            path as tomorrow{`'`}s digital architect.
          </IntroText>
        </div>
        <div className="basis-1/2">
          <div className="flex flex-col gap-6 py-10 lg:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <AboutCard
                  icon="icon-code.svg"
                  title="Skill Mastery"
                  desc="Committed to empowering individuals to become Full Stack Developers."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <AboutCard
                  icon="icon-community.svg"
                  title="Community Building"
                  desc="We connect like-minded individuals, providing a supportive network"
                />
              </motion.div>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:-translate-y-14">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <AboutCard
                  icon="icon-team-2.svg"
                  title="Innovation"
                  desc="We serve as a dynamic hub for innovation, fostering a creative environment"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <AboutCard
                  icon="icon-crosshair.svg"
                  title="Real-world Applications"
                  desc="Beyond theoretical knowledge, our focus is on practical, real-world applications of coding"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
