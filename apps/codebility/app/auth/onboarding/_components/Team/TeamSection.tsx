// app/auth/onboarding/_components/Team/TeamSection.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Person = {
  name: string;
  role: string;
  image?: string; // optional; show initials if missing
};

const CEO: Person = {
  name: "Jzeff Kendrew Somera",
  role: "CEO / Founder",
  image: "", // e.g. "/assets/images/team/ceo.png"
};

const ADMINS: Person[] = [
  { name: "Kyla Ronquillo", role: "Project Manager" },
  { name: "Thea Somera", role: "Admin" },
  { name: "Reyniel Magparangalan", role: "Admin" },
  { name: "Charles Lloyd Adecer", role: "Admin" },
  { name: "Jkoinonia Go", role: "Admin" },
  { name: "Christian Timothy Santiago", role: "Admin" },
  { name: "Kailah Laron", role: "Admin" },
  { name: "Jamie Tolentino", role: "Admin" },
  { name: "Alec Gilo", role: "Admin" },
  { name: "Jan Ralph Placido", role: "Admin" },
  { name: "Name 1", role: "Job Title" },
  { name: "Name 2", role: "Job Title" },
];

const MENTORS: Person[] = [
  { name: "Jade Barry Lazo", role: "Full Stack Developer" },
  { name: "Arlie Torres", role: "Full Stack Developer" },
  { name: "Jason Kean Tajor", role: "UI/UX Designer" },
  { name: "Khalid SanggoYod", role: "Full Stack Developer" },
  { name: "Jan Phillip Dacallos", role: "Full Stack Developer" },
  { name: "Rovic", role: "UI/UX Designer" },
  { name: "David Tribugenia", role: "Project Manager" },
];

// —————————————————————————————————————————————

function Avatar({ person, size = 72 }: { person: Person; size?: number }) {
  const initials = person.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return person.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={person.image}
      alt={person.name}
      className="h-18 w-18 rounded-full object-cover shadow-md ring-2 ring-white/60"
      style={{ height: size, width: size }}
      loading="lazy"
    />
  ) : (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-white text-slate-800 shadow-md ring-2 ring-slate-300",
      )}
      style={{ height: size, width: size }}
      aria-hidden
    >
      <span className="text-xl font-bold">{initials}</span>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-4",
        "shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar person={person} size={56} />
        <div className="min-w-0">
          <h4 className=" text-sm font-semibold text-slate-800">
            {person.name}
          </h4>
          <p className="truncate text-xs text-slate-500">{person.role}</p>
        </div>
      </div>

      {/* subtle accent line */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 opacity-70" />
    </div>
  );
}

// —————————————————————————————————————————————

export default function TeamSection() {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        // light motif pulled from your light sections
        "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        "py-16 sm:py-20 lg:py-24",
      )}
    >
      {/* soft decor blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet the <span className="text-pink-600">TEAM</span>
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            The people behind Codebility — admins, mentors, and leadership.
          </p>
        </header>

        {/* Layout: mobile stacks with order; lg = 3 columns */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Admins (left on desktop, 2nd on mobile) */}
          <div className="order-2 lg:order-1">
            <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-slate-800">
              Admins
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ADMINS.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </div>

          {/* CEO (center on desktop, 1st on mobile) */}
          <div className="order-1 lg:order-2">
            <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-slate-800">
              CEO
            </h3>
            <div className="relative isolate overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-6 w-fit">
                <Avatar person={CEO} size={140} />
              </div>
              <h4 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {CEO.name}
              </h4>
              <p className="mt-1 text-sm text-slate-500">{CEO.role}</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
                Vision, mentorship, and the push to build real‑world skills.
              </p>

              {/* glow ring */}
              <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/20 to-emerald-400/20 blur-xl" />
            </div>
          </div>

          {/* Mentors (right on desktop, 3rd on mobile) */}
          <div className="order-3 lg:order-3">
            <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-slate-800">
              Mentors
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MENTORS.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </div>
        </div>

        {/* bottom divider accent */}
        <div className="mx-auto mt-12 h-px max-w-7xl bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>
    </section>
  );
}
