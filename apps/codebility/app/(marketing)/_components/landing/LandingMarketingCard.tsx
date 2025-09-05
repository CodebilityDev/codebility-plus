import React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@codevs/ui";

interface MarketingCardProps {
  title: string;
  description: string;
  className?: string; // Optional className prop
}

const MarketingCard: React.FC<MarketingCardProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <Link className="cursor-pointer" href="/">
      <div className="p-2 text-white">
        <div
          className={cn(
            "border-light-900/5 flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 px-8 py-8 backdrop-blur-lg hover:opacity-70 md:h-60 lg:h-48",
            className,
          )}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="font-bold">{title}</h1>
            <span className="flex size-10 flex-col items-center justify-center rounded-full border-2 border-white/5 bg-white/5 hover:bg-[#9747FF]">
              <Image
                src="/assets/svgs/icon-arrow-up-right.svg"
                width={15}
                height={15}
                alt="arrow up"
                
              />
            </span>
          </div>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default MarketingCard;
