"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useState } from "react";

interface FeaturesCardProps {
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
  index?: number;
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({
  imageName,
  imageAlt,
  title,
  description,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      className="border-dark-100 bg-black-600 z-10 w-full rounded-lg border-2 p-4 relative overflow-hidden"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        borderColor: "rgba(147, 71, 255, 0.5)",
        boxShadow: "0 20px 40px -12px rgba(147, 71, 255, 0.3)",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 rounded-lg"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 rounded-lg"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      <div className="flex flex-col gap-3 relative z-10">
        <motion.div 
          className="block overflow-hidden rounded-lg"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={imageName}
              alt={imageAlt}
              width={450}
              height={300}
              priority
              className="h-[250px] w-[370px] object-cover transition-transform duration-300"
            />
          </motion.div>
          
          {/* Image overlay effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        
        <motion.h3 
          className="text-lg font-semibold"
          style={{ transform: "translateZ(15px)" }}
          animate={{
            color: isHovered ? "#a855f7" : "#ffffff",
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-300"
          style={{ transform: "translateZ(10px)" }}
          animate={{
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Floating icon indicator */}
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ 
            duration: 0.4,
            type: "spring",
            bounce: 0.6
          }}
        >
          <motion.div
            className="w-3 h-3 bg-purple-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturesCard;
