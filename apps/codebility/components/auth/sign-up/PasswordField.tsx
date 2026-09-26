"use client";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { EyeOff, Eye } from "lucide-react";

// Password field component
export const PasswordField = ({ label, name, placeholder, register, errors, showPassword, toggleShow }: any) => (
  <div className="space-y-1">
    <Label className="text-white text-base font-medium">{label} <span className="text-red-400">*</span></Label>
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...register(name)}
        placeholder={placeholder}
        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 h-12 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 backdrop-blur-sm pr-12"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
    {errors[name] && (
      <p className="text-sm text-red-400">{errors[name].message}</p>
    )}
  </div>
);
