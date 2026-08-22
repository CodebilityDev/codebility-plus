import React from "react";
import MarketingSCNavigation from "@/app/(marketing)/_components/MarketingSCNavigation";

export default function AuthWaitingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MarketingSCNavigation />
      {children}
    </div>
  );
}
