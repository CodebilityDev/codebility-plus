"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { ChevronDown, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Checkbox } from "@codevs/ui/checkbox";
import { Textarea } from "@codevs/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";

import { signupUser } from "@/app/auth/actions";
import { getNdaDataFromStorage, hasCompleteNdaData, cleanupNdaStorage } from "@/utils/nda-helpers";

// Constants - Extract configuration data
const POSITIONS = [
  { id: 1, name: "Frontend Developer" },
  { id: 2, name: "Backend Developer" },
  { id: 3, name: "Full Stack Developer" },
  { id: 4, name: "UI/UX Designer" },
  { id: 5, name: "QA Engineer" },
];

const TECH_STACKS = [
  "javascript", "typescript", "react", "nextjs", "nodejs", 
  "python", "php", "java", "angular", "vue", "laravel", "django"
];

// Validation schema with improved validation messages
const SignupFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_address: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  about: z.string().optional(),
  portfolio_website: z.string().url().optional().or(z.literal("")),
  positions: z.array(z.object({ id: z.number(), name: z.string() })).min(1, "Please select at least one position"),
  tech_stacks: z.array(z.string()).min(1, "Please select at least one tech stack"),
  years_of_experience: z.number().min(0, "Experience must be 0 or more years"),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  discord: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, "You must agree to the Privacy Policy"),
  ndaAgreement: z.boolean().refine(val => val === true, "You must agree to the Non-Disclosure Agreement"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof SignupFormSchema>;

// Simple input field component following DRY principle
interface FormFieldProps {
  label: string;
  name: keyof SignupFormData;
  type?: string;
  placeholder: string;
  register: any;
  errors: any;
  required?: boolean;
  className?: string;
}

const FormField = ({ label, name, type = "text", placeholder, register, errors, required, className }: FormFieldProps) => (
  <div className="space-y-2">
    <Label className="text-white text-base font-medium">
      {label} {required && ""}
    </Label>
    <Input
      type={type}
      {...register(name)}
      placeholder={placeholder}
      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className || ""}`}
    />
    {errors[name] && (
      <p className="text-sm text-red-400">{errors[name].message}</p>
    )}
  </div>
);

// Password field with show/hide functionality
const PasswordField = ({ label, name, placeholder, register, errors, showPassword, toggleShow }: any) => (
  <div className="space-y-2">
    <Label className="text-white text-base font-medium">{label}</Label>
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...register(name)}
        placeholder={placeholder}
        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {errors[name] && (
      <p className="text-sm text-red-400">{errors[name].message}</p>
    )}
  </div>
);

export default function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [ndaSigned, setNdaSigned] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<typeof POSITIONS>([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
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

  // Initialize NDA status and message listener - consolidated effect
  useEffect(() => {
    const initialNdaStatus = hasCompleteNdaData();
    setNdaSigned(initialNdaStatus);
    
    if (initialNdaStatus) {
      form.setValue("ndaAgreement", true);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "NDA_SIGNED" && event.data?.signed === true) {
        setNdaSigned(true);
        form.setValue("ndaAgreement", true);
        toast.success("NDA signed successfully! You can now complete your registration.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [form]);

  // Simplified NDA signing handler
  const handleSignNda = () => {
    const popup = window.open("/nda-signing/public", "nda-signing", "width=800,height=600,scrollbars=yes,resizable=yes");
    
    if (!popup) {
      toast.error("Please allow pop-ups to sign the NDA");
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setTimeout(() => {
          const newNdaStatus = hasCompleteNdaData();
          setNdaSigned(newNdaStatus);
          if (newNdaStatus) {
            form.setValue("ndaAgreement", true);
          }
        }, 500);
      }
    }, 1000);
  };

  // Consolidated form submission logic
  const onSubmit = async (data: SignupFormData) => {
    if (!ndaSigned) {
      toast.error("Please sign the NDA before submitting your application");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Basic info
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "string" || typeof value === "number") {
          formData.append(key, value.toString());
        }
      });

      // Complex fields
      formData.append("positions", JSON.stringify(selectedPositions));
      formData.append("tech_stacks", JSON.stringify(selectedTechStacks));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // NDA data
      const ndaData = getNdaDataFromStorage();
      if (hasCompleteNdaData()) {
        formData.append("ndaSigned", "true");
        formData.append("ndaSignature", ndaData.signature!);
        formData.append("ndaDocument", ndaData.document!);
        formData.append("ndaSignedAt", ndaData.signedAt!);
      }

      const result = await signupUser(formData);

      if (result.success) {
        if (result.ndaProcessed) {
          cleanupNdaStorage();
        }
        toast.success("Account created successfully! Please check your email to verify your account.");
        toast.success("Redirecting to sign-in page...", { duration: 2000 });
        
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image upload handler with validation
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errors: string[] = [];
    if (file.size > 5 * 1024 * 1024) errors.push("Image size must be less than 5MB");
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      errors.push("Please select a valid image file (JPEG, PNG, or WebP)");
    }

    if (errors.length > 0) {
      toast.error(errors.join(". "));
      return;
    }

    setProfileImage(file);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/assets/svgs/logos/codebility-light.svg"
            alt="Codebility"
            width={300}
            height={80}
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold text-white mb-4">Create new account</h1>
          <p className="text-gray-400 text-lg mb-2">To use Codebility, please enter your details</p>
          <p className="text-gray-500 text-sm">All fields not labeled optional are required.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-gray-700 flex h-24 w-24 items-center justify-center rounded-full mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <label htmlFor="profileImage" className="text-white text-base font-medium cursor-pointer">
              Upload picture
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            {profileImage && (
              <p className="mt-2 text-sm text-green-400">{profileImage.name}</p>
            )}
          </div>

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1 - Personal Info */}
            <div className="space-y-6">
              <FormField
                label="First Name"
                name="first_name"
                placeholder="Enter your first name"
                register={form.register}
                errors={form.formState.errors}
                required
              />

              <FormField
                label="Last Name"
                name="last_name"
                placeholder="Enter your last name"
                register={form.register}
                errors={form.formState.errors}
                required
              />

              <div className="space-y-2">
                <Label className="text-white text-base font-medium">Positions</Label>
                <Select onValueChange={(value) => {
                  const position = POSITIONS.find(p => p.id === parseInt(value));
                  if (position) {
                    setSelectedPositions([position]);
                    form.setValue("positions", [position]);
                  }
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-400 h-12 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="Select applicable positions" />
                    <ChevronDown className="h-5 w-5" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {POSITIONS.map((position) => (
                      <SelectItem key={position.id} value={position.id.toString()} className="text-white hover:bg-gray-600">
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.positions && (
                  <p className="text-sm text-red-400">{form.formState.errors.positions.message}</p>
                )}
              </div>

              <FormField
                label="Years of Experience"
                name="years_of_experience"
                type="number"
                placeholder="0"
                register={form.register}
                errors={form.formState.errors}
                required
              />

              <div className="space-y-2">
                <Label className="text-white text-base font-medium">Tech Stack</Label>
                <Select onValueChange={(value) => {
                  setSelectedTechStacks([value]);
                  form.setValue("tech_stacks", [value]);
                }}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-400 h-12 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="Select your tech stack" />
                    <ChevronDown className="h-5 w-5" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {TECH_STACKS.map((tech) => (
                      <SelectItem key={tech} value={tech} className="text-white hover:bg-gray-600">
                        {tech.charAt(0).toUpperCase() + tech.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.tech_stacks && (
                  <p className="text-sm text-red-400">{form.formState.errors.tech_stacks.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white text-base font-medium">About (Optional)</Label>
                <Textarea
                  {...form.register("about")}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Column 2 - Contact & Auth */}
            <div className="space-y-6">
              <FormField
                label="Email"
                name="email_address"
                type="email"
                placeholder="Enter your email"
                register={form.register}
                errors={form.formState.errors}
                required
              />

              <FormField
                label="Phone Number"
                name="phone_number"
                type="tel"
                placeholder="+63 or 0 followed by your number"
                register={form.register}
                errors={form.formState.errors}
                required
              />

              <PasswordField
                label="Password"
                name="password"
                placeholder="Enter your password"
                register={form.register}
                errors={form.formState.errors}
                showPassword={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
              />

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                register={form.register}
                errors={form.formState.errors}
                showPassword={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <FormField
                label="Portfolio Website (Optional)"
                name="portfolio_website"
                type="url"
                placeholder="Enter your portfolio URL"
                register={form.register}
                errors={form.formState.errors}
              />
            </div>

            {/* Column 3 - Social Links */}
            <div className="space-y-6">
              <FormField
                label="Facebook"
                name="facebook"
                placeholder="Enter your Facebook profile"
                register={form.register}
                errors={form.formState.errors}
              />

              <FormField
                label="LinkedIn (Optional)"
                name="linkedin"
                placeholder="Enter your LinkedIn profile"
                register={form.register}
                errors={form.formState.errors}
              />

              <FormField
                label="GitHub (Optional)"
                name="github"
                placeholder="Enter your GitHub profile"
                register={form.register}
                errors={form.formState.errors}
              />

              <FormField
                label="Discord (Optional)"
                name="discord"
                placeholder="username#1234"
                register={form.register}
                errors={form.formState.errors}
              />
            </div>
          </div>

          {/* NDA Section */}
          {ndaSigned ? (
            <div className="bg-green-900/20 border border-green-600/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">NDA Signed</span>
              </div>
              <p className="text-sm text-green-400">
                ✓ NDA has been signed and will be included with your application.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white text-base font-medium">
                  Non-Disclosure Agreement (NDA)
                </Label>
                <div className="flex items-center gap-2 text-orange-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Required</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Please sign the NDA before completing your registration.
              </p>
              <Button
                type="button"
                onClick={handleSignNda}
                variant="outline"
                className="text-blue-400 border-blue-400 hover:bg-blue-400/10 bg-transparent"
              >
                Sign NDA
              </Button>
            </div>
          )}

          {/* Agreements */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacyPolicy"
                checked={form.watch("privacyPolicy")}
                onCheckedChange={(checked) => form.setValue("privacyPolicy", !!checked)}
                className="mt-1 border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="privacyPolicy" className="text-white text-sm leading-relaxed">
                I agree to the <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span>
              </Label>
            </div>
            {form.formState.errors.privacyPolicy && (
              <p className="text-sm text-red-400 ml-6">{form.formState.errors.privacyPolicy.message}</p>
            )}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="ndaAgreement"
                checked={form.watch("ndaAgreement")}
                onCheckedChange={(checked) => form.setValue("ndaAgreement", !!checked)}
                className="mt-1 border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label htmlFor="ndaAgreement" className="text-white text-sm leading-relaxed">
                I agree to the <span className="text-blue-400 underline cursor-pointer">Non-Disclosure Agreement</span> 
                <span className="text-yellow-400 ml-2">(Please sign the NDA first)</span>
              </Label>
            </div>
            {form.formState.errors.ndaAgreement && (
              <p className="text-sm text-red-400 ml-6">{form.formState.errors.ndaAgreement.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="px-8 py-3 text-gray-300 border-gray-600 hover:bg-gray-800 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Apply"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}