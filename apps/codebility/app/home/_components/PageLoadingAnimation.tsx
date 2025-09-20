"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PageLoadingAnimation() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950 min-h-[400px]">
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, #06b6d4 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative">
        {/* Main loading animation */}
        <div className="flex flex-col items-center gap-8">
          {/* Animated logo/icon */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Rotating rings */}
            <motion.div
              className="absolute inset-0 h-24 w-24"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="h-full w-full rounded-full border-2 border-customBlue-500 border-t-transparent" />
            </motion.div>
            
            <motion.div
              className="absolute inset-0 h-24 w-24"
              animate={{ rotate: -360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div className="h-full w-full rounded-full border-2 border-purple-500 border-b-transparent" />
            </motion.div>

            {/* Center icon */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: 360,
                }}
                transition={{
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                <Image
                  src="/assets/svgs/icon-codebility.svg"
                  alt=""
                  width={50}
                  height={50}
                  style={{ width: "100%", height: "100%" }}
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Loading dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-customBlue-500"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.div
            className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>console.log(loading)</span>
            <div className="ml-2 flex">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  .
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute -bottom-20 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-customBlue-500 to-purple-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}