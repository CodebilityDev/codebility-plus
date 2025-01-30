import Image from "next/image";
import { fadeInOutLeftToRight } from "@/Components/FramerAnimation/Framer";
import { useModal } from "@/hooks/use-modal-services";
import { IconArrowRight } from "@/public/assets/svgs";
import { motion } from "framer-motion";

interface ServiceCardProps {
  main_image: string;
  name: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  main_image,
  name,
  description,
}) => {
  const { openModal } = useModal();

  return (
    <motion.div
      variants={fadeInOutLeftToRight}
      initial="hidden"
      whileInView="visible"
    >
      <div className="bg-black-100 text-gray flex flex-col items-center gap-4 p-4 lg:bg-transparent">
        <Image
          alt={name}
          src={main_image}
          width={30}
          height={30}
          className="h-10 w-10 lg:h-12 lg:w-12"
        />
        <h3 className="w-full text-center text-lg font-semibold text-white">
          {name}
        </h3>
        <p className="text-center text-base font-normal md:h-20">
          {description.substring(0, 100)}...
        </p>
        {/* <button
          onClick={() => openModal({ main_image, name, description })}
          className="mb-2 flex items-center gap-2 text-blue-100 duration-300 hover:ml-4"
        >
          Read More <IconArrowRight />
        </button> */}
      </div>
    </motion.div>
  );
};

export default ServiceCard;
