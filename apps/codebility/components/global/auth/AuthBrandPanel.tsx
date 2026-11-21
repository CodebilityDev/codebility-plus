import { AvatarStack } from "@/components/global/design-system/AvatarStack";
import { cn } from "@codevs/ui";
import { getLandingTeamData } from "@/lib/global/landing-people";
import type { AvatarStackItem } from "@/components/global/design-system/AvatarStack";

const fallbackAvatars: AvatarStackItem[] = [
  { initials: "JT", gradient: "violet" },
  { initials: "AD", gradient: "teal" },
  { initials: "MC", gradient: "cyan" },
  { initials: "JG", gradient: "violet" },
  { initials: "JL", gradient: "teal" },
];

export async function AuthBrandPanel({ className }: { className?: string }) {
  let avatars = fallbackAvatars;

  try {
    const data = await getLandingTeamData();
    const members = data.all.filter((member) => member.imageSrc).slice(0, 5);

    if (members.length > 0) {
      avatars = members.map((member) => ({
        initials: member.initials,
        src: member.imageSrc,
        alt: member.name,
      }));
    }
  } catch {
    avatars = fallbackAvatars;
  }
  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/10 p-8 pb-6 text-white xl:p-14 xl:pb-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(150deg,#0b1522_0%,#101827_32%,#2b1754_68%,#5b21b6_100%)]"
      />
      <div
        aria-hidden
        className="absolute -left-40 top-0 h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.11)_0%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-[-12rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.28)_0%,transparent_68%)]"
      />

      <div className="relative flex h-full w-full flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          Codebility
        </p>

        <h2 className="mt-6 max-w-[520px] text-[44px] font-bold leading-[1.12] tracking-[-0.04em] xl:text-[54px]">
          <span className="block">Everyone has the</span>
          <span className="block">ability to code.</span>
        </h2>

        <p className="mt-5 max-w-[480px] text-[17px] leading-7 text-white/65">
          Sign in to pick up your projects, tasks and team where you left off.
        </p>

        <div className="mt-8 flex items-start gap-12">
          <div>
            <p className="bg-gradient-to-r from-[#d8b4fe] to-[#a78bfa] bg-clip-text text-[38px] font-bold leading-none tracking-[-0.04em] text-transparent">
              100+
            </p>
            <p className="mt-2 text-[13px] text-white/50">CoDevs</p>
          </div>
          <div>
            <p className="bg-gradient-to-r from-[#93c5fd] to-[#60a5fa] bg-clip-text text-[38px] font-bold leading-none tracking-[-0.04em] text-transparent">
              120+
            </p>
            <p className="mt-2 text-[13px] text-white/50">Projects delivered</p>
          </div>
        </div>

        <div className="mt-auto w-full pt-16">
          <div className="flex min-h-[104px] w-full items-center gap-4 rounded-[18px] border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
            <AvatarStack items={avatars} max={5} size={40} />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-5">
                Built by Filipino developers
              </p>
              <p className="mt-0.5 max-w-[300px] text-[12px] leading-[18px] text-white/55">
                Interns, CoDevs and mentors working on real client projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}