import { useState } from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { statusColors } from "@/app/home/in-house/_lib/utils";
import { ISelectProps } from "@/types/protectedroutes";

const statusArray = ["Available", "Deployed", "Training", "Vacation", "Busy", "Client Ready", "Blocked", "Graduated"];
const positionArray = [
  "Front-End Developer",
  "Back-End Developer",
  "Mobile Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Admin",
  "Project Manager",
  "CEO",
];
const ndaArray = ["Received", "Sent", "-"];

const optionsMap: Record<string, (string | undefined)[]> = {
  status_internal: statusArray,
  main_positon: positionArray,
  nda_status: ndaArray,
};

export default function Select({ type, placeholder, handleChange, className }: ISelectProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(placeholder);

  const options = optionsMap[type] || [];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    handleChange(option);
  };

  return (
    <div className={`w-full ${className}`}>
      <UISelect value={selectedOption} onValueChange={handleSelect}>
        <SelectTrigger className={`${type === "status_internal" && selectedOption ? statusColors[selectedOption] : ''}`}>
          <SelectValue>
            {selectedOption || placeholder || "Select..."}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const conditionalClass = type === "status_internal" && option ? statusColors[option] : "";

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
