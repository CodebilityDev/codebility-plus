import { useState } from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { statusColors } from "../_lib/utils";

const statusArray = ["Available", "Deployed", "Training", "Vacation", "Busy", "Client Ready", "Blocked", "Graduated"];
const positionArray = [
  "Front End Developer",
  "Back End Developer",
  "Mobile Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Admin",
  "Project Manager",
  "CEO",
];
const ndaArray = ["Received", "Sent", "-"];

const optionsMap: Record<string, (string | undefined)[]> = {
  internal_status: statusArray,
  main_positon: positionArray,
  nda_status: ndaArray,
};

interface Props {
  type: "internal_status" | "main_positon" | "nda_status"
  placeholder?: string
  handleChange: (value: string) => void
  className?: string
}

export default function Select({ type, placeholder, handleChange, className }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(placeholder);

  const options = optionsMap[type] || [];

  const handleSelect = (option: string) => {
    if (type === "internal_status") option = option.toUpperCase();
    setSelectedOption(option);
    handleChange(option);
  };

  return (
    <div className={`w-full ${className}`}>
      <UISelect value={selectedOption} onValueChange={handleSelect}>
        <SelectTrigger className={`${type === "internal_status" && selectedOption ? statusColors[selectedOption] : ''}`}>
          <SelectValue>
            {selectedOption || placeholder || "Select..."}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const conditionalClass = type === "internal_status" && option ? statusColors[option] : "";

            return (
              <SelectItem key={index} value={option === undefined ? "-" : option} className={conditionalClass}>
                {option === undefined ? "-" : option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </UISelect>
    </div>
  );
}
