import React from "react";
import Navigation from "@/components/global/marketing/MarketingNavigation";

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
