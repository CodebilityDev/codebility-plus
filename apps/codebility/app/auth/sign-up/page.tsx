import type { Metadata } from "next";

import { AuthShell } from "@/components/global/auth/AuthShell";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";

export const metadata: Metadata = {
  title: "Join as a CoDev | Codebility",
  description: "Apply to join Codebility as a CoDev.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      brandVariant="signup"
      align="top"
      contentClassName="max-w-[480px]"
    >
      <SignUpForm />
    </AuthShell>
  );
}
