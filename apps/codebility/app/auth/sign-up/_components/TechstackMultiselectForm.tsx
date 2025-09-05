"use client";

import { useEffect } from "react";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { ChevronDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@codevs/ui/button";

interface TechStackType {
  id: number;
  name: string;
  alias?: string;
  icon: any;
}

interface TechStackSelectType {
  id: string;
  error?: string;
}

export function TechStackMultiselectField({ id, error }: TechStackSelectType) {
  const { setValue } = useFormContext();
  const { onOpen } = useModal();
  const { stack } = useTechStackStore();
  // const [techStackOptions, setTechStackOptions] = useState<TechStackType[]>(
  //   () =>
  //     techstacks.map((item, index) => ({
  //       ...item,
  //       id: index,
  //     })),
  // );
  // const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);

  useEffect(() => {
    if (!stack) return;
    setValue(id, stack, {
      shouldValidate: false,
    });
  }, [stack]);

  return (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      className={`md:text-md bg-dark-200 text-grey-100 flex justify-between border-b-2 p-2 text-sm font-normal focus:outline-none lg:text-lg ${
        error ? "border-red-400" : "border-darkgray"
      }`}
      onClick={() => onOpen("techStackModal")}
    >
      {stack.includes("none")
        ? "Non-tech role"
        : stack.length > 0
          ? `${stack.length} tech stack${stack.length > 1 ? "s" : ""} selected`
          : "Select your tech stack"}
      <ChevronDown />
    </Button>
  );
}

/*
return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`md:text-md bg-dark-200 text-grey-100 flex justify-between border-b-2 p-2 text-sm font-normal focus:outline-none lg:text-lg ${
            error ? "border-red-400" : "border-darkgray"
          }`}
        >
          Select your tech stack
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-dark-200 border-darkgray flex max-h-[300px] flex-col overflow-y-auto p-0 text-white">
        {techStackOptions.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-6 px-3 py-2 hover:bg-zinc-500"
          >
            <Checkbox
              className="border-white"
              value={item.id}
              checked={selectedTechStack.includes(item.name)}
              onCheckedChange={(checked) => {
                setSelectedTechStack((prev) =>
                  checked
                    ? [...prev, item.name]
                    : prev.filter((stack) => stack !== item.name),
                );
              }}
            />
            <label className="flex h-10 items-center gap-3">
              <div className="scale-150">{<item.icon />}</div>
              <span>{item.name}</span>
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
*/
