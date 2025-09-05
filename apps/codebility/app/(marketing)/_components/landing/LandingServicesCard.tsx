import React from "react";
import Image from "next/image";

import { cn } from "@codevs/ui";

interface ServicesCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string; // Optional className prop
}

const ServicesCard: React.FC<ServicesCardProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "max-h-[450px] w-full rounded-lg border-2 border-[#1D1D1E] bg-[#0A0A0A] p-4",
        className,
      )}
    >
      <div className="">
        <Image
          src={imageUrl}
          width={90}
          alt={imageAlt}
          height={100}

          className="h-[210px] w-full bg-[#9747FF]"
        />
      </div>
      <h1 className="pt-4 font-[400]">{title}</h1>
      <p className="pt-6">{description}</p>
    </div>
  );
};

export default ServicesCard;
