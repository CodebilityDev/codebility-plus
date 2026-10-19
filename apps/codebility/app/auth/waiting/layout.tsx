
import Navigation from "@/components/global/marketing/MarketingNavigation";
import type { AuthWaitingLayoutProps } from "@/types/auth/waiting/waiting";

export const instant = false;

export default function AuthWaitingLayout({
  children,
}: AuthWaitingLayoutProps) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}