"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { SignUpValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Checkbox } from "@codevs/ui/checkbox";

import { signupUser } from "../../actions";
import { FORM_STEPS } from "./form-steps";
import { ImageUpload } from "./ImageUpload";
import SignUpInputs from "./sign-up-input";

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      phone_number: "",
      years_of_experience: "",
      portfolio_website: "",
      techstack: "",
      position: "",
      facebook_link: "",
      github: "",
      linkedin: "",
      discord: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Create FormData instance
      const formData = new FormData();

      // Add all form fields except profileImage
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage" && value !== null && value !== undefined) {
          if (typeof value === "number") {
            formData.append(key, value.toString());
          } else if (Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Handle profile image separately
      if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await signupUser(formData);

      if (response.success) {
        console.log("goes here");
        toast.success("Account created! Please verify your email.");
        router.push("/auth/verify"); // Redirect to verify page
        reset(); // Reset form
      } else {
        // Handle specific error cases
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      {/* Profile Image Upload */}
      <div className="absolute left-4 top-0">
        <ImageUpload
          onChange={(file) => setValue("profileImage", file)}
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

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      "Register"
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
                    className="w-full md:w-auto"
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
  );
};

export default SignUpForm;
