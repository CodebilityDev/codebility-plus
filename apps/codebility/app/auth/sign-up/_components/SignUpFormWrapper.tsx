import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import SignUpForm from "./SignUpForm"; // Adjust path as needed

export default function SignUpPage() {
  return (
    <ModalProviderHome>
      <SignUpForm />
    </ModalProviderHome>
  );
}