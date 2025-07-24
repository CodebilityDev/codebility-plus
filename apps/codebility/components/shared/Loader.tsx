import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div className={className}>
      {" "}
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <div className="text-primaryColor">Please wait</div>
        <div className="dots translate-y-1"></div>
      </div>
    </div>
  );
};

export default Loader;
