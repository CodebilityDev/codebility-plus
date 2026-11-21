import type { Metadata } from "next";

import { AuthShell } from "@/components/global/auth/AuthShell";
import UpdatePasswordForm from "@/components/auth/update-password/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Set a new password | Codebility",
  description: "Choose a new password for your Codebility account.",
};

const UpdatePasswordPage = () => {
  return (
    <AuthShell>
      <UpdatePasswordForm />
    </AuthShell>
  );
};

export default UpdatePasswordPage;
