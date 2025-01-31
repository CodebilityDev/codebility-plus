import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { Label } from "@codevs/ui/label";

interface Option {
  id: string;
  value: string;
  label: string;
  subLabel?: string;
  imageUrl?: string | null;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "simple";
}

export const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  variant = "default", // Default to showing avatars
}: CustomSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="dark:text-light-900 text-black">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 w-full text-black">
          <SelectValue placeholder={disabled ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-light-800 dark:bg-dark-200">
          {options.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No options available
            </div>
          ) : (
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.id}
                  value={option.value}
                  className="hover:bg-light-900 dark:hover:bg-dark-300 cursor-default py-2"
                >
                  {variant === "default" ? (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 flex-shrink-0">
                        {option.imageUrl ? (
                          <img
                            src={option.imageUrl}
                            alt={option.label}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={32} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        {option.subLabel && (
                          <span className="text-xs text-gray-500">
                            {option.subLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Simple variant without avatar
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.subLabel && (
                        <span className="text-xs text-gray-500">
                          {option.subLabel}
                        </span>
                      )}
                    </div>
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
