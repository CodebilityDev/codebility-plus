const steps = ["Account", "Profile", "About & links", "Agreements"];

export function SignUpProgress({ step }: { step: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number <= step;

        return (
          <div key={label} className="flex flex-col gap-2">
            <span
              className={
                complete
                  ? "h-1 w-full rounded-full bg-[#9747ff]"
                  : "h-1 w-full rounded-full bg-white/10"
              }
            />
            <span
              className={
                complete
                  ? "text-[11px] leading-4 text-white/80"
                  : "text-[11px] leading-4 text-white/35"
              }
            >
              {number}. {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
