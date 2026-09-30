"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientClientComponent } from "@/lib/global/supabase-client";
import { Button } from "@/components/global/ui/button";
import { Input } from "@codevs/ui/input";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { TwoFactorFormProps } from "@/types/auth/2fa-challenge/2fa-challenge";

export default function TwoFactorForm({ factorId }: TwoFactorFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter your verification code");
      return;
    }

    if (!factorId) {
      toast.error("Authentication factor not ready. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    const supabase = createClientClientComponent();
    if (!supabase) {
      toast.error("Authentication service unavailable");
      setIsLoading(false);
      return;
    }

    try {
      // Standard TOTP Challenge & Verify
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factorId,
        code: code.trim(),
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success("Identity verified successfully!");
      const returnTo = searchParams.get("from") ?? "/home";
      router.push(returnTo);
    } catch (err: any) {
      toast.error(err?.message ?? "Verification failed");
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClientClientComponent();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="space-y-2">
        <label htmlFor="2fa-code" className="text-sm text-gray font-medium block text-center">
          Enter 6-digit Authenticator Code
        </label>
        <Input
          id="2fa-code"
          type="text"
          placeholder="123456"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value.trim())}
          className="text-center font-mono text-xl tracking-widest bg-dark-200 text-white border-dark-100 h-12"
          autoFocus
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || code.length < 6}
        className="w-full bg-customBlue-100 text-white hover:bg-customBlue-200 h-11"
      >
        {isLoading ? "Verifying Identity..." : "Verify & Continue"}
      </Button>

      <div className="flex flex-col gap-2 pt-2 text-center text-xs text-gray">
        <p>
          Lost access to your authenticator app? Contact an admin to have 2FA
          reset on your account.
        </p>

        <button
          type="button"
          onClick={handleSignOut}
          className="text-gray-400 hover:text-white hover:underline flex items-center justify-center gap-1 mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel & Sign Out
        </button>
      </div>
    </form>
  );
}