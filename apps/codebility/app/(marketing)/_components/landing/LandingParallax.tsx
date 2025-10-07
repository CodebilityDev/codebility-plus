"use client";

import { services } from "@/constants/landing_data";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Section from "../MarketingSection";
import Diamond from "./LandingDiamond";
import Marquee from "./LandingMarquee";

const Parallax = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Simplified transforms to avoid scroll conflicts
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateReverse = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.8]);

  return (
    <motion.div 
      ref={containerRef}
      className="text-md border-light-900/5 bg-light-900/5 my-6 flex w-full flex-col items-center justify-center gap-4 border-y-4 p-8 text-center text-white md:text-xl lg:gap-8 lg:text-5xl relative"
      style={{ opacity }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-cyan-500/25 to-purple-500/25 rounded-xl blur-lg"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating orbs */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Enhanced marquee with morphing effects */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Marquee>
            {services.map((data, index) => (
              <motion.div 
                key={data.id} 
                className="flex items-center justify-center gap-5"
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div
                  style={{ rotate: index % 2 === 0 ? rotate : rotateReverse }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Diamond color={data.starColor} />
                </motion.div>
                <motion.p
                  className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                  whileHover={{
                    backgroundPosition: ["0%", "100%"],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {data.title}
                </motion.p>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Marquee reverse={true}>
            {services.map((data, index) => (
              <motion.div 
                key={data.id} 
                className="flex items-center justify-center gap-5"
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div
                  style={{ rotate: index % 2 === 0 ? rotateReverse : rotate }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.3 }}
                >
                  <Diamond color={data.starColor} />
                </motion.div>
                <motion.p
                  className="bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent"
                  whileHover={{
                    backgroundPosition: ["0%", "100%"],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {data.title}
                </motion.p>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      </motion.div>

      {/* Simplified border animations */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ transformOrigin: "0%" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        style={{ transformOrigin: "100%" }}
      />
    </motion.div>
  );
};

export default Parallax;
