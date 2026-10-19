import type { ContainerProps } from "@/types/global/marketing";

const Container = ({
  children,
  className,
}: ContainerProps) => {
  return <div className={`mx-auto w-full max-w-screen-xl p-3 ${className}`}>{children}</div>;
};

export default Container;
