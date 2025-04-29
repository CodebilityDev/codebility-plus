"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TechStackModal from "@/Components/modals/TechStackModal";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { SignUpValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Checkbox } from "@codevs/ui/checkbox";

import { signupUser } from "../../actions";
import { FORM_STEPS } from "./form-steps";
import { ImageUpload } from "./ImageUpload";
import SignUpInputs from "./SignUpInput";

// Define the form type explicitly
interface SignUpFormInputs extends z.infer<typeof SignUpValidation> {
  profileImage: File | null;
}

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ndaSigned, setNdaSigned] = useState(false);
  const { onOpen } = useModal();

  const form = useForm<SignUpFormInputs>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      phone_number: "",
      years_of_experience: 0,
      portfolio_website: "",
      tech_stacks: [],
      positions: [],
      facebook: "",
      github: "",
      linkedin: "",
      discord: "",
      password: "",
      confirmPassword: "",
      profileImage: null, // Allow null for profile image
      about: "",
      application_status: "applying",
      internal_status: "TRAINING",
      availability_status: true,
      role_id: 7,
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: SignUpFormInputs) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add all form fields except profileImage
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage" && value !== null && value !== undefined) {
          if (typeof value === "number") {
            formData.append(key, value.toString());
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Handle profile image separately
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      // Get NDA signature from localStorage if available
      const ndaSignature = localStorage.getItem("ndaSignature");
      const ndaSigned = localStorage.getItem("ndaSigned");
      const ndaSignedAt = localStorage.getItem("ndaSignedAt");

      if (ndaSignature && ndaSigned) {
        formData.append("ndaSignature", ndaSignature);
        formData.append("ndaSigned", ndaSigned);
        if (ndaSignedAt) {
          formData.append("ndaSignedAt", ndaSignedAt);
        }
      }

      const response = await signupUser(formData);

      if (response.success) {
        // Clear NDA signature data from localStorage
        localStorage.removeItem("ndaSignature");
        localStorage.removeItem("ndaSigned");
        localStorage.removeItem("ndaSignedAt");
        localStorage.removeItem("ndaUserFirstName");
        localStorage.removeItem("ndaUserLastName");
        localStorage.removeItem("ndaDocument");
        toast.success("Account created! Please verify your email.");
        router.push("/auth/verify");
        reset();
      } else {
        if (response.error?.includes("email")) {
          toast.error("This email is already registered");
        } else if (response.error?.includes("image")) {
          toast.error("Invalid image format or size");
        } else {
          toast.error(response.error || "Failed to create account");
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if NDA is already signed in localStorage
    const ndaSignedFlag = localStorage.getItem("ndaSigned") === "true";
    setNdaSigned(ndaSignedFlag);
    if (ndaSignedFlag) {
      setValue("nda_signed", true);
    }

    // Listen for NDA signed message
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      if (event.data?.type === "NDA_SIGNED" && event.data?.signed) {
        setNdaSigned(true);
        setValue("nda_signed", true);
        localStorage.setItem("ndaSigned", "true");
      }
    };

    window.addEventListener("message", handleMessage); // <-- Add this line

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setValue]);

  return (
    <FormProvider {...form}>
      <TechStackModal />
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        {/* Profile Image Upload */}
        <div className="absolute left-4 top-0">
          <ImageUpload
            onChange={(file) => setValue("profileImage", file)} // Accepts File or null
            error={errors.profileImage?.message as string}
          />
        </div>

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-4 p-4 pt-32 md:flex-row md:gap-10">
          {FORM_STEPS.map((step, stepIndex) => (
            <div
              className="flex flex-col gap-4 md:flex-1"
              key={`step_${stepIndex}`}
            >
              {step.map((field, fieldIndex) => (
                <SignUpInputs
                  key={`field_${stepIndex}_${fieldIndex}`}
                  label={field.label}
                  id={field.id}
                  type={field.type}
                  register={register}
                  errors={errors}
                  required={!field.optional}
                  placeholder={field.placeholder}
                  setValue={setValue}
                  getValues={getValues}
                  trigger={trigger}
                />
              ))}

              {/* Privacy Policy and Buttons for last step */}
              {stepIndex === FORM_STEPS.length - 1 && (
                <div className="space-y-6">
                  <label className="flex items-center gap-4 text-sm text-white">
                    <Checkbox required className="border-white" />
                    <p>
                      I agree to the{" "}
                      <span
                        onClick={() => onOpen("privacyPolicyModal")}
                        className="cursor-pointer text-blue-100 hover:underline"
                      >
                        Privacy Policy
                      </span>
                    </p>
                  </label>
                  <label className="flex items-center gap-4 text-sm text-white">
                    <Checkbox
                      required
                      className="border-white"
                      id="ndaCheckbox"
                      checked={ndaSigned}
                      disabled={!ndaSigned}
                      {...register("nda_signed")}
                      onChange={() => {}} // Prevent manual checking
                    />
                    <p>
                      I agree to the{" "}
                      <span
                        onClick={() =>
                          window.open(
                            "/nda-signing/public",
                            "_blank",
                            "width=800,height=600",
                          )
                        }
                        className="cursor-pointer text-blue-100 hover:underline"
                        style={{ textDecoration: "underline" }}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            window.open(
                              "/nda-signing/public",
                              "_blank",
                              "width=800,height=600",
                            );
                        }}
                      >
                        Non-Disclosure Agreement
                      </span>
                      {!ndaSigned && (
                        <span className="ml-2 text-xs text-yellow-300">
                          (Please sign the NDA first)
                        </span>
                      )}
                    </p>
                  </label>

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                    <Button
                      type="submit"
                      variant="purple"
                      disabled={isLoading || !ndaSigned}
                      className="w-full md:w-auto"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating account...
                        </span>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      disabled={isLoading}
                      onClick={() => {
                        reset();
                        router.push("/");
                      }}
                      className="w-full text-white md:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
