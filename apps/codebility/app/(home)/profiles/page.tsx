"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"

import CodevLists from "@/app/(home)/profiles/ProfileLists"
import H2 from "@/Components/shared/home/H2"
import Heading3 from "@/Components/shared/home/Heading3"
import IntroText from "@/Components/shared/home/IntroText"
import SectionWrapper from "@/Components/shared/home/SectionWrapper"
import { fadeInOutDownToUp } from "@/Components/FramerAnimation/Framer"
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton"

const Profiles = () => {
  return (
    <SectionWrapper id="codevs" className="relative w-full bg-gradient-to-b from-black-500">
      <div className="absolute inset-0 bg-code-pattern bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <motion.div variants={fadeInOutDownToUp} initial="hidden" whileInView="visible" className="mx-auto">
            <H2 className="text-white">Codevs</H2>
          </motion.div>
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto max-w-[650px] text-center text-gray"
          >
            <Heading3>Introducing Our Team of Developers</Heading3>
            <IntroText>
              We are thrilled to have you join our core team - the CoDevs. Our talented and dedicated developers are
              shaping the digital future with their skills and passion.
            </IntroText>
          </motion.div>
        </div>
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists />
        </Suspense>
      </div>
    </SectionWrapper>
  )
}

export default Profiles
