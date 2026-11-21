import { Avatar } from "@/components/global/design-system/Avatar";
import type { AvatarStackItem } from "@/components/global/design-system/AvatarStack";
import { cn } from "@codevs/ui";
import { getLandingTeamData } from "@/lib/global/landing-people";

const fallbackAvatars: AvatarStackItem[] = [
  { initials: "JT", gradient: "violet" },
  { initials: "AD", gradient: "teal" },
  { initials: "MC", gradient: "cyan" },
  { initials: "JG", gradient: "violet" },
  { initials: "JL", gradient: "teal" },
];

const signupSteps = [
  {
    number: "01",
    title: "Apply",
    description: "Create your account and tell us what you build with.",
  },
  {
    number: "02",
    title: "Review",
    description: "Our team reviews your profile and gets back to you by email.",
  },
  {
    number: "03",
    title: "Onboarding",
    description: "Meet your mentors and join your first real project.",
  },
];

export async function AuthBrandPanel({
  className,
  variant = "signin",
}: {
  className?: string;
  variant?: "signin" | "signup";
}) {
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

  const isSignup = variant === "signup";

  return (
    <aside
      className={cn(
        "relative overflow-hidden rounded-[var(--cb-auth-panel-radius)] p-8 pb-6 text-white [background:var(--cb-auth-panel-gradient)] xl:p-14 xl:pb-6",
        className,
      )}
    >
      <div className="relative flex h-full w-full flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          {isSignup ? "Join as a Codev" : "Codebility"}
        </p>

        <h2 className="mt-6 max-w-[520px] text-[44px] font-bold leading-[1.12] tracking-[-0.04em] xl:text-[54px]">
          <span className="block">Everyone has the</span>
          <span
            className={cn(
              "block",
              isSignup &&
                "bg-gradient-to-r from-[#A5F3FC] to-[#67E8F9] bg-clip-text text-transparent",
            )}
          >
            ability to code.
          </span>
        </h2>

        <p className="mt-5 max-w-[480px] text-[17px] leading-7 text-white/65">
          {isSignup
            ? "Apply once and our team reviews every application."
            : "Sign in to pick up your projects, tasks and team where you left off."}
        </p>

        {isSignup ? (
          <ol className="mt-10 flex flex-col gap-6">
            {signupSteps.map((step) => (
              <li key={step.number} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[11px] font-medium text-white/55">
                  {step.number}
                </span>
                <div>
                  <p className="text-[16px] font-semibold leading-5 text-[#F4F4F4]">
                    {step.title}
                  </p>
                  <p className="mt-1 max-w-[390px] text-[14px] leading-[18px] text-white/55">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
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
        )}

        <div className="mt-auto w-full pt-16">
          <div className="flex h-[var(--cb-community-card-height)] w-full items-center rounded-[var(--cb-community-card-radius)] border border-white/[0.06] bg-[var(--cb-community-card-bg)] px-6 backdrop-blur-sm">
            <div role="group" aria-label="Codebility team" className="flex items-center">
              {avatars.slice(0, 5).map((avatar, index) => (
                <span
                  key={`${avatar.initials}-${index}`}
                  className={cn(
                    "relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[var(--cb-community-avatar-border)]",
                    index > 0 && "-ml-3",
                  )}
                >
                  <Avatar {...avatar} size={40} className="block" />
                </span>
              ))}
            </div>
            <div className="ml-[18px] min-w-0 max-w-[346px]">
              <p className="text-[16px] font-semibold leading-5 text-[#F4F4F4]">
                {isSignup ? "100+ CoDevs already in" : "Built by Filipino developers"}
              </p>
              <p className="mt-[1px] text-[14px] leading-[18px] text-[var(--cb-community-text-muted)]">
                Interns, CoDevs and mentors working on real client projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
