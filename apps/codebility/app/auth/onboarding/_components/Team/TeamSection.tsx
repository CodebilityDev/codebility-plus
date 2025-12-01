// onboarding/components/TeamSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getTeamData } from "./actions";

// -------------------------
// Types
// -------------------------
type Person = {
  name: string;
  role: string;
  image?: string;
};
<<<<<<< HEAD

interface TeamResponse {
  ADMINS?: Person[];
  MENTORS?: Person[];
  CEO?: Person | null;
  error?: string;
}
=======
>>>>>>> 10e4b1e1fb38e31ee56d942c6143a8118e265af8

// -------------------------
// Avatar
// -------------------------
function Avatar({
  person,
  size = 72,
  position = "center top"
}: {
  person: Person;
  size?: number;
  position?: string;
}) {
  const initials = (person.name || "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  return person.image ? (
    <div
      className="rounded-full shadow-md ring-2 ring-white/20 overflow-hidden flex-shrink-0 relative bg-gray-200"
      style={{ height: size, width: size, minWidth: size, minHeight: size }}
    >
      <img
        src={person.image}
        alt={person.name}
        className="absolute top-1/2 left-1/2 object-cover"
        style={{
          objectPosition: position,
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          transform: "translate(-50%, -50%)",
          minWidth: `${size * 1.2}px`,
          minHeight: `${size * 1.2}px`
        }}
        loading="lazy"
      />
    </div>
  ) : (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-white/10 text-white shadow-md ring-2 ring-white/15 flex-shrink-0"
      )}
      style={{ height: size, width: size, minWidth: size, minHeight: size }}
      aria-hidden
    >
      <span className="text-xl font-bold">{initials}</span>
    </div>
  );
}

// -------------------------
// PersonCard
// -------------------------
function PersonCard({ person }: { person: Person }) {
  return (
<<<<<<< HEAD
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border",
        "border-white/10 bg-white/[0.06] p-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md",
        "transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/20"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar person={person} size={56} />
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white/90">{person.name}</h4>
          <p className="truncate text-xs text-white/60">{person.role}</p>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 opacity-70" />
=======
    <div className="flex flex-col items-center gap-2 text-center">
      <Avatar person={person} size={80} />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-white/90">{person.name}</h4>
        <p className="truncate text-xs text-white/60">{person.role}</p>
      </div>
>>>>>>> 10e4b1e1fb38e31ee56d942c6143a8118e265af8
    </div>
  );
}

// -------------------------
// TeamSection
// -------------------------
export default function TeamSection() {
  const [admins, setAdmins] = useState<Person[]>([]);
  const [mentors, setMentors] = useState<Person[]>([]);
  const [ceo, setCeo] = useState<Person>({
    name: "CEO Name",
    role: "Founder / CEO",
<<<<<<< HEAD
    image: ""
=======
    image: undefined
>>>>>>> 10e4b1e1fb38e31ee56d942c6143a8118e265af8
  });
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErrMsg(null);

      try {
<<<<<<< HEAD
        const res = await fetch("/api/team");

        let body: TeamResponse;
        try {
          body = (await res.json()) as TeamResponse;
        } catch {
          body = {} as TeamResponse;
        }

        if (!res.ok) {
          throw new Error(body.error ?? `Fetch failed (${res.status})`);
        }

        if (!mounted) return;

        const adminsList = Array.isArray(body.ADMINS) ? body.ADMINS : [];
        const mentorsList = Array.isArray(body.MENTORS) ? body.MENTORS : [];

        // Set CEO directly from API response
        if (body.CEO) {
          setCeo(body.CEO);
        }

        setAdmins(adminsList);
        setMentors(mentorsList);
=======
        const result = await getTeamData();

        if (!mounted) return;

        if (!result.success) {
          throw new Error("Failed to load team data");
        }

        setAdmins(result.admins);
        setMentors(result.mentors);
        if (result.ceo) {
          setCeo(result.ceo);
        }
>>>>>>> 10e4b1e1fb38e31ee56d942c6143a8118e265af8
      } catch (err: any) {
        console.error("Error loading team:", err);
        if (mounted) setErrMsg(err?.message ?? "Failed to load team");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
          <h2 className="text-3xl font-black tracking-tight text-purple-500 sm:text-4xl lg:text-5xl">
            Meet the{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-teal-600 bg-clip-text text-transparent">
              TEAM
            </span>
          </h2>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            The people behind Codebility — admins, mentors, and leadership.
          </p>
        </header>

        {errMsg && (
          <div className="mx-auto mb-8 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
            {errMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white/60">Loading team members...</div>
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-white/85">Admins</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {admins.length > 0 ? (
                  admins.map((p, idx) => <PersonCard key={`${p.name}-${idx}`} person={p} />)
                ) : (
                  <div className="col-span-full text-center text-white/50">No admins available</div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-white/85">CEO</h3>
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar person={ceo} size={140} />
                <div>
                  <h4 className="text-2xl font-extrabold tracking-tight text-white/90">{ceo.name}</h4>
                  <p className="mt-1 text-sm text-white/60">{ceo.role}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-center text-lg font-bold tracking-tight text-white/85">Mentors</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {mentors.length > 0 ? (
                  mentors.map((p, idx) => <PersonCard key={`${p.name}-${idx}`} person={p} />)
                ) : (
                  <div className="col-span-full text-center text-white/50">No mentors available</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
