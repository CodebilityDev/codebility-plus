import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import H2 from "@/components/shared/home/H2";
import SectionWrapper from "@/components/shared/home/SectionWrapper";
import { motion } from "framer-motion";

import WhyChooseItem from "./CodevsWhyChooseItem";

const WhyChooseUs = () => {
  return (
    <SectionWrapper>
      <div className="flex flex-col gap-0 lg:gap-20">
        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="flex flex-col items-center"
        >
          <H2 className="text-white">Why Choose Us?</H2>
        </motion.div>

        <motion.div className="mx-auto my-4 flex w-full flex-col gap-10">
          <WhyChooseItem
            title="Innovative Approach"
            subTitle="Pushing Creativity Boundaries"
            itemNumber={1}
            description="Embrace innovation with Codebility. Our team thinks outside the box, crafting revolutionary digital solutions that create new possibilities."
          />
          <WhyChooseItem
            title="Expert Team"
            subTitle="Digital Maestros Collective"
            itemNumber={2}
            description="At Codebility, our passionate experts, from developers to designers, bring their A-game to ensure top-notch results. Join forces with some of the industry's brightest minds."
          />
          <WhyChooseItem
            title="Customer-Centric Solutions"
            subTitle="Tailored for You"
            itemNumber={3}
            description="Your uniqueness is our focus. Codebility delivers diverse solutions, understanding your vision and aligning our services perfectly with your goals. Your satisfaction measures our success."
          />
        </motion.div>

        <motion.div
          variants={fadeInOutDownToUp}
          initial="hidden"
          whileInView="visible"
          className="mx-auto max-w-[650px] text-center"
        ></motion.div>
      </div>
    </SectionWrapper>
  );
};

export default WhyChooseUs;
