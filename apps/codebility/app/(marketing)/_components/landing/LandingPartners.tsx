"use client";

import LandingImage from "./LandingImage";
import { motion } from "framer-motion";

import Section from "../MarketingSection";

const VIEWPORT = { once: true, amount: 0.2 } as const;

const partners = [
  {
    name: "Genius Web Services",
    logo: "/assets/images/partners/genius-web-services.png",
  },
  { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
  { name: "Netmedia", logo: "/assets/images/partners/netmedia.png" },
  { name: "Zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
  { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
  { name: "Ai", logo: "/assets/images/partners/ai.png" },
  { name: "Averps", logo: "/assets/images/partners/averps.png" },
  { name: "Tolle Design", logo: "/assets/images/partners/tolle-design.png" },
  { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
  {
    name: "Federal PLANS",
    logo: "/assets/images/partners/federal-plans.png",
  },
  { name: "Web Divine", logo: "/assets/images/partners/web-divine.png" },
  { name: "FixFlow.ai", logo: "/assets/images/partners/fixflow-ai.png" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Partners() {
  return (
    <Section id="partners" className="relative w-full pt-10 text-white">
      <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:text-5xl"
          >
            Our Partners
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-center text-lg text-gray-300 sm:text-xl"
          >
            Meet Our Trusted Partners
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={containerVariants}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group relative flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300"
            >
              <div className="relative z-10 h-full w-full">
                <LandingImage
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain filter transition-all duration-300 group-hover:brightness-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
