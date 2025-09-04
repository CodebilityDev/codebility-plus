"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { CheckCircle, AlertCircle, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Checkbox } from "@codevs/ui/checkbox";
import { Textarea } from "@codevs/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

import { signupUser } from "@/app/auth/actions";
import { getNdaDataFromStorage, hasCompleteNdaData, cleanupNdaStorage } from "@/utils/nda-helpers";

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

  // Initialize NDA status
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

  const handleSignNda = () => {
    const ndaUrl = "/nda-signing/public";
    const popup = window.open(ndaUrl, "nda-signing", "width=800,height=600,scrollbars=yes,resizable=yes");
    
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);

      if (!ndaSigned) {
        toast.error("Please sign the NDA before submitting your application");
        return;
      }

      const formData = new FormData();
      
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email_address", data.email_address);
      formData.append("phone_number", data.phone_number);
      formData.append("password", data.password);
      formData.append("about", data.about || "");
      formData.append("portfolio_website", data.portfolio_website || "");
      formData.append("years_of_experience", data.years_of_experience.toString());
      formData.append("facebook", data.facebook || "");
      formData.append("linkedin", data.linkedin || "");
      formData.append("github", data.github || "");
      formData.append("discord", data.discord || "");
      formData.append("positions", JSON.stringify(selectedPositions));
      formData.append("tech_stacks", JSON.stringify(selectedTechStacks));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

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
        
        // Show redirect message
        toast.success("Redirecting to sign-in page...", {
          duration: 2000,
        });
        
        // Redirect after 2 seconds
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }
      
      setProfileImage(file);
    }
  };

  return (
    <div className="w-full px-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Upload Picture */}
        <div className="mx-auto flex w-fit flex-col items-center">
          <div className="bg-light-800 dark:bg-dark-200 flex h-20 w-20 items-center justify-center rounded-full">
            <svg className="h-8 w-8 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <label htmlFor="profileImage" className="mt-2 cursor-pointer text-sm text-light-500">
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
            <p className="mt-1 text-xs text-green-400">{profileImage.name}</p>
          )}
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-light-500">First Name</Label>
              <Input
                {...form.register("first_name")}
                placeholder="Enter your first name"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.first_name && (
                <p className="text-sm text-red-400">{form.formState.errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Last Name</Label>
              <Input
                {...form.register("last_name")}
                placeholder="Enter your last name"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.last_name && (
                <p className="text-sm text-red-400">{form.formState.errors.last_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Positions</Label>
              <Select onValueChange={(value) => {
                const position = POSITIONS.find(p => p.id === parseInt(value));
                if (position) {
                  setSelectedPositions([position]);
                  form.setValue("positions", [position]);
                }
              }}>
                <SelectTrigger className="bg-light-800 border-light-700 text-light-400">
                  <SelectValue placeholder="Select applicable positions" />
                  <ChevronDown className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((position) => (
                    <SelectItem key={position.id} value={position.id.toString()}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.positions && (
                <p className="text-sm text-red-400">{form.formState.errors.positions.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Years of Experience</Label>
              <Input
                type="number"
                min="0"
                {...form.register("years_of_experience", { valueAsNumber: true })}
                placeholder="0"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.years_of_experience && (
                <p className="text-sm text-red-400">{form.formState.errors.years_of_experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Tech Stack</Label>
              <Select onValueChange={(value) => {
                setSelectedTechStacks([value]);
                form.setValue("tech_stacks", [value]);
              }}>
                <SelectTrigger className="bg-light-800 border-light-700 text-light-400">
                  <SelectValue placeholder="Select your tech stack" />
                  <ChevronDown className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  {TECH_STACKS.map((tech) => (
                    <SelectItem key={tech} value={tech}>
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
              <Label className="text-light-500">About (Optional)</Label>
              <Textarea
                {...form.register("about")}
                placeholder="Tell us about yourself"
                rows={3}
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-light-500">Email</Label>
              <Input
                type="email"
                {...form.register("email_address")}
                placeholder="Enter your email"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.email_address && (
                <p className="text-sm text-red-400">{form.formState.errors.email_address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Phone Number</Label>
              <Input
                type="tel"
                {...form.register("phone_number")}
                placeholder="+63 or 0 followed by your number"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.phone_number && (
                <p className="text-sm text-red-400">{form.formState.errors.phone_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400 hover:text-light-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400 hover:text-light-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-400">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Portfolio Website (Optional)</Label>
              <Input
                type="url"
                {...form.register("portfolio_website")}
                placeholder="Enter your portfolio URL"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
              {form.formState.errors.portfolio_website && (
                <p className="text-sm text-red-400">{form.formState.errors.portfolio_website.message}</p>
              )}
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-light-500">Facebook</Label>
              <Input
                {...form.register("facebook")}
                placeholder="Enter your Facebook profile"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">LinkedIn (Optional)</Label>
              <Input
                {...form.register("linkedin")}
                placeholder="Enter your LinkedIn profile"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">GitHub (Optional)</Label>
              <Input
                {...form.register("github")}
                placeholder="Enter your GitHub profile"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-light-500">Discord (Optional)</Label>
              <Input
                {...form.register("discord")}
                placeholder="username#1234"
                className="bg-light-800 border-light-700 text-light-500 placeholder:text-light-400"
              />
            </div>
          </div>
        </div>

        {/* NDA Section */}
        {ndaSigned ? (
          <div className="bg-green-900/20 border border-green-600/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Signed</span>
            </div>
            <p className="text-sm text-green-400">
              ✓ NDA has been signed and will be included with your application.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-light-500 font-medium">
                Non-Disclosure Agreement (NDA) *
              </Label>
              <div className="flex items-center gap-2 text-orange-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Required</span>
              </div>
            </div>
            <p className="text-sm text-light-400">
              Please sign the NDA before completing your registration.
            </p>
            <Button
              type="button"
              onClick={handleSignNda}
              variant="outline"
              className="text-customBlue-100 border-customBlue-100 hover:bg-customBlue-100/10"
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
              className="mt-1"
            />
            <Label htmlFor="privacyPolicy" className="text-white text-sm leading-relaxed">
              I agree to the <span className="text-customBlue-100 underline cursor-pointer">Privacy Policy</span> *
            </Label>
          </div>
          {form.formState.errors.privacyPolicy && (
            <p className="text-sm text-red-400">{form.formState.errors.privacyPolicy.message}</p>
          )}

          <div className="flex items-start space-x-3">
            <Checkbox
              id="ndaAgreement"
              checked={form.watch("ndaAgreement")}
              onCheckedChange={(checked) => form.setValue("ndaAgreement", !!checked)}
              className="mt-1"
            />
            <Label htmlFor="ndaAgreement" className="text-white text-sm leading-relaxed">
              I agree to the <span className="text-customBlue-100 underline cursor-pointer">Non-Disclosure Agreement</span> *
            </Label>
          </div>
          {form.formState.errors.ndaAgreement && (
            <p className="text-sm text-red-400">{form.formState.errors.ndaAgreement.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            className="px-8 text-light-500 border-light-700 hover:bg-light-800"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 bg-customBlue-100 hover:bg-customBlue-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Apply"}
          </Button>
        </div>
      </form>
    </div>
  );
}