
import Navigation from "@/components/global/marketing/MarketingNavigation";
import type { AuthWaitingLayoutProps } from "@/types/auth/waiting/waiting";

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
