import Link from "next/link";
import { Check } from "lucide-react";

import { AuthStatusPanel } from "@/components/global/auth/AuthStatusPanel";
import { Button } from "@/components/global/design-system/Button";

export function SignUpSuccess({ name, email }: { name: string; email: string }) {
  return (
    <div className="mx-auto w-full max-w-[416px]">
      <AuthStatusPanel
        icon={Check}
        tone="success"
        title="Application sent"
        description={
          <>
            Thanks, {name}. Our team reviews every application and will email
            you at{" "}
            <strong className="font-semibold text-white">{email}</strong> about
            next steps.
          </>
        }
      >
        <Button
          asChild
          className="h-[56px] w-full rounded-full bg-[#9747ff] text-[16px] font-medium shadow-[0_0_34px_rgba(151,71,255,0.26)] hover:bg-[#a855f7]"
        >
          <Link href="/">Back to site</Link>
        </Button>
        <p className="mt-5 text-center text-[14px] text-white/60">
          Want to know more first?{" "}
          <Link
            href="/codevs"
            className="font-medium text-white transition-colors hover:text-[#c084fc]"
          >
            Read about the CoDev program
          </Link>
        </p>
      </AuthStatusPanel>
    </div>
  );
}
