import Image from "next/image";
import { fadeInOutLeftToRight } from "@/Components/FramerAnimation/Framer";
import { useModal } from "@/hooks/use-modal-services";
import { IconArrowRight } from "@/public/assets/svgs";
import { codevs_ServiceCardT } from "@/types/home";
import { motion } from "framer-motion";

const ServiceCard = ({ icon, title, desc }: codevs_ServiceCardT) => {
  const { openModal } = useModal();

  return (
    <motion.div
      variants={fadeInOutLeftToRight}
      initial="hidden"
      whileInView="visible"
    >
      <div className="bg-black-100 text-gray flex flex-col items-center gap-4 p-4 lg:bg-transparent">
        <Image
          alt={title}
          src={`/assets/svgs/${icon}.svg`}
          width={30}
          height={30}
          className="h-10 w-10 lg:h-12 lg:w-12"
        />
        <h3 className="w-full text-center text-lg font-semibold text-white">
          {title}
        </h3>
        <p className="text-center text-base font-normal md:h-20">
          {desc.substring(0, 100)}...
        </p>
        <button
          onClick={() => openModal({ icon, title, desc })}
          className="mb-2 flex items-center gap-2 text-blue-100 duration-300 hover:ml-4"
        >
          Read More <IconArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
