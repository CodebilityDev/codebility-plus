"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@codevs/ui/input";
import { ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function TwoFactorForm() {
  const [supabase] = useState(() => createClientClientComponent());
  const [code, setCode] = useState("");
  const [isBackupMode, setIsBackupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadFactors() {
      try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) throw error;

        const verifiedFactor = data?.totp?.find((f) => f.status === "verified");
        if (verifiedFactor) {
          setFactorId(verifiedFactor.id);
        } else {
          // If no verified factor, redirect to sign-in or home
          toast.error("No active 2FA factor found for this account.");
          router.push("/auth/sign-in");
        }
      } catch (err) {
        console.error("Error loading 2FA factors:", err);
      }
    }
    loadFactors();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter your verification code");
      return;
    }

    if (!factorId && !isBackupMode) {
      toast.error("Authentication factor not ready. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    try {
      if (isBackupMode) {
        // Backup Recovery Code check placeholder / code verification
        toast.error("Invalid recovery code. Please check your backup codes or try TOTP.");
        setIsLoading(false);
        return;
      }

      // Standard TOTP Challenge & Verify
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: factorId!,
        code: code.trim(),
      });

      if (error) {
        toast.error(error.message || "Invalid 2FA code. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Identity verified successfully!");
      const returnTo = searchParams.get("from") || "/home";
      router.push(returnTo);
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="space-y-2">
        <label htmlFor="2fa-code" className="text-sm text-gray font-medium block text-center">
          {isBackupMode ? "Enter 9-character Recovery Code" : "Enter 6-digit Authenticator Code"}
        </label>
        <Input
          id="2fa-code"
          type="text"
          placeholder={isBackupMode ? "XXXX-XXXX" : "123456"}
          value={code}
          maxLength={isBackupMode ? 10 : 6}
          onChange={(e) => setCode(e.target.value.trim())}
          className="text-center font-mono text-xl tracking-widest bg-dark-200 text-white border-dark-100 h-12"
          autoFocus
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || (!isBackupMode && code.length < 6)}
        className="w-full bg-customBlue-100 text-white hover:bg-customBlue-200 h-11"
      >
        {isLoading ? "Verifying Identity..." : "Verify & Continue"}
      </Button>

      <div className="flex flex-col gap-2 pt-2 text-center text-xs text-gray">
        <button
          type="button"
          onClick={() => {
            setIsBackupMode(!isBackupMode);
            setCode("");
          }}
          className="text-customBlue-100 hover:underline flex items-center justify-center gap-1"
        >
          <KeyRound className="w-3.5 h-3.5" />
          {isBackupMode ? "Use Authenticator App Code instead" : "Use Backup Recovery Code"}
        </button>

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
