"use client";

import { motion } from "framer-motion";

export default function RoadMapIntro() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 via-slate-900 to-[#111111] lg:min-h-screen">
      {/* Geometric Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Glowing Orbs */}
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 blur-xl"></div>
        <div className="absolute bottom-32 left-16 h-24 w-24 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-lg"></div>
        <div className="absolute top-1/3 left-1/4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-400/30 to-teal-400/30 blur-md"></div>
        
        {/* Additional glows that blend into next section */}
        <div className="absolute -bottom-44 -left-44 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        
        {/* Hexagonal Shapes */}
        <div className="absolute top-1/4 right-1/3">
          <div className="h-20 w-20 rotate-12 border border-teal-400/30 bg-gradient-to-br from-teal-400/10 to-transparent"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <div className="h-16 w-16 -rotate-6 border border-purple-400/30 bg-gradient-to-br from-purple-400/10 to-transparent"
               style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
        </div>
        
        {/* Circuit-like Lines */}
        <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            d="M100 200 Q300 100 500 200 T900 200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <path
            d="M200 800 Q400 700 600 800 T1000 800"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3,7"
          />
        </svg>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center lg:min-h-screen lg:pb-32">
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-transparent"></div>
        
        <div className="relative z-20 max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-teal-300 font-semibold text-lg">Codebility</span>
            </div>
            <span className="inline-block rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 px-6 py-2 text-sm font-semibold text-teal-300 backdrop-blur-sm border border-teal-400/30">
              Welcome to Your Journey
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="mb-8 text-[48px] font-bold leading-tight text-white sm:text-[80px] md:text-[120px] lg:text-[150px] xl:text-[180px]"
          >
            <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent tracking-wider">
              ROADMAP
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto max-w-2xl text-lg font-medium text-gray-300 sm:text-xl md:text-2xl"
          >
            Navigate your path from 
            <span className="text-yellow-400 font-semibold"> Intern </span>
            to 
            <span className="text-pink-400 font-semibold"> Codev </span>
            to 
            <span className="text-blue-400 font-semibold"> Mentor</span>
            <br />
            <span className="text-teal-400 text-base mt-2 block">Check your journey below</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
              <div className="h-1 w-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
            </div>
          </motion.div>

          {/* Transition Element - Road Start */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-16 flex flex-col items-center"
          >
            {/* Start point circle */}
            <div className="relative">
              <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
              <div className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-green-500/30 animate-ping"></div>
            </div>
            
            {/* Road leading down */}
            <div className="mt-4 h-24 w-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-transparent"></div>
            
            {/* Arrow pointing down */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2"
            >
              <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
