"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PageLoadingAnimation() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate random particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-customBlue-500 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-customBlue-500 to-transparent opacity-80"
        animate={{
          y: [0, 800],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main content container */}
      <div className="relative z-10">
        {/* Hexagonal container */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          {/* Outer hexagon ring */}
          <motion.div
            className="absolute -inset-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <polygon
                points="100,20 170,60 170,140 100,180 30,140 30,60"
                fill="none"
                stroke="url(#hexGrad)"
                strokeWidth="2"
                className="drop-shadow-glow"
              />
            </svg>
          </motion.div>

          {/* Inner rotating elements */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Triple ring system */}
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute"
                style={{
                  width: `${120 - ring * 20}px`,
                  height: `${120 - ring * 20}px`,
                }}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: 8 + ring * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div 
                  className={`w-full h-full rounded-full border-2 ${
                    ring === 0 ? 'border-customBlue-500 border-t-transparent border-r-transparent' :
                    ring === 1 ? 'border-purple-500 border-b-transparent border-l-transparent' :
                    'border-cyan-400 border-t-transparent border-b-transparent'
                  }`}
                  style={{
                    filter: 'drop-shadow(0 0 10px currentColor)',
                  }}
                />
              </motion.div>
            ))}

            {/* Center logo with glitch effect */}
            <motion.div
              className="relative z-10 w-16 h-16 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Glitch layers */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  x: [0, 2, -2, 0],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                <Image
                  src="/assets/svgs/icon-codebility.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="brightness-0 invert"
                  style={{ filter: 'hue-rotate(200deg) saturate(2)' }}
                />
              </motion.div>
              
              <motion.div
                animate={{
                  rotateY: [0, 360],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Image
                  src="/assets/svgs/icon-codebility.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="brightness-0 invert drop-shadow-lg"
                  style={{ filter: 'drop-shadow(0 0 20px #3b82f6)' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Matrix-style code rain */}
        <div className="absolute -inset-20 pointer-events-none">
          {['01010', '11001', '10110', '00111'].map((code, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono text-customBlue-500 opacity-40"
              style={{
                left: `${20 + i * 25}%`,
                top: '10%',
              }}
              animate={{
                y: [0, 500],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "linear",
              }}
            >
              {code.split('').map((char, j) => (
                <motion.span
                  key={j}
                  className="block"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: j * 0.2,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Advanced loading text with typewriter effect */}
        <motion.div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            {/* Typewriter loading text */}
            <motion.div className="text-lg font-mono text-customBlue-400 mb-4">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-customBlue-400"
              >
                Initializing quantum framework...
              </motion.span>
            </motion.div>

            {/* Holographic progress bar */}
            <div className="relative w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-customBlue-500/30">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-customBlue-500 via-purple-500 to-cyan-400"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: 'drop-shadow(0 0 10px currentColor)',
                }}
              />
              
              {/* Progress bar glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Status indicators */}
            <div className="flex justify-center gap-4 mt-4">
              {['CPU', 'GPU', 'RAM'].map((label, i) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2 text-xs font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 + i * 0.5 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                  <span className="text-gray-400">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Corner accents */}
      {[
        { corner: 'top-left', rotate: 0 },
        { corner: 'top-right', rotate: 90 },
        { corner: 'bottom-left', rotate: 270 },
        { corner: 'bottom-right', rotate: 180 },
      ].map(({ corner, rotate }) => (
        <motion.div
          key={corner}
          className={`absolute ${corner.includes('top') ? 'top-8' : 'bottom-8'} ${corner.includes('left') ? 'left-8' : 'right-8'}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ rotate: rotate + 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path
                d="M20,5 L35,20 L20,35 L5,20 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}