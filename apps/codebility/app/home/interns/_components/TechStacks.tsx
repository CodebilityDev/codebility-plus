import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@codevs/ui/collapsible";

type TechStacksProps = {
  techStacks: string[];
};

function TechIcon({ tech }: { tech: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative flex h-[20px] w-[20px] items-center justify-center">
      {!isLoaded && (
        <Loader2 className="absolute h-4 w-4 animate-spin text-gray-400" />
      )}
      <Image
        src={`/assets/svgs/icon-${tech.toLowerCase()}.svg`}
        alt={`${tech} icon`}
        width={20}
        height={20}
        title={tech}
        className={`h-[20px] w-[20px] object-contain transition duration-300 hover:-translate-y-0.5 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default function TechStacks({ techStacks }: TechStacksProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const visibleTech = techStacks.slice(0, 10);
  const hiddenTech = techStacks.slice(10);

  return (
    <Collapsible open={isOpen}>
      <div className="flex flex-wrap gap-2">
        {visibleTech.map((tech, idx) =>
          tech ? <TechIcon tech={tech} key={`${tech}-${idx}`} /> : null,
        )}
        {!isOpen && hiddenTech.length > 0 && (
          <CollapsibleTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <div className="flex cursor-pointer items-center gap-1 text-sm text-gray-600 hover:underline dark:text-gray-400">
              +{hiddenTech.length} more
            </div>
          </CollapsibleTrigger>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <CollapsibleContent asChild forceMount>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2 flex flex-wrap gap-2">
                {hiddenTech.map((tech, idx) => (
                  <TechIcon tech={tech} key={`${tech}-${idx}`} />
                ))}
                <CollapsibleTrigger
                  asChild
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <div className="flex cursor-pointer items-center gap-1 text-sm text-gray-600 hover:underline dark:text-gray-400">
                    Show less
                  </div>
                </CollapsibleTrigger>
              </div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
}
