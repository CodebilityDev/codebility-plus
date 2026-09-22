import React from "react";
import LandingImage from "./LandingImage";

const Diamond = ({ color }: { color?: string }) => {
  return (
    <>
      {color === "violet" ? (
        <div className="relative">
<<<<<<< HEAD
          <Image
            alt=""
=======
          <LandingImage
            alt="diamond-icon"
>>>>>>> 52e0ed3533dfe84578477ada1e0703417e534f8c
            src="https://codebility-cdn.pages.dev/assets/svgs/icon-diamond-purple.svg"
            width={30}
            height={30}
            className="relative z-10"
          />
          <div className="bg-customViolet-100 absolute left-0 top-0 h-full w-full rounded-full opacity-40 blur-sm filter"></div>
        </div>
      ) : color === "teal" ? (
        <div className="relative">
<<<<<<< HEAD
          <Image
            alt=""
=======
          <LandingImage
            alt="diamond-icon"
>>>>>>> 52e0ed3533dfe84578477ada1e0703417e534f8c
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
