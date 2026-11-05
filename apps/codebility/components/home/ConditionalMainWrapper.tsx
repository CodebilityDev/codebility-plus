import type { ConditionalMainWrapperProps } from "@/types/home/home";

export default function ConditionalMainWrapper({ children }: ConditionalMainWrapperProps) {
  return <div className="h-full w-full">{children}</div>;
}
