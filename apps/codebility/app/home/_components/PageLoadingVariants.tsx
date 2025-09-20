"use client";

import { motion } from "framer-motion";

export function CubeLoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(circle at center, #3b82f6 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* 3D Cube animation */}
        <div className="relative h-24 w-24" style={{ perspective: "200px" }}>
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Cube faces */}
            {[
              { transform: "translateZ(48px)", bg: "bg-customBlue-500" },
              { transform: "translateZ(-48px) rotateY(180deg)", bg: "bg-purple-500" },
              { transform: "rotateY(90deg) translateZ(48px)", bg: "bg-cyan-500" },
              { transform: "rotateY(-90deg) translateZ(48px)", bg: "bg-pink-500" },
              { transform: "rotateX(90deg) translateZ(48px)", bg: "bg-green-500" },
              { transform: "rotateX(-90deg) translateZ(48px)", bg: "bg-orange-500" },
            ].map((face, i) => (
              <div
                key={i}
                className={`absolute h-24 w-24 ${face.bg} opacity-80 backdrop-blur-sm`}
                style={{ transform: face.transform }}
              />
            ))}
          </motion.div>
        </div>

        <motion.p
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Preparing your workspace...
        </motion.p>
      </div>
    </div>
  );
}

export function DNALoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="relative flex flex-col items-center gap-8">
        {/* DNA Helix animation */}
        <div className="relative h-32 w-32">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: "8px",
                height: "8px",
              }}
              animate={{
                x: [
                  Math.cos((i / 8) * Math.PI * 2) * 40,
                  Math.cos((i / 8 + 1) * Math.PI * 2) * 40,
                ],
                y: [
                  Math.sin((i / 8) * Math.PI * 2) * 40,
                  Math.sin((i / 8 + 1) * Math.PI * 2) * 40,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1,
              }}
            >
              <div className={`h-full w-full rounded-full ${i % 2 === 0 ? 'bg-customBlue-500' : 'bg-purple-500'}`} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Initializing components...
        </motion.p>
      </div>
    </div>
  );
}

export function WaveLoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="relative flex flex-col items-center gap-8">
        {/* Wave bars animation */}
        <div className="flex items-end gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-customBlue-500 to-purple-500"
              animate={{
                height: [20, 60, 20],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <motion.p
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading resources...
        </motion.p>
      </div>
    </div>
  );
}

export function PulseLoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="relative">
        {/* Pulsing circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 2, 2],
              opacity: [0.8, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          >
            <div className={`h-24 w-24 rounded-full border-2 ${
              i === 0 ? 'border-customBlue-500' : 
              i === 1 ? 'border-purple-500' : 
              'border-cyan-500'
            }`} />
          </motion.div>
        ))}

        {/* Center logo */}
        <motion.div
          className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg"
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-customBlue-500 to-purple-500 bg-clip-text text-transparent">
            CB
          </div>
        </motion.div>
      </div>
    </div>
  );
}