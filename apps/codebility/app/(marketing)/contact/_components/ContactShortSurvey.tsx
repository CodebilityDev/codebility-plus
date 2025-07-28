"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/forms/input";
import { services } from "@/constants/services";
import { IconDropdown } from "@/public/assets/svgs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

const ShortSurvey = () => {
  return (
    <div className="relative mx-auto flex w-screen max-w-xl flex-col gap-10 text-pretty rounded-lg border border-white/5 bg-white/5 px-5 py-10 text-white lg:py-14 xl:px-20">
      <div className="flex flex-col gap-1">
        <p className="text-xl">Quick Questions</p>
        <p className="text-[#898989]">
          Key Details to Get Started on Your Website Project
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="services">
            Which services are you interested in having us handle?
          </Label>
          <Select onValueChange={() => {}}>
            <SelectTrigger
              aria-label="Type"
              className="text- border-black-800 bg-black-800 flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm text-white/10"
            >
              <SelectValue placeholder="Select Services" className="text-sm">
                Test
              </SelectValue>
              <IconDropdown className="h-5 invert dark:invert-0" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="border-light_dark dark:bg-black-100 z-10 rounded-md border bg-[#FFF]"
            >
              <SelectGroup>
                {services.map((service, i) => (
                  <SelectItem
                    key={i}
                    className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                    value={service.label}
                  >
                    {service.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="exist">
            Do you have an existing website or is this a new project?
          </Label>
          <Input
            id="exist"
            onChange={() => {}}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
            placeholder="Type here"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="features">
            What specific features or functionalities do you need? (e.g.,
            contact forms, e-commerce capabilities, booking systems, galleries)
          </Label>
          <Textarea
            id="features"
            onChange={() => {}}
            variant="default"
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2"
            placeholder="Type here"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="requirements">
            Do you have any other requirements or comments that we should know
            about?
          </Label>
          <Textarea
            id="requirements"
            onChange={() => {}}
            variant="default"
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2"
            placeholder="Type here"
          />
        </div>
        <Button variant="purple" rounded="md">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ShortSurvey;
