import React from "react";
import Image from "next/image";

const Badges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <Image
        src="/assets/svgs/badges/intern-badge.svg"
        alt="Intern Badge"
        width={60}
        height={54}
        title="Intern Badge"
        className="h-[54px] w-[60px] bg-cover transition duration-300 hover:-translate-y-0.5"
      />
    </div>
  );
};

export default Badges;
