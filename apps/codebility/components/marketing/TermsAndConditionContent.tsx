import {
  TERMS_INTRO,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/constants/global/terms-and-conditions";

export function TermsAndConditionContent() {
  return (
    <div className="bg-black-800 flex max-h-[540px] flex-col gap-5 overflow-y-auto p-4 text-white">
      <p className="self-end text-xs italic text-[#898989] sm:text-sm">
        Last Updated: {TERMS_LAST_UPDATED}
      </p>
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-sm font-semibold sm:text-base">
          Welcome to Codebility
        </h2>
        <p className="text-sm text-[#898989] sm:text-base">{TERMS_INTRO}</p>
      </div>
      {TERMS_SECTIONS.map((section, index) => (
        <div
          key={section.id}
          id={section.id}
          className="flex flex-col gap-[10px]"
        >
          <h2 className="text-sm font-semibold sm:text-base">
            {index + 1}. {section.title}
          </h2>
          <div className="text-sm text-[#898989] sm:text-base">
            {section.clauses.map((clause, clauseIndex) => (
              <p key={clause}>
                {index + 1}.{clauseIndex + 1} {clause}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
