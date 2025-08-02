import React from "react";
import Image from "next/image";

const Diamond = ({ color }: { color?: string }) => {
  return (
    <>
      {color === "violet" ? (
        <div className="relative">
          <Image
            alt="diamond-icon"
            src="https://codebility-cdn.pages.dev/assets/svgs/icon-diamond-purple.svg"
            width={30}
            height={30}
            className="relative z-10"
          />
          <div className="bg-violet absolute left-0 top-0 h-full w-full rounded-full opacity-40 blur-sm filter"></div>
        </div>
      ) : color === "teal" ? (
        <div className="relative">
          <Image
            alt="diamond-icon"
            src="https://codebility-cdn.pages.dev/assets/svgs/icon-diamond-teal.svg"
            width={30}
            height={30}
            className="relative z-10"
          />
          <div className="bg-customTeal absolute left-0 top-0 h-full w-full rounded-full opacity-40 blur-sm filter"></div>
        </div>
      ) : null}
    </>
  );
};

export default Diamond;
