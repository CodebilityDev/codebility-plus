import { IconHuman, IconApplicant, IconActivityLog } from "@/public/assets/svgs/index";


export const meetingTypes = [
  { value: "zoom", label: "Zoom", sub: "Via Zoom meeting link" },
  { value: "gmeet", label: "Google Meet", sub: "Via Google Meet link" },
  { value: "teams", label: "Microsoft Teams", sub: "Via Teams link" },
  { value: "other", label: "Other", sub: "Specify your preferred tool" },
];

export const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

export const unavailableSlots: string[] = [];

export const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const PHT_OFFSET = 8 * 60;

export const industries = [
  "Technology", "Healthcare", "Finance",
  "Retail", "Education", "Manufacturing", "Other",
];

export const referralSources = [
  "Search engine", "Social media", "Referral / Word of mouth",
  "LinkedIn", "Events / Conference", "Other",
];

export const existingWebsiteOptions = [
  { value: "new", label: "New project — no existing site" },
  { value: "existing", label: "I have an existing website" },
  { value: "redesign", label: "Looking for a redesign" },
];

export const MAX_CHARS = 500;

export const steps = [
    { label: "Inquiry Form", icon: <IconHuman /> },
    { label: "Short Survey", icon: <IconApplicant /> },
    { label: "Set an Appointment", icon: <IconActivityLog /> },
];
