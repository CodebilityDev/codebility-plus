import { useEffect, useRef, useState } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";

import { Checkbox } from "@codevs/ui/checkbox";
import { Label } from "@codevs/ui/label";

interface Option {
  id: string;
  value: string;
  label: string;
  subLabel?: string;
  imageUrl?: string;
}

interface CheckboxDropdownProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isMulti?: boolean;
}

export const CustomCheckboxDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select option",
  disabled = false,
  isMulti = false,
}: CheckboxDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (!isMulti) {
      onChange([value]);
      setIsOpen(false);
      return;
    }

    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const displayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    if (!isMulti) {
      const selected = options.find((opt) => opt.value === selectedValues[0]);
      return selected?.label || placeholder;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="dark:text-light-900 text-black">{label}</Label>
      <div className="relative">
        <div
          className={`bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 
            dark:text-light-900 flex w-full cursor-pointer items-center justify-between rounded 
            p-2 text-black ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className="text-sm">{displayValue()}</span>
          <span className="transform transition-transform duration-200">
            {isOpen ? "▼" : "▲"}
          </span>
        </div>

        {isOpen && !disabled && (
          <div
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 absolute z-50 
            mt-1 max-h-60 w-full overflow-auto rounded border shadow-lg"
          >
            {options.map((option) => (
              <div
                key={option.id}
                className="hover:bg-light-900 dark:hover:bg-dark-300 flex cursor-pointer items-center p-2"
                onClick={() => handleToggle(option.value)}
              >
                <div className="flex flex-1 items-center">
                  {option.imageUrl ? (
                    <img
                      src={option.imageUrl}
                      alt={`${option.label}'s avatar`}
                      className="mr-2 h-6 w-6 rounded-full"
                    />
                  ) : (
                    <DefaultAvatar size={24} className="mr-2" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm">{option.label}</span>
                    {option.subLabel && (
                      <span className="text-xs text-gray-500">
                        {option.subLabel}
                      </span>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  className="ml-2"
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => handleToggle(option.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
