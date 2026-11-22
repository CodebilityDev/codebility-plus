"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Plus,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Checkbox } from "@codevs/ui/checkbox";

import { checkEmailStatus, signupUser } from "@/actions/global/auth-session";
import { AuthAlert } from "@/components/global/auth/AuthAlert";
import { AuthField } from "@/components/global/auth/AuthField";
import { NdaSignature } from "@/components/global/nda-signing/NdaSignature";
import { NdaTerms } from "@/components/global/nda-signing/NdaTerms";
import { Button } from "@/components/global/design-system/Button";
import TechStackModal from "@/components/global/modals/TechStackModal";
import PrivacyPolicyModal from "@/components/global/modals/PrivacyPolicyModal";
import { getTechStackIconName } from "@/constants/global/techstack";
import { POSITIONS } from "@/constants/auth/sign-up/sign-up";
import { useTechStackStore } from "@/hooks/global/use-techstack";
import { useModal } from "@/hooks/global/use-modal";
import { reportError } from "@/lib/global/error-reporting";
import type { SignupFormData } from "@/types/auth/sign-up/sign-up";
import { SignupFormSchema } from "@/utils/auth/sign-up/sign-up";

import { SignUpProgress } from "@/components/auth/sign-up/SignUpProgress";
import { SignUpSuccess } from "@/components/auth/sign-up/SignUpSuccess";

interface ApplicationSummary {
  name: string;
  email: string;
}

const stepFields: Record<number, (keyof SignupFormData)[]> = {
  1: ["email_address", "username", "password", "confirmPassword"],
  2: [
    "first_name",
    "last_name",
    "phone_number",
    "positions",
    "tech_stacks",
    "years_of_experience",
  ],
  3: ["about", "portfolio_website", "linkedin", "github", "facebook", "discord"],
};

const inputClass = "h-12";

const actionButtonClass =
  "h-12 rounded-full px-6 text-[15px] font-medium";

export default function SignUpForm() {
  const { onOpen } = useModal();
  const { stack, addRemoveStack, clearStack } = useTechStackStore();

  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<ApplicationSummary | null>(
    null,
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [ndaData, setNdaData] = useState<{
    signature: string;
    document: string;
  } | null>(null);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "registered" | "declined" | "error"
  >("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [ndaError, setNdaError] = useState<string | null>(null);
  const [showAgreementErrors, setShowAgreementErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email_address: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
      about: "",
      portfolio_website: "",
      positions: [],
      tech_stacks: [],
      years_of_experience: 0,
      facebook: "",
      linkedin: "",
      github: "",
      discord: "",
      privacyPolicy: false,
      ndaAgreement: false,
    },
  });

  const emailValue = form.watch("email_address");
  const selectedPositions = form.watch("positions");
  const years = form.watch("years_of_experience");
  const firstName = form.watch("first_name");
  const lastName = form.watch("last_name");

  useEffect(() => {
    form.setValue("tech_stacks", stack);
  }, [stack, form]);

  useEffect(() => {
    if (step !== 4) return;

    setShowAgreementErrors(false);
    form.clearErrors(["privacyPolicy", "ndaAgreement"]);
  }, [step, form]);

  useEffect(() => {
    const value = emailValue.trim();

    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailStatus("idle");
      return;
    }

    let cancelled = false;
    setEmailStatus("checking");

    const timer = setTimeout(() => {
      void checkEmailStatus(value)
        .then((status) => {
          if (!cancelled) setEmailStatus(status);
        })
        .catch((error: unknown) => {
          if (cancelled) return;

          reportError(error, {
            source: "client",
            boundary: "sign-up",
            section: "email-status",
          });
          setEmailStatus("error");
        });
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [emailValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errors: string[] = [];
    if (file.size > 5 * 1024 * 1024) {
      errors.push("Image size must be less than 5MB");
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      errors.push("Please select a valid image file (JPEG, PNG, or WebP)");
    }

    if (errors.length > 0) {
      toast.error(errors.join(". "));
      return;
    }

    setProfileImage(file);
  };

  const nextStep = async () => {
    const fields = stepFields[step];
    if (!fields) return;

    const valid = await form.trigger(fields);
    if (!valid) return;

    const next = Math.min(step + 1, 4);

    if (next === 4) {
      form.clearErrors(["privacyPolicy", "ndaAgreement"]);
    }

    setStep(next);
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!ndaSigned || !ndaData) {
      setNdaError("Please sign the NDA before submitting your application.");
      return;
    }

    setFormError(null);
    setNdaError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number") {
          formData.append(key, value.toString());
        }
      });

      formData.append("positions", JSON.stringify(data.positions));
      formData.append("tech_stacks", JSON.stringify(stack));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      formData.append("ndaSigned", "true");
      formData.append("ndaSignature", ndaData.signature);
      formData.append("ndaDocument", ndaData.document);

      const result = await signupUser(formData);

      if (!result.success) {
        setFormError(result.error ?? "Failed to create account");
        return;
      }

      clearStack();
      setApplication({
        name: data.first_name,
        email: data.email_address,
      });
    } catch (error) {
      reportError(error, {
        source: "client",
        boundary: "sign-up",
        section: "submit",
      });
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (application) {
    return (
      <div className="pt-16 lg:pt-[188px]">
        <SignUpSuccess name={application.name} email={application.email} />
      </div>
    );
  }

  return (
    <>
      <TechStackModal />
      <PrivacyPolicyModal />

      <div className="w-full">
        <h1 className="text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
          Join as a CoDev
        </h1>
        <p className="mt-3 max-w-[440px] text-[15px] leading-6 text-white/65">
          Four short steps. Fields marked optional can be added later from your
          profile.
        </p>

        <div className="mt-8">
          <SignUpProgress step={step} />
        </div>

        <form
          className="mt-8"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {formError ? (
            <AuthAlert className="mb-5">{formError}</AuthAlert>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <div>
                <AuthField
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  inputClassName={inputClass}
                  error={form.formState.errors.email_address?.message}
                  {...form.register("email_address")}
                />
                {emailStatus !== "idle" ? (
                  <p
                    className={
                      emailStatus === "available"
                        ? "mt-2 text-xs text-[#7BE0B6]"
                        : emailStatus === "checking" || emailStatus === "error"
                          ? "mt-2 text-xs text-[#FBBF24]"
                          : "mt-2 text-xs text-[#F08A8A]"
                    }
                  >
                    {emailStatus === "checking" && "Checking availability..."}
                    {emailStatus === "available" && "Email is available."}
                    {emailStatus === "registered" &&
                      "This email is already registered. Try signing in instead."}
                    {emailStatus === "declined" &&
                      "This email was previously declined. Sign in and reapply from the declined page."}
                    {emailStatus === "error" &&
                      "We could not check this email right now. You can still apply."}
                  </p>
                ) : null}
              </div>

              <div>
                <AuthField
                  label="Username"
                  placeholder="e.g. juandev"
                  autoComplete="username"
                  inputClassName={inputClass}
                  error={form.formState.errors.username?.message}
                  {...form.register("username")}
                />
                <p className="mt-2 text-xs leading-4 text-white/40">
                  Shown on your public CoDev profile.
                </p>
              </div>

              <div>
                <AuthField
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  inputClassName={inputClass}
                  error={form.formState.errors.password?.message}
                  {...form.register("password")}
                />
                <p className="mt-2 text-xs leading-4 text-white/40">
                  At least 8 characters.
                </p>
              </div>

              <AuthField
                label="Confirm password"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                inputClassName={inputClass}
                error={form.formState.errors.confirmPassword?.message}
                {...form.register("confirmPassword")}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <label className="flex h-[72px] w-[72px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-dashed border-white/25 bg-[#111111] text-white/70 transition-colors hover:border-[#9747ff] hover:text-white">
                  <Upload aria-hidden className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <div>
                  <p className="text-[14px] font-semibold leading-5 text-white">
                    Add a profile photo{" "}
                    <span className="font-normal text-[#c084fc]">Upload</span>
                  </p>
                  <p className="mt-1 max-w-[300px] text-xs leading-4 text-white/40">
                    Square, at least 800 × 800 px. Head and shoulders, plain
                    background, no borders. JPG, PNG or WEBP.
                  </p>
                  {profileImage ? (
                    <p className="mt-1 text-xs text-[#7BE0B6]">
                      {profileImage.name}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AuthField
                  label="First name"
                  placeholder="Juan"
                  autoComplete="given-name"
                  inputClassName={inputClass}
                  error={form.formState.errors.first_name?.message}
                  {...form.register("first_name")}
                />
                <AuthField
                  label="Last name"
                  placeholder="Dela Cruz"
                  autoComplete="family-name"
                  inputClassName={inputClass}
                  error={form.formState.errors.last_name?.message}
                  {...form.register("last_name")}
                />
              </div>

              <AuthField
                label="Phone number"
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                autoComplete="tel"
                inputClassName={inputClass}
                error={form.formState.errors.phone_number?.message}
                {...form.register("phone_number")}
              />

              <div>
                <p className="text-[13px] font-medium leading-5 text-white/80">
                  Positions
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {POSITIONS.slice(0, 6).map((position) => {
                    const active = selectedPositions.some(
                      (item) => item.id === position.id,
                    );

                    return (
                      <button
                        key={position.id}
                        type="button"
                        onClick={() => {
                          const next = active
                            ? selectedPositions.filter(
                                (item) => item.id !== position.id,
                              )
                            : [...selectedPositions, position];

                          form.setValue("positions", next, {
                            shouldValidate: true,
                          });
                        }}
                        className={
                          active
                            ? "rounded-[7px] border border-[#9747ff]/60 bg-[#2a1543] px-3 py-2 text-[13px] text-white"
                            : "rounded-[7px] border border-white/10 bg-[#141414] px-3 py-2 text-[13px] text-white/65 transition-colors hover:border-white/25 hover:text-white"
                        }
                      >
                        {position.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-white/40">Pick all that apply.</p>
                {form.formState.errors.positions ? (
                  <p className="mt-1 text-xs text-[#fca5a5]">
                    {form.formState.errors.positions.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="years_of_experience"
                  className="text-[13px] font-medium leading-5 text-white/80"
                >
                  Years of experience
                </label>
                <div className="relative mt-2">
                  <select
                    id="years_of_experience"
                    value={years ? String(years) : ""}
                    onChange={(event) =>
                      form.setValue(
                        "years_of_experience",
                        Number(event.target.value) || 0,
                      )
                    }
                    className="h-12 w-full appearance-none rounded-[8px] border border-white/10 bg-[#151515] px-3.5 text-[14px] text-white outline-none transition-colors focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 11 }, (_, index) => (
                      <option key={index} value={index}>
                        {index === 0 ? "Less than 1 year" : `${index} years`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
                  />
                </div>
              </div>

              <div>
                <p className="text-[13px] font-medium leading-5 text-white/80">
                  Tech stack
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 rounded-[6px] border border-[#9747ff]/40 bg-[#241438] px-2.5 py-1.5 text-[12px] capitalize text-white"
                    >
                      <Image
                        src={`/assets/svgs/techstack/icon-${getTechStackIconName(tech)}.svg`}
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain"
                      />
                      {tech}
                      <button
                        type="button"
                        aria-label={`Remove ${tech}`}
                        onClick={() => addRemoveStack(tech)}
                        className="text-white/50 transition-colors hover:text-white"
                      >
                        <X aria-hidden className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => onOpen("techStackModal")}
                    className="flex items-center gap-1.5 rounded-[6px] border border-white/10 bg-[#141414] px-2.5 py-1.5 text-[12px] text-white/65 transition-colors hover:border-white/25 hover:text-white"
                  >
                    <Plus aria-hidden className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                {form.formState.errors.tech_stacks ? (
                  <p className="mt-1 text-xs text-[#fca5a5]">
                    {form.formState.errors.tech_stacks.message}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="about"
                    className="text-[13px] font-medium leading-5 text-white/80"
                  >
                    About you
                  </label>
                  <span className="text-xs text-white/40">Optional</span>
                </div>
                <textarea
                  id="about"
                  rows={4}
                  placeholder="A few lines about what you build and what you want to learn."
                  className="mt-2 w-full resize-none rounded-[8px] border border-white/10 bg-[#151515] px-3.5 py-3 text-[14px] leading-5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20"
                  {...form.register("about")}
                />
              </div>

              <AuthField
                label="Portfolio website"
                type="url"
                placeholder="https://"
                labelAction={<span className="text-xs text-white/40">Optional</span>}
                inputClassName={inputClass}
                error={form.formState.errors.portfolio_website?.message}
                {...form.register("portfolio_website")}
              />

              <div className="grid grid-cols-2 gap-4">
                <AuthField
                  label="LinkedIn"
                  placeholder="linkedin.com/in/..."
                  labelAction={<span className="text-xs text-white/40">Optional</span>}
                  inputClassName={inputClass}
                  error={form.formState.errors.linkedin?.message}
                  {...form.register("linkedin")}
                />
                <AuthField
                  label="GitHub"
                  placeholder="github.com/..."
                  labelAction={<span className="text-xs text-white/40">Optional</span>}
                  inputClassName={inputClass}
                  error={form.formState.errors.github?.message}
                  {...form.register("github")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AuthField
                  label="Facebook"
                  placeholder="facebook.com/..."
                  labelAction={<span className="text-xs text-white/40">Optional</span>}
                  inputClassName={inputClass}
                  error={form.formState.errors.facebook?.message}
                  {...form.register("facebook")}
                />
                <AuthField
                  label="Discord username"
                  placeholder="e.g. juandev"
                  labelAction={<span className="text-xs text-white/40">Optional</span>}
                  inputClassName={inputClass}
                  error={form.formState.errors.discord?.message}
                  {...form.register("discord")}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-[12px] border border-white/10 bg-[#0d0d0d] p-5">
                <h2 className="text-[15px] font-semibold leading-5 text-white">
                  Non-Disclosure Agreement
                </h2>
                <NdaTerms className="mt-3 max-h-[210px] overflow-y-auto pr-2 text-[12px] leading-5 text-white/55 [&_h2]:text-[15px] [&_h2]:text-white [&_h3]:text-white" />

                <div className="mt-4 border-t border-white/10">
                  <NdaSignature
                    firstName={firstName}
                    lastName={lastName}
                    signed={ndaSigned}
                    onSigned={({ signature, document }) => {
                      setNdaData({ signature, document });
                      setNdaSigned(true);
                      form.setValue("ndaAgreement", true);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[8px] bg-white/[0.025] px-3 py-2.5 text-[13px]">
                <span className="text-white">
                  Signing as {firstName} {lastName}
                </span>
                <span className="text-xs text-white/35">Name from step 2</span>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-white/75">
                <Checkbox
                  checked={form.watch("ndaAgreement")}
                  onCheckedChange={(checked) =>
                    form.setValue("ndaAgreement", Boolean(checked), {
                      shouldValidate: true,
                    })
                  }
                  disabled={!ndaSigned}
                  className="mt-0.5 border-white/25 data-[state=checked]:border-[#9747ff] data-[state=checked]:bg-[#9747ff]"
                />
                <span>
                  I have read and agree to the Non-Disclosure Agreement.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-white/75">
                <Checkbox
                  checked={form.watch("privacyPolicy")}
                  onCheckedChange={(checked) =>
                    form.setValue("privacyPolicy", Boolean(checked), {
                      shouldValidate: true,
                    })
                  }
                  className="mt-0.5 border-white/25 data-[state=checked]:border-[#9747ff] data-[state=checked]:bg-[#9747ff]"
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => onOpen("privacyPolicyModal")}
                    className="text-[#c084fc] underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {showAgreementErrors && form.formState.errors.ndaAgreement ? (
                <p className="text-xs text-[#fca5a5]">
                  {form.formState.errors.ndaAgreement.message}
                </p>
              ) : null}
              {showAgreementErrors && form.formState.errors.privacyPolicy ? (
                <p className="text-xs text-[#fca5a5]">
                  {form.formState.errors.privacyPolicy.message}
                </p>
              ) : null}
              {ndaError ? (
                <AuthAlert>{ndaError}</AuthAlert>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-between gap-4">
            <span className="text-[13px] text-white/35">
              Step {step} of 4
            </span>
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className={actionButtonClass}
                  onClick={() => setStep((current) => Math.max(current - 1, 1))}
                >
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Back
                </Button>
              ) : null}

              {step < 4 ? (
                <Button
                  type="button"
                  className={actionButtonClass}
                  onClick={() => void nextStep()}
                >
                  Continue
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={actionButtonClass}
                  onClick={() => setShowAgreementErrors(true)}
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {step === 1 ? (
          <p className="mt-6 text-center text-[14px] text-white/60">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-white transition-colors hover:text-[#c084fc]"
            >
              Sign in
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
}