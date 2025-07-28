"use client";

import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { FeaturedSectiondata } from "@/constants/landing_data";
import FeaturedCard from "./CodevsFeaturedCard";
import Section from "./CodevsSection";

/*  const inter = Inter({
    subsets: ["latin"],
    display: "swap",
  });

  const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
  }); */

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const FeaturedSection = () => {
  return (
    <Section id="whoweare" className="relative mx-0">
      <div className="relative flex flex-col gap-4 ">
        <div className="flex flex-col">
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto"
          >
            <H2 className={`${inter.className} text-edit`}>WHO WE ARE</H2>
          </motion.div>
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="text-gray mx-auto max-w-[650px] text-center"
          >
            <Heading3>At Codebility we&apos;re</Heading3>
            <H2 className={`${outfit.className} text-white`}>
              MORE THAN JUST A COMMUNITY
            </H2>
          </motion.div>
        </div>
        <div className="mt-10 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-5">
          {FeaturedSectiondata.map((data, index) => (
            <FeaturedCard
              key={index}
              title={data.title}
              description={data.description}
              src={data.src}
              alt={data.alt}
            />
          ))}
        </div>
        <Link href="#roadmap" className="mx-auto mt-10">
          <Button variant="purple" size="lg" rounded="full">
            See how we started
          </Button>
        </Link>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl sm:block"
      >
        <div
          style={{
            width: "500.12px",
            height: "468.25px",
            left: "586.13px",
            top: "1816.14px",
          }}
          className="aspect-[855/678] w-[40rem] bg-blue-100 opacity-15 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default FeaturedSection;
