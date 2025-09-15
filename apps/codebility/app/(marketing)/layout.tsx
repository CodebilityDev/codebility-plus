"use server";
import { ModalProviderMarketing } from "@/components/providers/modal-provider-marketing";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>
        {children}
        <ModalProviderMarketing />
      </main>
    </div>
  );
}
