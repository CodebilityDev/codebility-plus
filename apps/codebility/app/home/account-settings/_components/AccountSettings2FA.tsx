"use client";

import { useEffect, useState } from "react";
import { createClientClientComponent } from "@/utils/supabase/client";
import { ShieldCheck, ShieldAlert, CheckCircle2, Copy, QrCode, Key, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Label } from "@codevs/ui/label";
import { Input } from "@codevs/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";

interface Factor {
  id: string;
  status: "verified" | "unverified";
  friendly_name?: string;
  factor_type: string;
}

export default function AccountSettings2FA() {
  const [supabase] = useState(() => createClientClientComponent());
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [activeFactor, setActiveFactor] = useState<Factor | null>(null);

  // Dialog States
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  // Enrollment Data
  const [enrollingFactorId, setEnrollingFactorId] = useState<string>("");
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMfaFactors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const totpFactors = (data?.totp || []) as Factor[];
      setFactors(totpFactors);

      const verified = totpFactors.find((f) => f.status === "verified");
      setActiveFactor(verified || null);
    } catch (err) {
      console.error("Error fetching 2FA factors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMfaFactors();
  }, []);

  const handleStartEnrollment = async () => {
    try {
      setSubmitting(true);
      setVerificationCode("");

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Codebility Authenticator",
      });

      if (error) {
        toast.error(error.message || "Failed to initiate 2FA setup");
        return;
      }

      setEnrollingFactorId(data.id);
      setQrCodeSvg(data.totp.qr_code);
      setSecretKey(data.totp.secret);
      setIsEnrollOpen(true);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyEnrollment = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast.error("Please enter a valid 6-digit authentication code");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollingFactorId,
        code: verificationCode.trim(),
      });

      if (error) {
        toast.error(error.message || "Invalid authentication code");
        return;
      }

      toast.success("Two-Factor Authentication successfully enabled!");
      setIsEnrollOpen(false);

      setIsRecoveryOpen(true);

      await fetchMfaFactors();
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!activeFactor) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: activeFactor.id,
      });

      if (error) {
        toast.error(error.message || "Failed to disable 2FA");
        return;
      }

      toast.success("Two-Factor Authentication disabled");
      setIsDisableOpen(false);
      await fetchMfaFactors();
    } catch (err: any) {
      toast.error(err?.message || "Failed to disable 2FA");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label htmlFor="two-factor" className="text-base font-semibold">
              Two-Factor Authentication (2FA)
            </Label>
            {!loading && (
              activeFactor ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-500 px-2.5 py-0.5 rounded-full border border-green-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5" /> Disabled
                </span>
              )
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Protect your account with a Time-based One-Time Password (TOTP) from Google Authenticator, Authy, or 1Password.
          </p>
        </div>

        <div>
          {loading ? (
            <Button disabled className="h-9 text-sm">Loading...</Button>
          ) : activeFactor ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDisableOpen(true)}
                className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600 text-sm h-9"
              >
                Disable 2FA
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartEnrollment}
              disabled={submitting}
              className="bg-customBlue-200 text-white duration-300 hover:bg-customBlue-300 text-sm h-9"
            >
              {submitting ? "Initiating..." : "Enable 2FA"}
            </Button>
          )}
        </div>
      </div>

      {/* ENROLLMENT MODAL */}
      <Dialog open={isEnrollOpen} onOpenChange={setIsEnrollOpen}>
        <DialogContent className="background-box text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-customBlue-200" /> Setup Authenticator App
            </DialogTitle>
            <DialogDescription>
              Scan the QR code below using your authenticator app (e.g. Google Authenticator, Authy).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            {qrCodeSvg && (
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <img src={qrCodeSvg} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            {secretKey && (
              <div className="w-full space-y-1">
                <Label className="text-xs text-muted-foreground">Secret Key (Manual Entry)</Label>
                <div className="flex items-center gap-2 bg-muted p-2 rounded text-xs font-mono break-all justify-between">
                  <span>{secretKey}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(secretKey, "Secret key")}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            <div className="w-full space-y-2 pt-2">
              <Label htmlFor="verification-code" className="text-sm font-medium">
                Enter 6-Digit Verification Code
              </Label>
              <Input
                id="verification-code"
                placeholder="123456"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-lg tracking-widest"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEnrollOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleVerifyEnrollment}
              disabled={submitting || verificationCode.length < 6}
              className="bg-customBlue-200 text-white hover:bg-customBlue-300"
            >
              {submitting ? "Verifying..." : "Verify & Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ENABLED CONFIRMATION MODAL */}
      <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
        <DialogContent className="background-box text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" /> Two-Factor Authentication Enabled
            </DialogTitle>
            <DialogDescription>
              You will now be asked for a code from your authenticator app each time you sign in.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-lg border border-border">
            <p className="text-sm">
              Keep your authenticator app safe. Backup recovery codes are not
              available yet, so if you lose access to your device you will need
              an admin to reset 2FA on your account.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsRecoveryOpen(false)}
              className="bg-customBlue-200 text-white hover:bg-customBlue-300 w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DISABLE 2FA MODAL */}
      <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
        <DialogContent className="background-box text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <Lock className="w-5 h-5" /> Disable Two-Factor Authentication?
            </DialogTitle>
            <DialogDescription>
              Disabling 2FA will lower your account security. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDisableOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={submitting}
            >
              {submitting ? "Disabling..." : "Yes, Disable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
