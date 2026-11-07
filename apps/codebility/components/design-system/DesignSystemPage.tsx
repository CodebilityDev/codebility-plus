import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  CreditCard,
  Headphones,
  LayoutGrid,
  Mail,
  Menu,
  Minus,
  Monitor,
  Palette,
  Plus,
  Rocket,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  note: string;
  children: ReactNode;
}

interface PanelProps {
  className?: string;
  children: ReactNode;
}

interface SwatchProps {
  name: string;
  value: string;
  usage: string;
  swatch: string;
}

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonState = "default" | "hover" | "focus" | "disabled";

const actionColors: SwatchProps[] = [
  {
    name: "primary",
    value: "#9747FF",
    usage: "Main action · white text",
    swatch: "bg-[#9747ff]",
  },
  {
    name: "primary-hover",
    value: "#8435EA",
    usage: "Hover & pressed",
    swatch: "bg-[#8435ea]",
  },
  {
    name: "primary-subtle",
    value: "Violet / 18%",
    usage: "Selected chip",
    swatch: "border-[#9747ff]/30 bg-[#9747ff]/[0.18]",
  },
  {
    name: "focus-ring",
    value: "#6A78F2",
    usage: "2px ring + 2px offset",
    swatch: "bg-[#6a78f2]",
  },
  {
    name: "accent",
    value: "#02FFE2",
    usage: "Teal glows, admin",
    swatch: "bg-[#02ffe2]",
  },
  {
    name: "accent-text",
    value: "#C084FC",
    usage: "Links, icons",
    swatch: "bg-[#c084fc]",
  },
];

const surfaceColors: SwatchProps[] = [
  {
    name: "bg",
    value: "#030303",
    usage: "Page background",
    swatch: "border-white/10 bg-[#030303]",
  },
  {
    name: "surface-glass",
    value: "White / 5%",
    usage: "Cards, inputs",
    swatch: "border-white/20 bg-white/5",
  },
  {
    name: "surface-solid",
    value: "#0A0A0A",
    usage: "Footer, media",
    swatch: "border-white/10 bg-[#0a0a0a]",
  },
  {
    name: "border",
    value: "White / 10%",
    usage: "Decorative dividers",
    swatch: "border-white/10 bg-white/10",
  },
  {
    name: "text",
    value: "#F4F4F4",
    usage: "Headings, body",
    swatch: "border-white/10 bg-[#f4f4f4]",
  },
  {
    name: "text-muted",
    value: "White / 60%",
    usage: "Secondary information",
    swatch: "border-white/10 bg-white/60",
  },
];

const statusColors: SwatchProps[] = [
  {
    name: "text-secondary",
    value: "White / 75%",
    usage: "Lead and supporting copy",
    swatch: "border-white/10 bg-white/75",
  },
  {
    name: "link-text",
    value: "#D8B4FE",
    usage: "Text links",
    swatch: "bg-[#d8b4fe]",
  },
  {
    name: "success",
    value: "#4BCE97",
    usage: "Available, complete",
    swatch: "bg-[#4bce97]",
  },
  {
    name: "danger",
    value: "#D45454",
    usage: "Error, busy",
    swatch: "bg-[#d45454]",
  },
  {
    name: "success-text",
    value: "#7BE0B6",
    usage: "Status label",
    swatch: "bg-[#7be0b6]",
  },
  {
    name: "danger-text",
    value: "#F08A8A",
    usage: "Error label",
    swatch: "bg-[#f08a8a]",
  },
];

const gradients = [
  {
    name: "heading",
    usage: "Centered section titles",
    gradient: "from-[#f4f4f4] via-purple-200 to-cyan-200",
  },
  {
    name: "accent",
    usage: "2–3 key headline words",
    gradient: "from-purple-400 via-pink-400 to-cyan-400",
  },
  {
    name: "stat",
    usage: "Large numbers only",
    gradient: "from-purple-400 to-cyan-400",
  },
  {
    name: "brand",
    usage: "One brand panel per page",
    gradient: "from-[#00738b] via-[#0c3fdb] to-[#9707dd]",
  },
];

const radii = [
  { value: "8", usage: "Checkbox", radius: "rounded-lg" },
  { value: "12", usage: "Input / icon", radius: "rounded-xl" },
  { value: "16", usage: "Step / list", radius: "rounded-2xl" },
  { value: "24", usage: "Card / panel", radius: "rounded-3xl" },
  { value: "full", usage: "Button / pill", radius: "rounded-full" },
];

const spacing = [
  { label: "4", height: 4 },
  { label: "8", height: 8 },
  { label: "12", height: 12 },
  { label: "16", height: 16 },
  { label: "24", height: 24 },
  { label: "32", height: 32 },
  { label: "48", height: 48 },
  { label: "64", height: 64 },
  { label: "96", height: 96 },
];

const buttonStyles: Record<ButtonVariant, Record<ButtonState, string>> = {
  primary: {
    default: "bg-[#9747ff] text-white",
    hover: "bg-[#8435ea] text-white",
    focus:
      "bg-[#9747ff] text-white ring-2 ring-[#6A78F2] ring-offset-2 ring-offset-[#030303]",
    disabled: "bg-[#9747ff] text-white opacity-50",
  },
  outline: {
    default: "border border-white/30 text-[#f4f4f4]",
    hover: "border border-white/0 bg-[#f4f4f4] text-[#030303]",
    focus:
      "border border-[#f4f4f4] text-[#f4f4f4] ring-2 ring-[#6A78F2] ring-offset-2 ring-offset-[#030303]",
    disabled: "border border-white/30 text-[#f4f4f4] opacity-50",
  },
  ghost: {
    default: "text-[#f4f4f4]",
    hover: "bg-white/10 text-[#f4f4f4]",
    focus:
      "text-[#f4f4f4] ring-2 ring-[#6A78F2] ring-offset-2 ring-offset-[#030303]",
    disabled: "text-[#f4f4f4] opacity-50",
  },
};

const buttonStates: ButtonState[] = ["default", "hover", "focus", "disabled"];

const iconSpecimens = [
  { icon: Sparkles, label: "sparkles" },
  { icon: Monitor, label: "monitor" },
  { icon: Smartphone, label: "smartphone" },
  { icon: Palette, label: "palette" },
  { icon: LayoutGrid, label: "layout" },
  { icon: Rocket, label: "rocket" },
  { icon: Users, label: "users" },
  { icon: CalendarDays, label: "calendar" },
  { icon: Mail, label: "mail" },
  { icon: Clock, label: "clock" },
  { icon: Headphones, label: "headphones" },
  { icon: BadgeCheck, label: "badge" },
];

const rules = [
  {
    number: "1",
    title: "One primary action per view",
    body: "Violet is reserved for the main action and active states. Everything else is outline, ghost or text link.",
    good: "Book a Call + View Our Work (outline)",
    bad: "Two violet buttons side by side",
  },
  {
    number: "2",
    title: "Gradients are for emphasis",
    body: "Accent gradient on 2–3 headline words; stat gradient on numbers only. Body text stays solid.",
    good: "A few words in the accent gradient",
    bad: "Gradient paragraphs or buttons",
  },
  {
    number: "3",
    title: "One source for every number",
    body: "Use one verified data source for stats. Specimen numbers in this library are examples, not factual claims.",
    good: "One verified score everywhere",
    bad: "Conflicting metrics across sections",
  },
  {
    number: "4",
    title: "Accessible by default",
    body: "Use 4.5:1 for normal text and clear control boundaries. Every control has a label and visible keyboard focus.",
    good: "2px focus ring with 2px offset",
    bad: "Removing outlines without a replacement",
  },
  {
    number: "5",
    title: "Motion respects the user",
    body: "Hover lift: 2px over 200ms ease-out. Stop looping and decorative motion with prefers-reduced-motion.",
    good: "Quiet, intentional feedback",
    bad: "Continuous motion for every user",
  },
  {
    number: "6",
    title: "Real links, real pages",
    body: "Use links for navigation and buttons for actions. Keep legal and FAQ content addressable with its own URL.",
    good: "Links styled as buttons",
    bad: "A button nested inside a link",
  },
];

function Section({ id, number, title, note, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:gap-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-300/40 bg-[#9747ff] text-xs font-normal leading-[18px] text-purple-100">
          {number}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#f4f4f4] sm:text-3xl">
          {title}
        </h2>
        <p className="text-sm text-white/60 sm:ml-auto sm:text-right">{note}</p>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Panel({ className = "", children }: PanelProps) {
  return (
    <div
      className={`min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
      {children}
    </p>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/assets/svgs/codebility-white.svg"
      alt="Codebility"
      width={1288}
      height={295}
      loading="eager"
      className={`object-contain ${className}`}
    />
  );
}

function Swatch({ name, value, usage, swatch }: SwatchProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className={`h-[88px] w-full rounded-xl border ${swatch}`} />
      <p className="text-sm font-medium text-[#f4f4f4]">{name}</p>
      <p className="text-xs leading-[18px] text-white/60">{value}</p>
      <p className="text-xs leading-[18px] text-white/60">{usage}</p>
    </div>
  );
}

function TypeRow({
  label,
  spec,
  children,
}: {
  label: string;
  spec: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-white/5 py-5 last:border-b-0 last:pb-0 first:pt-0 md:grid-cols-[112px_minmax(0,1fr)_190px] md:items-center md:gap-6">
      <span className="text-sm font-medium text-white/60">{label}</span>
      <div className="min-w-0">{children}</div>
      <span className="text-xs leading-[18px] text-white/60 md:text-right">
        {spec}
      </span>
    </div>
  );
}

function ButtonSpecimen({
  variant,
  state,
  size = "lg",
  children,
}: {
  variant: ButtonVariant;
  state: ButtonState;
  size?: "lg" | "sm";
  children: ReactNode;
}) {
  const sizing =
    size === "sm"
      ? "h-10 px-[18px] text-[15px] leading-5"
      : "h-12 px-6 text-[17px] leading-5";

  return (
    <span
      className={`inline-flex items-center justify-center gap-2 rounded-full font-normal ${sizing} ${buttonStyles[variant][state]} ${state === "disabled" ? "cursor-not-allowed" : ""}`}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  help,
  tone = "default",
  multiline = false,
  muted = false,
}: {
  label: string;
  value: string;
  help?: string;
  tone?: "default" | "focus" | "error";
  multiline?: boolean;
  muted?: boolean;
}) {
  const border =
    tone === "focus"
      ? "border-[#9747ff] ring-2 ring-[#9747ff]/20"
      : tone === "error"
        ? "border-[#d45454]"
        : "border-white/10";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-white/70">{label}</span>
      <div
        className={`flex rounded-xl border bg-white/[0.04] ${border} ${
          multiline ? "h-24 items-start p-4" : "h-12 items-center px-4"
        }`}
      >
        <span
          className={`text-[15px] leading-5 ${
            muted ? "text-white/50" : "text-[#f4f4f4]"
          }`}
        >
          {value}
        </span>
      </div>
      {help ? (
        <span
          className={`text-xs leading-[18px] ${
            tone === "error" ? "text-[#f08a8a]" : "text-white/60"
          }`}
        >
          {help}
        </span>
      ) : null}
    </div>
  );
}

function Chip({
  children,
  selected = false,
}: {
  children: ReactNode;
  selected?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-8 items-center justify-center rounded-full border px-3 text-sm font-normal ${
        selected
          ? "border-purple-400 bg-[#9747ff] text-purple-100"
          : "border-white/10 bg-white/[0.04] text-white/70"
      }`}
    >
      {children}
    </span>
  );
}

function CheckboxCard({
  label,
  selected = false,
}: {
  label: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`flex h-12 items-center gap-3 rounded-xl border p-3 ${
        selected
          ? "border-[#9747ff]/50 bg-[#9747ff]/[0.18]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border ${
          selected
            ? "border-[#9747ff] bg-[#9747ff] text-white"
            : "border-white/25 bg-transparent"
        }`}
      >
        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      <span className="text-sm text-[#f4f4f4]">{label}</span>
    </div>
  );
}

function Toggle({
  label,
  checked = false,
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-white/70">{label}</span>
      <span
        className={`flex h-[22px] w-10 items-center rounded-full px-[3px] ${
          checked ? "justify-end bg-[#9747ff]" : "justify-start bg-white/20"
        }`}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </span>
    </div>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((star) => (
        <Star
          key={star}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

function DesignSystemPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-[#f4f4f4]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[#9747ff]/[0.12] blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 md:px-12 lg:p-20">
        <header className="relative flex flex-col gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -top-10 h-[420px] opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(244,244,244,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.08) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at top, black, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at top, black, transparent 72%)",
            }}
          />

          <div className="relative w-[200px]">
            <Wordmark className="h-auto w-[200px]" />
          </div>

          <h1 className="relative max-w-[1100px] bg-gradient-to-b from-[#f4f4f4] via-purple-200 to-cyan-200 bg-clip-text text-[44px] font-semibold leading-[48px] tracking-tight text-transparent sm:text-[60px] sm:leading-[64px]">
            Design System v2.0
          </h1>

          <div className="relative flex flex-wrap items-center gap-3">
            {["DARK ONLY", "GLASS SURFACES", "ONE VIOLET ACTION"].map(
              (label) => (
                <span
                  key={label}
                  className="inline-flex items-center justify-center rounded-full border border-purple-300/50 bg-[#9747ff] px-4 py-2 text-xs font-semibold leading-[18px] text-purple-100"
                >
                  {label}
                </span>
              ),
            )}
          </div>

          <p className="relative text-base text-white/60">
            Codebility · Outfit · Lucide · November 2026
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          <Section
            id="color"
            number="01"
            title="Color"
            note="Semantic aliases · dark theme"
          >
            <div className="flex flex-col gap-4">
              <GroupLabel>Action</GroupLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {actionColors.map((color) => (
                  <Swatch key={color.name} {...color} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <GroupLabel>Surfaces &amp; text</GroupLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {surfaceColors.map((color) => (
                  <Swatch key={color.name} {...color} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <GroupLabel>Status &amp; emphasis</GroupLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                {statusColors.map((color) => (
                  <Swatch key={color.name} {...color} />
                ))}
              </div>
            </div>
          </Section>

          <Section
            id="gradients"
            number="02"
            title="Gradients & backgrounds"
            note="Emphasis only · keep body text solid"
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {gradients.map((gradient) => (
                <div key={gradient.name} className="flex flex-col gap-2">
                  <div
                    className={`h-20 w-full rounded-xl border border-white/10 bg-gradient-to-b ${gradient.gradient}`}
                  />
                  <p className="text-sm font-medium text-[#f4f4f4]">
                    {gradient.name}
                  </p>
                  <p className="text-xs leading-[18px] text-white/60">
                    {gradient.usage}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative flex h-[170px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#030303] p-4">
                <span
                  aria-hidden
                  className="absolute inset-x-8 -top-16 h-32 rounded-full bg-[#9747ff]/30 blur-3xl"
                />
                <span className="relative text-sm text-white/70">
                  Violet top glow · hero
                </span>
              </div>

              <div className="relative flex h-[170px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#030303] p-4">
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(244,244,244,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.12) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                    maskImage:
                      "linear-gradient(to bottom, black, transparent 85%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black, transparent 85%)",
                  }}
                />
                <span className="relative text-sm text-white/70">
                  Grid mask · 56px cells
                </span>
              </div>

              <div className="relative flex h-[170px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#030303] p-4">
                <span
                  aria-hidden
                  className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#02ffe2]/20 blur-3xl"
                />
                <span className="relative text-sm text-white/70">
                  Teal side glow · process
                </span>
              </div>

              <div className="relative flex h-[170px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#030303] p-4">
                <span
                  aria-hidden
                  className="absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-[#9747ff]/25 blur-3xl"
                />
                <span
                  aria-hidden
                  className="absolute -right-6 top-0 h-32 w-32 rounded-full bg-[#02ffe2]/20 blur-3xl"
                />
                <span className="relative text-sm text-white/70">
                  CTA panel glow
                </span>
              </div>
            </div>
          </Section>

          <Section
            id="typography"
            number="03"
            title="Typography"
            note="Outfit · 400 body · 500 UI · 600 titles · 700 display"
          >
            <Panel>
              <TypeRow label="display" spec="72 / 72 · 700 · mobile 44">
                <span className="block text-[44px] font-bold leading-[48px] tracking-tight text-[#f4f4f4] md:text-7xl md:leading-[72px]">
                  Right talent
                </span>
              </TypeRow>

              <TypeRow label="h2" spec="44 / 48 · 700 · mobile 32">
                <span className="block text-[32px] font-bold leading-[36px] tracking-tight text-[#f4f4f4] md:text-[44px] md:leading-[48px]">
                  From first call to launch day
                </span>
              </TypeRow>

              <TypeRow label="h2-centered" spec="44 / 48 · heading gradient">
                <span className="block bg-gradient-to-b from-[#f4f4f4] via-purple-200 to-cyan-200 bg-clip-text text-[32px] font-bold leading-[36px] tracking-tight text-transparent md:text-[44px] md:leading-[48px]">
                  You’re in great company
                </span>
              </TypeRow>

              <TypeRow label="h3" spec="24 / 30 · 600">
                <span className="block text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
                  Web App Development
                </span>
              </TypeRow>

              <TypeRow label="h4" spec="17 / 24 · 600">
                <span className="block text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                  Discovery call
                </span>
              </TypeRow>

              <TypeRow label="lead" spec="18 / 28 · 400">
                <span className="block text-lg leading-7 text-white/75">
                  Vetted engineers, designers and strategists who join your
                  roadmap in days.
                </span>
              </TypeRow>

              <TypeRow label="body" spec="16 / 24 · 400">
                <span className="block text-base leading-6 text-white/75">
                  After a discovery call we share a shortlist of matching
                  CoDevs.
                </span>
              </TypeRow>

              <TypeRow label="small" spec="14 / 20 · 400">
                <span className="block text-sm leading-5 text-white/60">
                  Weekly demos, shared board and one point of contact.
                </span>
              </TypeRow>

              <TypeRow label="eyebrow" spec="12 / 18 · 600 · tracking 30%">
                <span className="block text-xs font-semibold uppercase leading-[18px] tracking-[0.3em] text-white/70">
                  Technology · Engineering · Product
                </span>
              </TypeRow>

              <TypeRow label="stat" spec="48 / 48 · 700 · examples only">
                <span className="block bg-gradient-to-b from-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold leading-[48px] text-transparent">
                  120+ · 4.9/5
                </span>
              </TypeRow>
            </Panel>
          </Section>

          <Section
            id="radius-spacing"
            number="04"
            title="Radius, spacing & elevation"
            note="Five shared radii · 4px spacing base"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <Panel className="flex flex-col gap-5">
                <GroupLabel>Radius</GroupLabel>
                <div className="grid grid-cols-5 gap-3 sm:gap-5">
                  {radii.map((radius) => (
                    <div
                      key={radius.value}
                      className="flex min-w-0 flex-col items-center gap-3 text-center"
                    >
                      <div
                        className={`h-20 w-full border border-[#9747ff]/40 bg-[#9747ff] ${radius.radius}`}
                      />
                      <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                        {radius.value}
                      </span>
                      <span className="text-xs leading-[18px] text-white/60">
                        {radius.usage}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="flex flex-col gap-5">
                <GroupLabel>Spacing</GroupLabel>
                <div className="flex items-end justify-between gap-2">
                  {spacing.map((step) => (
                    <div
                      key={step.label}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div
                        className="w-4 rounded-sm bg-[#9747ff]"
                        style={{ height: step.height }}
                      />
                      <span className="text-xs leading-[18px] text-white/60">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Card padding 24 · grid gap 24 · section padding 96 desktop /
                  64 mobile · container 1280
                </p>
              </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
              <Panel className="flex flex-col gap-4">
                <GroupLabel>Borders</GroupLabel>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    {
                      label: "Default",
                      className: "border border-white/10 bg-white/[0.02]",
                    },
                    {
                      label: "Selected",
                      className: "border border-[#9747ff] bg-[#9747ff]/[0.18]",
                    },
                    {
                      label: "Focus",
                      className:
                        "border border-[#6A78F2] ring-2 ring-[#6A78F2]/40 ring-offset-2 ring-offset-[#030303]",
                    },
                    {
                      label: "Solid",
                      className: "border border-white/10 bg-[#0a0a0a]",
                    },
                  ].map((sample) => (
                    <div key={sample.label} className="flex flex-col gap-3">
                      <div className={`h-16 rounded-xl ${sample.className}`} />
                      <span className="text-sm font-medium text-white/70">
                        {sample.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="flex flex-col gap-4">
                <GroupLabel>Elevation</GroupLabel>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    {
                      label: "glow-sm",
                      detail: "Primary button",
                      className:
                        "border border-white/10 bg-[#121214] shadow-[0_0_18px_rgba(151,71,255,0.24)]",
                    },
                    {
                      label: "glow-md",
                      detail: "Active step",
                      className:
                        "border border-white/10 bg-[#121214] shadow-[0_0_32px_rgba(151,71,255,0.34)]",
                    },
                    {
                      label: "glow-lg",
                      detail: "Featured quote",
                      className:
                        "border border-white/10 bg-[#121214] shadow-[0_0_56px_rgba(151,71,255,0.44)]",
                    },
                    {
                      label: "glass-8",
                      detail: "8px glass blur",
                      className:
                        "border border-white/20 bg-white/[0.06] backdrop-blur-lg",
                    },
                  ].map((sample) => (
                    <div key={sample.label} className="flex flex-col gap-3">
                      <div className={`h-16 rounded-xl ${sample.className}`} />
                      <span className="text-sm font-medium text-white/70">
                        {sample.label}
                      </span>
                      <span className="text-xs leading-[18px] text-white/60">
                        {sample.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <p className="text-xs leading-[18px] text-white/60">
              Canonical radii follow the consolidated scale above. Card samples
              use r24; legacy r20/r22 examples are normalized. Numbers and
              people shown in specimens are examples, not verified company
              claims.
            </p>
          </Section>

          <Section
            id="buttons"
            number="05"
            title="Buttons"
            note="One primary per view · links stay links"
          >
            <Panel>
              <div className="overflow-x-auto pb-1">
                <div className="flex min-w-[980px] flex-col gap-5">
                  <div className="grid grid-cols-[150px_repeat(4,minmax(0,1fr))] items-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      Style / size
                    </span>
                    {buttonStates.map((state) => (
                      <span
                        key={state}
                        className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60"
                      >
                        {state}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-[150px_repeat(4,minmax(0,1fr))] items-center gap-4">
                    <span className="text-xs leading-[18px] text-white/60">
                      Primary · 48
                    </span>
                    {buttonStates.map((state) => (
                      <div key={state} className="flex items-center">
                        <ButtonSpecimen variant="primary" state={state}>
                          Book a Call
                        </ButtonSpecimen>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[150px_repeat(4,minmax(0,1fr))] items-center gap-4">
                    <span className="text-xs leading-[18px] text-white/60">
                      Outline · 48
                    </span>
                    {buttonStates.map((state) => (
                      <div key={state} className="flex items-center">
                        <ButtonSpecimen variant="outline" state={state}>
                          View Our Work
                        </ButtonSpecimen>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[150px_repeat(4,minmax(0,1fr))] items-center gap-4">
                    <span className="text-xs leading-[18px] text-white/60">
                      Ghost · 40
                    </span>
                    {buttonStates.map((state) => (
                      <div key={state} className="flex items-center">
                        <ButtonSpecimen variant="ghost" state={state} size="sm">
                          Sign in
                        </ButtonSpecimen>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[150px_repeat(4,minmax(0,1fr))] items-center gap-4">
                    <span className="text-xs leading-[18px] text-white/60">
                      Sizes &amp; icons
                    </span>
                    <div className="flex items-center">
                      <ButtonSpecimen
                        variant="primary"
                        state="default"
                        size="sm"
                      >
                        Hire CoDevs
                        <ArrowRight className="h-4 w-4" />
                      </ButtonSpecimen>
                    </div>
                    <div className="flex items-center">
                      <ButtonSpecimen variant="primary" state="default">
                        Send
                        <Send className="h-4 w-4" />
                      </ButtonSpecimen>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70">
                        <ChevronLeft className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70">
                        <ChevronRight className="h-[18px] w-[18px]" />
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-2 text-[15px] leading-5 text-purple-300">
                        Explore AI integration
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <p className="text-xs leading-[18px] text-white/60">
              Primary uses #FFFFFF on #9747FF. Hover uses #8435EA. Keyboard
              focus: 2px #6A78F2 ring with 2px background offset. Disabled
              controls do not trigger actions.
            </p>
          </Section>

          <Section
            id="forms"
            number="06"
            title="Forms & controls"
            note="r12 inputs · 48px height · label above, help below"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <Panel className="flex flex-col gap-5">
                <GroupLabel>Text input</GroupLabel>
                <Field
                  label="Email address"
                  value="you@company.com"
                  help="We’ll only use this to reply to you."
                  muted
                />
                <Field
                  label="Email address"
                  value="maria@startup.io"
                  help="We’ll only use this to reply to you."
                  tone="focus"
                />
                <Field
                  label="Email address"
                  value="maria@startup"
                  help="Enter a valid email address."
                  tone="error"
                />
                <Field
                  label="Project details"
                  value="A few lines about your goals…"
                  multiline
                  muted
                />
              </Panel>

              <Panel className="flex flex-col gap-5">
                <GroupLabel>Search</GroupLabel>
                <div className="flex h-[54px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4">
                  <Search className="h-[18px] w-[18px] shrink-0 text-white/60" />
                  <span className="min-w-0 flex-1 truncate text-[15px] leading-5 text-white/60">
                    Search by skill…
                  </span>
                  <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#9747ff] px-[18px] text-[15px] leading-5 text-white">
                    Find
                  </span>
                </div>

                <GroupLabel>Choice chips · single select</GroupLabel>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>{"< $5k"}</Chip>
                  <Chip selected>$5k – $15k</Chip>
                </div>

                <GroupLabel>Filter chips · multi select</GroupLabel>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip selected>React</Chip>
                  <Chip selected>Flutter</Chip>
                  <Chip>Node.js</Chip>
                </div>

                <p className="text-xs leading-[18px] text-white/60">
                  Choice: one value. Filter: multiple values. Keep selected and
                  unselected states distinct.
                </p>
              </Panel>

              <Panel className="flex flex-col gap-5">
                <GroupLabel>Checkbox cards</GroupLabel>
                <div className="flex flex-col gap-2">
                  <CheckboxCard label="Web App" selected />
                  <CheckboxCard label="Mobile App" />
                  <CheckboxCard label="AI Development" selected />
                  <CheckboxCard label="Product Design" />
                </div>

                <GroupLabel>Switches</GroupLabel>
                <div className="flex flex-col gap-3">
                  <Toggle label="Email me project updates" checked />
                  <Toggle label="Available for new projects" />
                </div>

                <p className="text-xs leading-[18px] text-white/60">
                  Keep visible labels. On touch screens, expand the hit area to
                  at least 44 × 44px.
                </p>
              </Panel>
            </div>
          </Section>

          <Section
            id="navigation"
            number="07"
            title="Navigation & disclosure"
            note="Violet active states · consistent destinations"
          >
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <div className="flex h-[72px] min-w-[1120px] items-center gap-4 p-4">
                <Wordmark className="h-8 w-auto shrink-0" />

                <div className="flex flex-1 items-center justify-center gap-1">
                  <span className="inline-flex h-10 items-center justify-center rounded-full border border-purple-400 bg-[#9747ff] px-4 text-sm font-medium text-purple-100">
                    Home
                  </span>
                  {["Services", "Portfolio", "CoDevs", "Careers"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-white/60"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <div className="flex h-9 w-[200px] shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3">
                  <Search className="h-4 w-4 shrink-0 text-white/60" />
                  <span className="truncate text-xs leading-[18px] text-white/60">
                    Search developers…
                  </span>
                </div>

                <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-[18px] text-[15px] leading-5 text-white/60">
                  Sign in
                </span>
                <span className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#9747ff] px-[18px] text-[15px] leading-5 text-white">
                  Book a Call
                </span>
              </div>
            </div>

            <p className="text-xs leading-[18px] text-white/50 lg:hidden">
              Scroll the specimen horizontally to see the full desktop bar.
            </p>

            <p className="text-xs leading-[18px] text-white/60">
              Top navigation replaces the fixed side rail. Desktop ≥1024px;
              below 1024px use the mobile header and a focus-managed menu sheet.
            </p>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <Panel className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <GroupLabel>Tabs · segmented</GroupLabel>
                  <div className="flex h-[50px] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1">
                    <span className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#9747ff] px-4 text-sm font-medium text-white">
                      All
                      <span className="text-[11px] leading-4 text-white/70">
                        120
                      </span>
                    </span>
                    {[
                      { label: "Admins", count: "8" },
                      { label: "Mentors", count: "12" },
                      { label: "CoDevs", count: "100" },
                    ].map((tab) => (
                      <span
                        key={tab.label}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white/60"
                      >
                        {tab.label}
                        <span className="text-[11px] leading-4 text-white/60">
                          {tab.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <GroupLabel>Carousel &amp; pager</GroupLabel>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-6 rounded-full bg-[#9747ff]" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                    </div>
                    <span className="text-xs leading-[18px] text-white/60">
                      1 of 4
                    </span>
                    <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70">
                      <ChevronLeft className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70">
                      <ChevronRight className="h-[18px] w-[18px]" />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <GroupLabel>Mobile header</GroupLabel>
                  <div className="flex h-[72px] items-center gap-4 rounded-none border border-white/10 bg-[#0a0a0a] p-4">
                    <Wordmark className="h-8 w-auto" />
                    <span className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70">
                      <Menu className="h-[18px] w-[18px]" />
                    </span>
                  </div>
                </div>
              </Panel>

              <Panel className="flex flex-col gap-4">
                <GroupLabel>Category list</GroupLabel>
                <div className="flex flex-col gap-2">
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-[#9747ff]/50 bg-[#9747ff]/[0.18] px-4">
                    <Code2 className="h-[18px] w-[18px] shrink-0 text-purple-200" />
                    <span className="text-[15px] leading-5 text-[#f4f4f4]">
                      Hiring CoDevs
                    </span>
                    <span className="text-xs leading-[18px] text-white/60">
                      6
                    </span>
                    <ChevronRight className="ml-auto h-[18px] w-[18px] text-white/60" />
                  </div>
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4">
                    <Users className="h-[18px] w-[18px] shrink-0 text-white/60" />
                    <span className="text-[15px] leading-5 text-[#f4f4f4]">
                      The CoDev Program
                    </span>
                    <span className="text-xs leading-[18px] text-white/60">
                      5
                    </span>
                    <ChevronRight className="ml-auto h-[18px] w-[18px] text-white/60" />
                  </div>
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4">
                    <CreditCard className="h-[18px] w-[18px] shrink-0 text-white/60" />
                    <span className="text-[15px] leading-5 text-[#f4f4f4]">
                      Payments
                    </span>
                    <span className="text-xs leading-[18px] text-white/60">
                      4
                    </span>
                    <ChevronRight className="ml-auto h-[18px] w-[18px] text-white/60" />
                  </div>
                </div>
              </Panel>

              <Panel className="flex flex-col gap-4">
                <GroupLabel>Accordion</GroupLabel>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 rounded-2xl border border-[#9747ff]/40 bg-[#9747ff]/[0.18] p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#f4f4f4]">
                        How quickly can I get a developer?
                      </span>
                      <Minus className="ml-auto h-[18px] w-[18px] shrink-0 text-purple-200" />
                    </div>
                    <p className="text-sm leading-5 text-white/70">
                      We share a shortlist after the discovery call. You
                      interview and choose before work starts.
                    </p>
                  </div>
                  <div className="flex h-[64px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-5">
                    <span className="text-sm font-medium text-[#f4f4f4]">
                      Can I interview developers first?
                    </span>
                    <Plus className="ml-auto h-[18px] w-[18px] shrink-0 text-white/60" />
                  </div>
                  <div className="flex h-[64px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-5">
                    <span className="text-sm font-medium text-[#f4f4f4]">
                      Who owns the code?
                    </span>
                    <Plus className="ml-auto h-[18px] w-[18px] shrink-0 text-white/60" />
                  </div>
                </div>
              </Panel>
            </div>

            <Panel className="flex flex-col gap-4">
              <GroupLabel>Stepper · done / active / upcoming</GroupLabel>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex h-[86px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4bce97] text-[#030303]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                      Discovery call
                    </span>
                    <span className="text-sm text-white/60">
                      Goals, scope, budget
                    </span>
                  </div>
                </div>
                <div className="flex h-[86px] items-center gap-4 rounded-2xl border border-[#9747ff]/50 bg-[#9747ff]/[0.18] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9747ff] text-sm font-medium text-white">
                    02
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                      Team matching
                    </span>
                    <span className="text-sm text-white/60">
                      Shortlist &amp; interviews
                    </span>
                  </div>
                </div>
                {[
                  {
                    number: "03",
                    title: "Sprint delivery",
                    detail: "Weekly demos",
                  },
                  {
                    number: "04",
                    title: "Launch & support",
                    detail: "Release & hand-over",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex h-[86px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-medium text-white/60">
                      {step.number}
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                        {step.title}
                      </span>
                      <span className="text-sm text-white/60">
                        {step.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </Section>

          <Section
            id="badges"
            number="08"
            title="Badges, tags & avatars"
            note="Consistent roles · explicit status labels"
          >
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.25fr_1fr_0.9fr]">
              <Panel className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-7 items-center justify-center rounded-full border border-purple-300/50 bg-[#9747ff] px-4 text-xs font-semibold leading-[18px] text-purple-100">
                    OUR PROCESS
                  </span>
                  {["React", "Flutter"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex h-6 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2 text-[11px] font-medium leading-4 text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-6 items-center justify-center rounded-full border border-[#02ffe2]/30 bg-[#02ffe2]/10 px-3 text-[11px] font-medium leading-4 text-[#02ffe2]">
                    Admin
                  </span>
                  <span className="inline-flex h-6 items-center justify-center rounded-full border border-[#9747ff]/40 bg-[#9747ff]/[0.18] px-3 text-[11px] font-medium leading-4 text-purple-200">
                    Mentor
                  </span>
                  <span className="inline-flex h-6 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 text-[11px] font-medium leading-4 text-blue-300">
                    CoDev
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-6 items-center justify-center rounded-full border border-[#4bce97]/30 bg-[#4bce97]/10 px-3 text-xs leading-[18px] text-[#7be0b6]">
                    Available
                  </span>
                  <span className="inline-flex h-6 items-center justify-center rounded-full border border-[#d45454]/30 bg-[#d45454]/10 px-3 text-xs leading-[18px] text-[#f08a8a]">
                    Busy
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9747ff] text-[11px] font-medium leading-4 text-white">
                    12
                  </span>
                  <span className="inline-flex h-6 items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-[#02ffe2]" />
                    <span className="text-sm text-[#02ffe2]">Verified</span>
                  </span>
                  <Stars />
                </div>
              </Panel>

              <Panel className="flex flex-col gap-5">
                <GroupLabel>Avatar sizes</GroupLabel>
                <div className="flex flex-wrap items-end gap-6">
                  {[
                    {
                      size: "h-8 w-8",
                      text: "text-xs",
                      initial: "AG",
                      gradient: "from-[#9747ff] to-[#c108fe]",
                    },
                    {
                      size: "h-10 w-10",
                      text: "text-xs",
                      initial: "AG",
                      gradient: "from-[#00738b] to-[#0a3b9d]",
                    },
                    {
                      size: "h-14 w-14",
                      text: "text-[17px]",
                      initial: "AG",
                      gradient: "from-[#9747ff] to-[#c108fe]",
                    },
                    {
                      size: "h-[72px] w-[72px]",
                      text: "text-[17px]",
                      initial: "AG",
                      gradient: "from-[#0c3fdb] to-[#02ffe2]",
                    },
                  ].map((avatar) => (
                    <span
                      key={avatar.size}
                      className={`flex items-center justify-center rounded-full bg-gradient-to-b font-semibold text-white ${avatar.size} ${avatar.text} ${avatar.gradient}`}
                    >
                      {avatar.initial}
                    </span>
                  ))}
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  32 · 40 · 56 · 72px
                  <br />
                  Gradient initials or cropped photo.
                  <br />
                  Online status is optional.
                </p>
              </Panel>

              <Panel className="flex flex-col gap-5">
                <GroupLabel>Avatar stack</GroupLabel>
                <div className="flex items-center">
                  {["MS", "JR", "AG", "JD"].map((initials) => (
                    <span
                      key={initials}
                      className="-ml-2.5 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#030303] bg-gradient-to-b from-[#00738b] to-[#0a3b9d] text-xs leading-[18px] text-white first:ml-0"
                    >
                      {initials}
                    </span>
                  ))}
                  <span className="-ml-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-[#030303] bg-[#121214] text-xs leading-[18px] text-purple-200">
                    +96
                  </span>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  40px avatars · 3px ring
                  <br />
                  10px overlap · editable count
                </p>
              </Panel>
            </div>
          </Section>

          <Section
            id="cards"
            number="09"
            title="Cards"
            note="Glass by default · solid for media · brand panel once per page"
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex flex-col gap-3">
                <div className="relative flex h-[300px] flex-col justify-end gap-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 70% 0%, rgba(151,71,255,0.4), transparent 60%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(244,244,244,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                      maskImage:
                        "linear-gradient(to top, black, transparent 70%)",
                      WebkitMaskImage:
                        "linear-gradient(to top, black, transparent 70%)",
                    }}
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/40 bg-[#9747ff] text-white">
                    <Monitor className="h-[18px] w-[18px]" />
                  </span>
                  <span className="relative text-xs font-semibold uppercase leading-[18px] tracking-[0.2em] text-white/60">
                    Engineering
                  </span>
                  <h3 className="relative text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
                    Web App Development
                  </h3>
                  <p className="relative text-sm text-white/60">
                    Fast, scalable web products.
                  </p>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Service · r24 · editable specimen
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex h-[300px] flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70">
                    <Rocket className="h-[18px] w-[18px]" />
                  </span>
                  <span className="bg-gradient-to-b from-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold leading-[48px] text-transparent">
                    120+
                  </span>
                  <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                    Projects shipped
                  </span>
                  <p className="text-sm leading-5 text-white/60">
                    Web, mobile and AI products launched for clients.
                  </p>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Stat · r24 · editable specimen
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex h-[300px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-b from-[#00738b] to-[#0a3b9d]">
                    <span className="text-5xl font-bold leading-[48px] text-white">
                      MS
                    </span>
                    <span className="inline-flex h-6 items-center justify-center rounded-full border border-purple-400/50 bg-[#9747ff] px-3 text-[11px] font-medium leading-4 text-purple-200">
                      Mentor
                    </span>
                    <div className="w-[calc(100%-48px)] rounded-xl border border-white/10 bg-neutral-950/90 p-3">
                      <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                        Maria Santos
                      </p>
                      <p className="text-sm text-white/60">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>
                  <div className="flex h-16 items-center gap-2 p-3">
                    <span className="text-sm text-white/60">
                      Mentors the web track
                    </span>
                    <BadgeCheck className="ml-auto h-4 w-4 text-[#02ffe2]" />
                    <Monitor className="h-4 w-4 text-white/60" />
                  </div>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Member · r24 · editable specimen
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex h-[300px] flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#9747ff] to-[#c108fe] text-[17px] font-semibold leading-6 text-white">
                      AG
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                        Ana Garcia
                      </span>
                      <span className="text-sm text-white/60">
                        Product Designer
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Figma", "UI/UX", "Design Systems"].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex h-6 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2 text-[11px] font-medium leading-4 text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 items-center justify-center rounded-full border border-[#4bce97]/30 bg-[#4bce97]/10 px-3 text-xs leading-[18px] text-[#7be0b6]">
                      Available
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-sm text-purple-300">
                      View profile
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Developer · r24 · editable specimen
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1.05fr]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-[#121214] p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#00738b] to-[#0a3b9d] text-xs leading-[18px] text-white">
                      CN
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                        Client Name
                      </span>
                      <span className="text-sm text-white/60">
                        Founder, Partner Company
                      </span>
                    </div>
                  </div>
                  <p className="text-lg leading-7 text-white/75">
                    “One concrete outcome from working with Codebility.”
                  </p>
                  <div className="flex items-center gap-4">
                    <Stars />
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="h-2 w-6 rounded-full bg-[#9747ff]" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                      <span className="h-2 w-2 rounded-full bg-white/25" />
                    </div>
                  </div>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Quote · featured · glow-lg
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10">
                  {["Zwift Tech", "Fixflow AI", "Netmedia", "Travel Tribe"].map(
                    (logo, index) => (
                      <div
                        key={logo}
                        className={`flex h-24 items-center justify-center border-white/10 px-4 ${
                          index === 1 ? "bg-[#9747ff]" : "bg-white/[0.02]"
                        } ${index < 2 ? "border-b" : ""} ${
                          index % 2 === 0 ? "border-r" : ""
                        }`}
                      >
                        <span
                          className={`text-center text-sm font-semibold uppercase tracking-[0.16em] ${
                            index === 1 ? "text-white" : "text-white/60"
                          }`}
                        >
                          {logo}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  Logo cell · original marks · color on hover
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="relative flex h-[260px] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-purple-300/30 bg-white/[0.03] p-8 text-center">
                  <div
                    aria-hidden
                    className="absolute inset-x-10 top-0 h-24 rounded-full bg-[#9747ff]/25 blur-3xl"
                  />
                  <span className="relative inline-flex h-7 items-center justify-center rounded-full border border-purple-300/50 bg-[#9747ff] px-4 text-xs font-semibold leading-[18px] text-purple-100">
                    BE A CODEV
                  </span>
                  <span className="relative text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
                    Join 100+ developers
                  </span>
                  <span className="relative text-sm text-white/60">
                    Real projects, mentors, global work.
                  </span>
                  <span className="relative inline-flex h-10 items-center justify-center rounded-full bg-[#9747ff] px-[18px] text-[15px] leading-5 text-white">
                    Join the Program
                  </span>
                </div>
                <p className="text-xs leading-[18px] text-white/60">
                  CTA panel · one primary action
                </p>
              </div>
            </div>
          </Section>

          <Section
            id="patterns-icons"
            number="10"
            title="Section pattern & icons"
            note="Shared hierarchy · Lucide vectors"
          >
            <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
              <Panel className="flex flex-col gap-4">
                <span className="inline-flex h-7 w-fit items-center justify-center rounded-full border border-purple-300/50 bg-[#9747ff] px-4 text-xs font-semibold leading-[18px] text-purple-100">
                  WHAT WE BUILD
                </span>
                <h3 className="text-[32px] font-bold leading-9 tracking-tight text-[#f4f4f4] md:text-[44px] md:leading-[48px]">
                  Strategy, design and engineering
                </h3>
                <h3 className="bg-gradient-to-b from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-[32px] font-bold leading-9 tracking-tight text-transparent md:text-[44px] md:leading-[48px]">
                  under one roof
                </h3>
                <p className="max-w-[54ch] text-lg leading-7 text-white/60">
                  Lead sentence: one line that explains the section in plain
                  words.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#9747ff] px-[18px] text-[15px] leading-5 text-white">
                    Primary action
                  </span>
                  <span className="inline-flex h-10 items-center justify-center rounded-full border border-white/30 px-[18px] text-[15px] leading-5 text-[#f4f4f4]">
                    Secondary
                  </span>
                </div>
              </Panel>

              <Panel className="flex flex-col gap-6">
                <GroupLabel>Lucide · 2px stroke</GroupLabel>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
                  {iconSpecimens.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-3"
                      >
                        <Icon
                          className="h-6 w-6 text-white/70"
                          strokeWidth={2}
                        />
                        <span className="text-center text-xs leading-[18px] text-white/60">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/40 bg-[#9747ff] text-white">
                    <Sparkles className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70">
                    <Sparkles className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70">
                    <Sparkles className="h-[18px] w-[18px]" />
                  </span>
                </div>

                <p className="text-xs leading-[18px] text-white/60">
                  16px in buttons · 18px in UI · 24px standalone
                  <br />
                  44px tile · r12 or full · swap icons through properties
                </p>
              </Panel>
            </div>
          </Section>

          <Section
            id="rules"
            number="11"
            title="Rules"
            note="Shared decisions for design and implementation"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rules.map((rule) => (
                <Panel key={rule.number} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9747ff] text-sm font-medium text-purple-100">
                      {rule.number}
                    </span>
                    <h3 className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
                      {rule.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-5 text-white/60">{rule.body}</p>
                  <p className="text-sm leading-5 text-[#7be0b6]">
                    ✓ {rule.good}
                  </p>
                  <p className="text-sm leading-5 text-[#f08a8a]">
                    × {rule.bad}
                  </p>
                </Panel>
              ))}
            </div>

            <Panel className="flex flex-col gap-4">
              <GroupLabel>Handoff</GroupLabel>
              <p className="max-w-[100ch] text-base leading-6 text-white/70">
                Design components are editable and token-bound. Implement
                keyboard behavior, HTML semantics, responsive breakpoints and
                reduced-motion rules in the website. Optimize images at their
                rendered sizes.
              </p>
              <p className="text-sm leading-5 text-white/60">
                Source: codebility-design-system-v2.html + logo.svg. Local CSS
                names are documented in component descriptions; there is no
                application component repository here to connect with Code
                Connect.
              </p>
            </Panel>
          </Section>
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <Wordmark className="h-6 w-auto" />
          <p className="text-xs leading-[18px] text-white/60">
            Codebility Design System v2.0 · November 2026 · Dark only
          </p>
        </footer>
      </div>
    </main>
  );
}

export default DesignSystemPage;
