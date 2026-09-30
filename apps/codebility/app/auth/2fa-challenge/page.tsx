import { Suspense } from "react";
import { redirect } from "next/navigation";

import Logo from "@/components/global/layout/Logo";
import { Toaster } from "@/components/global/ui/toaster";
import TwoFactorForm from "@/components/auth/2fa-challenge/TwoFactorForm";
import { createClientServerComponent } from "@/lib/global/supabase-server";

export const instant = false;


export default async function TwoFactorChallengePage() {
  const supabase = await createClientServerComponent();
  const { data } = await supabase.auth.mfa.listFactors();
  const verifiedFactor = data?.totp.find(
    (factor) => (factor.status as string) === "verified",
  );

  if (!verifiedFactor) redirect("/auth/sign-in");

  return (
    <>
      <Toaster />
      <div className="bg-dark-300 flex min-h-screen w-full text-white">
        <div className="flex flex-1 flex-col justify-center px-4 py-8 max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
            <p className="text-sm text-gray">
              Your account is protected with 2FA. Please enter the security code from your authenticator app to proceed.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-sm text-gray">Loading authentication form...</div>}>
            <TwoFactorForm factorId={verifiedFactor.id} />
          </Suspense>
        </div>
        <div className="bg-login hidden w-full flex-1 bg-cover bg-center lg:flex" />
      </div>
    </>
  );
}