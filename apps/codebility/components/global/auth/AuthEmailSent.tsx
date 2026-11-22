"use client";

import { Check, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/global/design-system/Button";

export interface AuthEmailSentProps {
  email: string;
  onResend?: () => void;
  isResending?: boolean;
}

export function AuthEmailSent({
  email,
  onResend,
  isResending = false,
}: AuthEmailSentProps) {
  return (
    <div className="w-full">
      <span className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#9747ff]/25 bg-[#1c102c] text-[#c084fc]">
        <Mail aria-hidden className="h-6 w-6" />
      </span>

      <h1 className="mt-9 text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
        Check your email
      </h1>
      <p className="mt-4 max-w-[420px] text-[15px] leading-6 text-white/65">
        If an account exists for{" "}
        <strong className="font-semibold text-white">{email}</strong>, we&apos;ve
        sent a link to reset your password.
      </p>

      <ul className="mt-8 flex flex-col gap-4 text-[14px] leading-5 text-white/65">
        <li className="flex items-start gap-3">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#c084fc]" />
          <span>
            The link works once and expires after a while, so use the latest
            email.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#c084fc]" />
          <span>Can&apos;t find it? Check your spam or promotions folder.</span>
        </li>
      </ul>

      <Button
        asChild
        className="mt-8 h-[56px] w-full rounded-full bg-[#9747ff] text-[16px] font-medium shadow-[0_0_34px_rgba(151,71,255,0.26)] hover:bg-[#a855f7]"
      >
        <Link href="/auth/sign-in">Back to sign in</Link>
      </Button>

      <p className="mt-5 text-center text-[14px] text-white/60">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={!onResend || isResending}
          className="font-semibold text-white underline-offset-2 transition-colors hover:text-[#c084fc] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isResending ? "Sending..." : "Resend link"}
        </button>
      </p>
    </div>
  );
}
