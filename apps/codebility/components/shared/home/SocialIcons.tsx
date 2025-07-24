import Image from "next/image";
import Link from "next/link";
import { item, SocialContainer } from "@/components/FramerAnimation/Framer";
import { socialIcons } from "@/constants/social";
import { motion } from "framer-motion";

const SocialIcons = () => {
  return (
    <motion.div
      className="flex justify-center gap-5"
      variants={SocialContainer}
      initial="hidden"
      whileInView="visible"
    >
      {socialIcons.map((social, i) => (
        <Link
          key={`socialIcons-${i}`}
          href={social.route}
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            whileHover={{ scale: 1.5, rotate: 360 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            whileTap={{
              scale: 0.8,
              rotate: -90,
              borderRadius: "100%",
            }}
            variants={item}
          >
            <Image
              src={social.imgURL}
              alt={social.label}
              width={20}
              height={20}
              className="h-auto w-auto"
            />
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
};

export default SocialIcons;
