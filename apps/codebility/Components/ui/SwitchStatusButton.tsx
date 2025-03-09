
import { motion } from "framer-motion";

import { cn } from "@codevs/ui";

export default function SwitchStatusButton({
  isActive,
  handleSwitch,
  disabled,
}: {
  isActive: boolean;
  handleSwitch: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-center">
      <motion.button
        className={cn(
          "flex h-6 w-12 cursor-pointer items-center rounded-full p-1",
          isActive ? "bg-green-500" : "bg-gray-300",
          disabled && "cursor-not-allowed",
        )}
        onClick={handleSwitch}
        animate={{
          backgroundColor: isActive ? "#22c55e" : "#d1d5db",
        }}
        disabled={disabled}
      >
        <motion.div
          className="h-5 w-5 rounded-full bg-white shadow-md"
          animate={{
            x: isActive ? "100%" : "0%",
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        />
      </motion.button>
    </div>
  );
}
