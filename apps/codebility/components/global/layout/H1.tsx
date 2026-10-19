import type { H1 } from "@/types/global/layout";


export default function H1({ children, className }: H1) {
  return (
    <h1
      className={`text-dark100_light900 mb-4 text-lg font-semibold md:text-3xl ${className}`}
    >
      {children}
    </h1>
  );
}
