"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import Section from "../MarketingSection";

export default function Partners() {
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
  ];

  return (
    <Section id="partners" className="relative w-full pt-10 text-white">
      <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white">
        <h2 className="mb-6 text-center text-4xl font-extrabold sm:text-5xl">
          Our Partners
        </h2>
        <p className="mb-12 text-center text-lg text-gray-300 sm:text-xl">
          Meet Our Trusted Partners
        </p>
        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, staggerChildren: 0.1 },
            },
          }}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.name}
              className="relative flex h-32 w-full items-center justify-center"
              whileHover={{ scale: 1.1 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                unoptimized={true}
                className="object-contain"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
