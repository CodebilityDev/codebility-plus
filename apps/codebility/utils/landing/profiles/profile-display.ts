import {
  getTechStackIconName,
  techstacks,
} from "@/constants/global/techstack";
import type { WorkExperience } from "@/types/global/codev";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TECH_LABELS: Record<string, string> = {
  NextJS: "Next.js",
  NodeJS: "Node.js",
  JQuery: "jQuery",
  Tailwind: "Tailwind CSS",
};

const DEGREE_LABELS: Record<string, string> = {
  BSIT: "BS Information Technology",
  BSCS: "BS Computer Science",
  BSIS: "BS Information Systems",
};

const GROUP_ORDER = [
  "Frontend",
  "Backend",
  "DevOps & Tools",
  "Mobile",
  "Blockchain",
  "Other",
];

const TECH_ORDER = [
  "React",
  "Next.js",
  "Angular",
  "Vue",
  "Nuxt.js",
  "Svelte",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "jQuery",
  "Node.js",
  "PHP",
  "MySQL",
  "WordPress",
  "Docker",
  "GitHub Actions",
  "Jenkins",
  "DigitalOcean",
  "Cloudflare",
  "Git",
  "Vite",
  "Webpack",
  "Figma",
];

export interface ProfileTech {
  name: string;
  iconSrc: string;
}

export interface ProfileTechGroup {
  name: string;
  technologies: ProfileTech[];
}

function getTechGroup(category: string | undefined) {
  if (category === "Frontend") return "Frontend";
  if (category === "Backend" || category === "CMS") return "Backend";
  if (category === "Server" || category === "Design") return "DevOps & Tools";
  if (category === "Mobile") return "Mobile";
  if (category === "Blockchain") return "Blockchain";
  return "Other";
}

export function groupProfileTechStacks(stacks: string[]) {
  const groups = new Map<string, ProfileTech[]>();

  for (const stack of stacks) {
    const lower = stack.trim().toLowerCase();
    const match = techstacks.find(
      (tech) =>
        tech.name.toLowerCase() === lower ||
        (tech.alias ? tech.alias.toLowerCase() === lower : false),
    );
    const canonicalName = match?.name ?? stack.trim();
    const group = getTechGroup(match?.category);
    const technologies = groups.get(group) ?? [];

    if (!technologies.some((tech) => tech.name === canonicalName)) {
      technologies.push({
        name: TECH_LABELS[canonicalName] ?? canonicalName,
        iconSrc:
          "/assets/svgs/techstack/icon-" +
          getTechStackIconName(canonicalName) +
          ".svg",
      });
    }

    groups.set(group, technologies);
  }

  for (const technologies of groups.values()) {
    technologies.sort((a, b) => {
      const aIndex = TECH_ORDER.indexOf(a.name);
      const bIndex = TECH_ORDER.indexOf(b.name);
      return (aIndex === -1 ? TECH_ORDER.length : aIndex) -
        (bIndex === -1 ? TECH_ORDER.length : bIndex);
    });
  }

  return GROUP_ORDER.flatMap((group) => {
    const technologies = groups.get(group);
    return technologies ? [{ name: group, technologies }] : [];
  });
}

export function formatScheduleTime(time: string) {
  const [hoursPart = "0", minutesPart = "00"] = time.split(":");
  const hour = Number.parseInt(hoursPart, 10);
  const meridiem = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return displayHour + ":" + minutesPart + " " + meridiem;
}

export function formatScheduleTimeRange(schedule: {
  start_time: string;
  end_time: string;
}) {
  return (
    formatScheduleTime(schedule.start_time) +
    " - " +
    formatScheduleTime(schedule.end_time)
  );
}

export function formatScheduleDays(days: string[]) {
  const active = new Set(days);

  if (
    WEEKDAYS.slice(0, 5).every((day) => active.has(day)) &&
    !active.has("Saturday") &&
    !active.has("Sunday")
  ) {
    return "Mon - Fri";
  }

  return WEEKDAYS.flatMap((day, index) =>
    active.has(day) ? [WEEKDAY_LABELS[index]] : [],
  ).join(", ");
}

export function formatMonthYear(date: string) {
  const parsed = new Date(date + "T00:00:00Z");
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatExperiencePeriod(experience: WorkExperience) {
  const start = formatMonthYear(experience.date_from);
  const end =
    experience.is_present || !experience.date_to
      ? "Present"
      : formatMonthYear(experience.date_to);

  return start + " - " + end;
}

export function formatExperienceDuration(
  experience: WorkExperience,
  referenceDate: string,
) {
  const start = new Date(experience.date_from + "T00:00:00Z");
  const end =
    experience.is_present || !experience.date_to
      ? new Date(referenceDate)
      : new Date(experience.date_to + "T00:00:00Z");

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  const months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());

  if (months <= 0) return "<1 mo";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) parts.push(years + (years === 1 ? " yr" : " yrs"));
  if (remainingMonths > 0) {
    parts.push(
      remainingMonths + (remainingMonths === 1 ? " mo" : " mos"),
    );
  }

  return parts.join(" ");
}

export function getCurrentExperience(
  experiences: WorkExperience[] | null | undefined,
) {
  if (!experiences || experiences.length === 0) return null;
  return experiences.find((experience) => experience.is_present) ?? experiences[0];
}

export function formatDegreeLabel(degree: string | null) {
  if (!degree) return "Degree";
  return DEGREE_LABELS[degree.toUpperCase()] ?? degree;
}

export function formatEducationYears(
  startDate: string | null,
  endDate: string | null,
) {
  const start = startDate ? new Date(startDate).getUTCFullYear() : null;
  const end = endDate ? new Date(endDate).getUTCFullYear() : null;

  if (start && end) return start + " - " + end;
  if (start) return start + " - Present";
  if (end) return String(end);
  return "";
}

export function getInitials(firstName: string, lastName: string) {
  return (
    (firstName.charAt(0) || "") + (lastName.charAt(0) || "")
  ).toUpperCase();
}
