import React from "react";
import Navigation from "@/app/(marketing)/_components/MarketingNavigation";

export default function AuthWaitingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
