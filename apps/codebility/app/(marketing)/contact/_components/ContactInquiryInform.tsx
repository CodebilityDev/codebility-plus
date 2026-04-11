"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/forms/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { IconDropdown } from "@/public/assets/svgs";
import { ContactFormData } from "../page";

const industries = [
  "Technology", "Healthcare", "Finance",
  "Retail", "Education", "Manufacturing", "Other",
];

interface InquiryFormProps {
  defaultValues: ContactFormData;
  onNext: (data: Pick<ContactFormData, "firstName" | "lastName" | "email" | "companyName" | "phoneNumber" | "industry">) => void;
}

export default function InquiryForm({ defaultValues, onNext }: InquiryFormProps) {
  const [form, setForm] = useState({
    firstName: defaultValues.firstName,
    lastName: defaultValues.lastName,
    email: defaultValues.email,
    companyName: defaultValues.companyName,
    phoneNumber: defaultValues.phoneNumber,
    industry: defaultValues.industry,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required.";
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onNext(form);
  };

  return (
    <div className="relative flex w-full flex-col gap-8 text-pretty rounded-lg border border-white/5 bg-white/5 px-10 py-10 text-white">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">Inquiry Form</p>
        <p className="text-sm text-white/40">Kindly provide your details with us</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
              placeholder="Juan" />
            {errors.firstName && <p className="text-xs text-red-400">{errors.firstName}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
              placeholder="dela Cruz" />
            {errors.lastName && <p className="text-xs text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Company Email</Label>
          <Input id="email" type="email" value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
            placeholder="juan@company.com" />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
            placeholder="Acme Corp" />
          {errors.companyName && <p className="text-xs text-red-400">{errors.companyName}</p>}
        </div>

        {/* Phone + Industry */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" value={form.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
              placeholder="+63 912 345 6789" />
            {errors.phoneNumber && <p className="text-xs text-red-400">{errors.phoneNumber}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={form.industry} onValueChange={(val) => handleChange("industry", val)}>
              <SelectTrigger aria-label="Industry"
                className="border-black-800 bg-black-800 flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm text-white/30">
                <SelectValue placeholder="Select industry">
                  {form.industry || "Select industry"}
                </SelectValue>
                <IconDropdown className="h-5 invert dark:invert-0" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}
                className="border-light_dark dark:bg-black-100 z-10 w-[var(--radix-select-trigger-width)] rounded-md border bg-[#FFF]">
                <SelectGroup>
                  {industries.map((ind, i) => (
                    <SelectItem key={i}
                      className="cursor-default px-3 py-2 text-sm hover:bg-customBlue-100"
                      value={ind}>{ind}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button variant="purple" rounded="md" onClick={handleNext}>
        Continue →
      </Button>
    </div>
  );
}