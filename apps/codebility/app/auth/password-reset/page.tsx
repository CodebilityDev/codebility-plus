import type { Metadata } from "next";

import { AuthShell } from "@/components/global/auth/AuthShell";
import PasswordResetForm from "@/components/auth/password-reset/PasswordResetForm";

export const metadata: Metadata = {
  title: "Reset your password | Codebility",
  description: "Request a password reset link for your Codebility account.",
};

const PasswordReset = () => {
  return (
    <AuthShell>
      <PasswordResetForm />
    </AuthShell>
  );
};

export default PasswordReset;
