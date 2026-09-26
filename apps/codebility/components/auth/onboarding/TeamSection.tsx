"use client";

import { useEffect, useState } from "react";

import { getTeamData } from "@/actions/auth/onboarding/onboarding-team";
import { PersonCard } from "@/components/auth/onboarding/PersonCard";
import { TeamSectionAvatar } from "@/components/auth/onboarding/TeamSectionAvatar";
import type { Person } from "@/types/auth/onboarding/onboarding";


// -------------------------
// TeamSection
// -------------------------
export default function TeamSection() {
  const [admins, setAdmins] = useState<Person[]>([]);
  const [mentors, setMentors] = useState<Person[]>([]);
  const [ceo, setCeo] = useState<Person>({
    name: "CEO Name",
    role: "Founder / CEO",
    image: undefined
  });
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErrMsg(null);

      try {
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
                <TeamSectionAvatar person={ceo} size={140} />
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
