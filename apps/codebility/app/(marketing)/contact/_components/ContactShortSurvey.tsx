"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/constants/services";
import { IconDropdown } from "@/public/assets/svgs";
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "@radix-ui/react-select";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import { FormData } from "../page";

const referralSources = [
  "Search engine", "Social media", "Referral / Word of mouth",
  "LinkedIn", "Events / Conference", "Other",
];

const existingWebsiteOptions = [
  { value: "new", label: "New project — no existing site" },
  { value: "existing", label: "I have an existing website" },
  { value: "redesign", label: "Looking for a redesign" },
];

const MAX_CHARS = 500;

interface ShortSurveyProps {
  defaultValues: FormData;
  onNext: (data: Pick<FormData, "serviceInterest" | "projectType" | "featuresNeeded" | "referralSource" | "interestLevel" | "otherRequirements">) => void;
  onBack: () => void;
}

const ShortSurvey = ({ defaultValues, onNext, onBack }: ShortSurveyProps) => {
  const [selectedService, setSelectedService] = useState(defaultValues.serviceInterest);
  const [selectedSource, setSelectedSource] = useState(defaultValues.referralSource);
  const [projectType, setProjectType] = useState(defaultValues.projectType);
  const [features, setFeatures] = useState(defaultValues.featuresNeeded);
  const [otherRequirements, setOtherRequirements] = useState(defaultValues.otherRequirements);
  const [interestLevel, setInterestLevel] = useState(defaultValues.interestLevel);
  const [hoverStar, setHoverStar] = useState(0);

  const handleNext = () => {
    onNext({
      serviceInterest: selectedService,
      projectType,
      featuresNeeded: features,
      referralSource: selectedSource,
      interestLevel,
      otherRequirements,
    });
  };

  return (
    <div className="relative flex w-full flex-col gap-8 text-pretty rounded-lg border border-white/5 bg-white/5 px-5 py-10 text-white lg:py-14 xl:px-10">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">Short Survey</p>
        <p className="text-sm text-white/40">Help us understand your needs better</p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Service selection */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="services">Which services are you interested in?</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger aria-label="Service"
              className="border-black-800 bg-black-800 flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm text-white/30">
              <SelectValue placeholder="Select a service">
                {selectedService || "Select a service"}
              </SelectValue>
              <IconDropdown className="h-5 invert dark:invert-0" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}
              className="border-light_dark dark:bg-black-100 z-10 w-[var(--radix-select-trigger-width)] rounded-md border bg-[#FFF]">
              <SelectGroup>
                {services.map((service, i) => (
                  <SelectItem key={i}
                    className="cursor-default px-3 py-2 text-sm hover:bg-customBlue-100"
                    value={service.label}>{service.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Project type — radio cards */}
        <div className="flex flex-col gap-2">
          <Label>Do you have an existing website?</Label>
          <div className="flex flex-col gap-2">
            {existingWebsiteOptions.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setProjectType(opt.value)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200 ${
                  projectType === opt.value
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:text-white/70"
                }`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                  projectType === opt.value ? "border-violet-500 bg-violet-500" : "border-white/20"
                }`}>
                  {projectType === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features textarea */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="features">What features or functionalities do you need?</Label>
          <p className="text-xs text-white/30">e.g. contact forms, e-commerce, booking systems, galleries</p>
          <Textarea id="features" value={features}
            onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setFeatures(e.target.value); }}
            variant="default"
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
            placeholder="Type here" />
          <p className="text-right text-xs text-white/20">{features.length} / {MAX_CHARS}</p>
        </div>

        {/* Referral source */}
        <div className="flex flex-col gap-2">
          <Label>How did you hear about us?</Label>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger aria-label="Source"
              className="border-black-800 bg-black-800 flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm text-white/30">
              <SelectValue placeholder="Select a source">
                {selectedSource || "Select a source"}
              </SelectValue>
              <IconDropdown className="h-5 invert dark:invert-0" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}
              className="border-light_dark dark:bg-black-100 z-10 w-[var(--radix-select-trigger-width)] rounded-md border bg-[#FFF]">
              <SelectGroup>
                {referralSources.map((src, i) => (
                  <SelectItem key={i}
                    className="cursor-default px-3 py-2 text-sm hover:bg-customBlue-100"
                    value={src}>{src}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Star rating */}
        <div className="flex flex-col gap-2">
          <Label>How interested are you in working with us?</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button"
                onClick={() => setInterestLevel(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                className={`text-2xl transition-colors duration-150 ${
                  star <= (hoverStar || interestLevel) ? "text-violet-400" : "text-white/10"
                }`}>★</button>
            ))}
          </div>
        </div>

        {/* Additional requirements */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="requirements">
            Any other requirements or comments?{" "}
            <span className="text-white/20">(optional)</span>
          </Label>
          <Textarea id="requirements" value={otherRequirements}
            onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setOtherRequirements(e.target.value); }}
            variant="default"
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm"
            placeholder="Type here" />
          <p className="text-right text-xs text-white/20">{otherRequirements.length} / {MAX_CHARS}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" rounded="md" onClick={onBack}
          className="flex-1 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70">
          ← Back
        </Button>
        <Button variant="purple" rounded="md" onClick={handleNext} className="flex-[2]">
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default ShortSurvey;