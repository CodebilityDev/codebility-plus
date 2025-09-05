import React, { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`max-w-screen-xl p-3 ${className}`}>{children}</div>;
};

export default Container;
