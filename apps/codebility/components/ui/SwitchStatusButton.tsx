import { motion } from "framer-motion";

import { cn } from "@codevs/ui";

export default function SwitchStatusButton({
  isActive,
  handleSwitch,
  disabled,
  id = "",
}: {
  isActive: boolean;
  handleSwitch: (e: React.MouseEvent) => void;
  disabled: boolean;
  id?: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <button
        className={cn(
          "relative flex h-6 w-12 cursor-pointer items-center rounded-full p-1 transition-all duration-200",
          isActive 
            ? "bg-green-500 dark:bg-green-600" 
            : "bg-gray-300 dark:bg-gray-600",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={handleSwitch}
        disabled={disabled}
        id={id}
      >
        <motion.div
          className="h-4 w-4 rounded-full bg-white shadow-md"
          animate={{
            x: isActive ? 24 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        />
      </button>
    </div>
  );
}
