"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@codevs/ui";
import { Input } from "@codevs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Textarea } from "@codevs/ui/textarea";

interface FormFieldProps {
  id: string;
  label: string;
  type: "text" | "email" | "password" | "file" | "select" | "textarea";
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  register?: any;
  options?: string[];
  className?: string;
  onChange?: (value: any) => void;
  value?: any;
}

export const FormField = ({
  id,
  label,
  type,
  placeholder,
  error,
  required = true,
  disabled,
  register,
  options,
  className,
  onChange,
  value,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
              className={cn(
                "w-full bg-background",
                error && "border-destructive",
                className,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "resize-none bg-background",
              error && "border-destructive",
              className,
            )}
            {...register?.(id)}
          />
        );

      case "password":
        return (
          <div className="relative">
            <Input
              id={id}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "bg-background pr-10",
                error && "border-destructive",
                className,
              )}
              {...register?.(id)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        );

      default:
        return (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "bg-background",
              error && "border-destructive",
              className,
            )}
            {...register?.(id)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={cn("text-sm font-medium", error && "text-destructive")}
        >
          {label}
          {!required && (
            <span className="text-muted-foreground"> (Optional)</span>
          )}
        </label>
      </div>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
