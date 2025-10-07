"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface HeroCardProps {
  title: string;
  description: string;
  url?: string;
  category?: string;
}

const HeroCard: React.FC<HeroCardProps> = ({ title, description, url = "#", category }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
  };

  return (
    <Link href={url} className="hero-card block h-full perspective-1000">
      <motion.div 
        className="border-light-900/5 bg-light-700/10 hover:bg-light-700/30 flex h-[320px] flex-col justify-between rounded-xl border-2 p-8 text-white backdrop-blur-lg duration-300 sm:h-[340px] sm:p-10 relative overflow-hidden transform-gpu"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(147, 71, 255, 0.4)",
          boxShadow: "0 40px 80px -12px rgba(147, 71, 255, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.3)",
          scale: 1.02,
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated background gradient on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* 3D depth shadow layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-xl"
          style={{
            transform: "translateZ(-20px)",
          }}
        />
        
        <motion.div 
          className="flex w-full flex-col gap-3 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            transform: "translateZ(20px)",
          }}
        >
          {category && (
            <motion.p 
              className="text-[10px] uppercase tracking-[0.3em] text-white/60 sm:text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {category}
            </motion.p>
          )}
          <motion.h3 
            className="text-lg font-semibold leading-tight sm:text-xl line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {title}
          </motion.h3>
        </motion.div>
        
        <motion.p 
          className="text-sm leading-relaxed text-white/80 sm:text-base line-clamp-6 mt-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            transform: "translateZ(15px)",
          }}
        >
          {description}
        </motion.p>
      </motion.div>
    </Link>
  );
};

export default HeroCard;
