import type { Metadata } from "next";

import { AuthShell } from "@/components/global/auth/AuthShell";
import SignInForm from "@/components/auth/sign-in/SignInForm";

export const metadata: Metadata = {
  title: "Sign in | Codebility",
  description: "Sign in to your Codebility account.",
};

const SignIn = () => {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  );
};

export default SignIn;
