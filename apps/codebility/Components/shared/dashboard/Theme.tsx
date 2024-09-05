"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";

const Theme = () => {
  const { mode, setMode } = useTheme();

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.theme = newMode;
  };

  return (
    <div className="flex gap-4">
      <div
        onClick={toggleTheme}
        className={`w-18 flex h-8 cursor-pointer items-center gap-4 rounded-full border-black bg-zinc-200 p-2 dark:bg-blue-100 ${
          mode === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.div
          className={`absolute h-5 w-5 rounded-full  ${mode === "dark" ? "bg-light-800" : "bg-dark-200"}`}
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        />
        <Image
          src={"/assets/svgs/icon-moon.svg"}
          alt="Moon"
          width={20}
          height={20}
          className="active p-0.5"
        />
        <Image
          src={"/assets/svgs/icon-sun.svg"}
          alt="Sun"
          width={20}
          height={20}
          className={`active p-0.5 ${mode === "dark" ? "none" : "invert"} `}
        />
      </div>
    </div>
  );
};

export default Theme;
