import { motion } from "framer-motion"

import ServiceCard from "./codevs-service-card"
import H2 from "@/Components/shared/home/H2"
import { servicesCardData } from "@/constants"
import IntroText from "@/Components/shared/home/IntroText"
import SectionWrapper from "@/Components/shared/home/SectionWrapper"
import { fadeInOutDownToUp } from "@/Components/FramerAnimation/Framer"

const Services = () => {
  return (
    <SectionWrapper id="services">
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-6">
          <motion.div variants={fadeInOutDownToUp} initial="hidden" whileInView="visible" className="mx-auto">
            <H2 className="text-white">Services</H2>
          </motion.div>
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto max-w-[600px] text-center text-secondaryColor"
          >
            <IntroText>
              We lead in digital innovation and design, offering tailored services to make your digital presence stand
              out and achieve impactful results.
            </IntroText>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 xl:grid-cols-4">
          {servicesCardData.map((card, index) => (
            <div key={index} className="w-full max-w-96">
              <ServiceCard icon={card.icon} title={card.title} desc={card.desc} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Services
