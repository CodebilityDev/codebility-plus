import { Suspense } from "react";
import Logo from "@/components/shared/Logo";
import { Toaster } from "@/components/ui/toaster";
import TwoFactorForm from "./_components/TwoFactorForm";

export const dynamic = "force-dynamic";

export default function TwoFactorChallengePage() {
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
            <TwoFactorForm />
          </Suspense>
        </div>
        <div className="bg-login hidden w-full flex-1 bg-cover bg-center lg:flex" />
      </div>
    </>
  );
}
