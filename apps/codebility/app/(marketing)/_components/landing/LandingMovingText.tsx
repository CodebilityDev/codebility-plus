import React from "react";
import Image from "next/image";

const MovingText = () => {
  return (
    <div className="text-md border-light-900/5 bg-light-900/5 flex w-full flex-col items-center justify-center gap-4 border-y-4 p-8 text-center text-white md:mt-20 md:text-3xl lg:text-5xl">
      <div className="flex w-full flex-row items-center justify-center gap-4 px-4">
        <Image
          alt="diamond-icon"
          src="/assets/svgs/icon-diamond-purple.svg"

          width={30}
          height={30}
        />
        Mobile Development{" "}
        <span>
          <Image
            alt="diamond-icon"
            src="/assets/svgs/icon-diamond-sky.svg"
            width={30}
            height={30}

          />
        </span>{" "}
        Digital Marketing
        <span>
          <Image
            alt="diamond-icon"
            src="/assets/svgs/icon-diamond-purple.svg"
            width={30}
            height={30}

          />
        </span>{" "}
      </div>
      <div className="flex w-full flex-row items-center justify-center px-4 md:gap-8">
        UI/UX Design{" "}
        <span>
          <Image
            alt="diamond-icon"
            src="/assets/svgs/icon-diamond-sky.svg"
            width={30}
            height={30}

          />
        </span>{" "}
        AI-Development{" "}
        <span>
          <Image
            alt="diamond-icon"
            src="/assets/svgs/icon-diamond-purple.svg"
            width={30}
            height={30}

          />
        </span>{" "}
        Web Development
      </div>
    </div>
  );
};

export default MovingText;
