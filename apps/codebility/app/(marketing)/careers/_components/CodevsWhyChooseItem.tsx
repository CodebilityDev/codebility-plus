import {
  fadeInOutDownToUp,
  fadeInOutLeftToRight,
  fadeInOutRightToLeft,
} from "@/components/FramerAnimation/Framer";
import { motion } from "framer-motion";

interface WhyChooseItemProps {
  title: string;
  itemNumber: number;
  description: string;
  subTitle: string;
  color?: string; // Optional
}

const WhyChooseItem: React.FC<WhyChooseItemProps> = ({
  title,
  itemNumber,
  description,
  subTitle,
  color = "",
}) => {
  return (
    <div
      className={`mx-auto flex w-full flex-col gap-2 rounded-lg p-4 text-white lg:flex-row ${color}`}
    >
      <div className="m-auto flex basis-2/5 pl-5">
        <motion.h3
          variants={fadeInOutLeftToRight}
          initial="hidden"
          whileInView="visible"
          className="max-w-auto text-2xl font-semibold lg:max-w-[250px] lg:text-3xl"
        >
          {title}
        </motion.h3>
      </div>
      <div className="basis-3/5">
        <div className="m-auto flex max-w-md flex-col gap-1 px-4 lg:flex-row lg:gap-10">
          <motion.div
            variants={fadeInOutDownToUp}
            initial="hidden"
            whileInView="visible"
            className="mx-auto flex lg:items-center"
          >
            <p className="text-3xl font-semibold">0{itemNumber}</p>
          </motion.div>
          <motion.div
            variants={fadeInOutRightToLeft}
            initial="hidden"
            whileInView="visible"
            className="flex flex-1 flex-col justify-center gap-1 p-1 text-center lg:text-left"
          >
            <p className="md:text-md text-sm font-semibold lg:text-lg">
              {subTitle}
            </p>
            <p className="md:text-md mr-2 text-sm lg:text-base">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseItem;
