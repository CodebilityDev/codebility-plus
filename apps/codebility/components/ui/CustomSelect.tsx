import { ChangeEvent, useMemo, useRef, useState } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@codevs/ui/label";

interface Option {
  id: string;
  value: string;
  label: string;
  subLabel?: string;
  imageUrl?: string | null;
}

interface CustomSelectProps {
  label?: string; // ← made optional: omit to suppress the heading entirely
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "simple";
  searchable?: boolean;
}

export const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  variant = "default",
  searchable = false,
}: CustomSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(lowerSearch);
      const subLabelMatch =
        opt.subLabel?.toLowerCase().includes(lowerSearch) ?? false;
      return labelMatch || subLabelMatch;
    });
  }, [options, searchable, searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-2">
      {/* Render label only when provided — prevents duplicate headings when
          the parent component already renders its own label above this select. */}
      {label && (
        <Label className="dark:text-light-900 text-black">{label}</Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 w-full text-black">
          <SelectValue placeholder={disabled ? "Loading..." : placeholder} />
        </SelectTrigger>

        <SelectContent side="bottom" position="popper" sideOffset={4} className="bg-light-800 dark:bg-dark-200">
          {searchable && (
            <div className="p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onPointerDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                autoFocus={false}
                className="dark:bg-dark-100 w-full rounded-md bg-white p-2 text-sm dark:text-white"
              />
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No options found</div>
          ) : (
            <SelectGroup>
              {filteredOptions.map((option) => (
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