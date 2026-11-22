import {
  TERMS_INTRO,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from "@/constants/global/terms-and-conditions";

export function TermsAndConditionContent({
  variant = "default",
}: {
  variant?: "default" | "document";
}) {
  const document = variant === "document";
  return (
    <div
      className={
        document
          ? "privacy-terms-body"
          : "bg-black-800 flex max-h-[540px] flex-col gap-5 overflow-y-auto p-4 text-white"
      }
      role={document ? "region" : undefined}
      aria-label={document ? "Terms and conditions text" : undefined}
      tabIndex={document ? 0 : undefined}
    >
      {!document && (
        <p className="self-end text-xs italic text-[#898989] sm:text-sm">
          Last Updated: {TERMS_LAST_UPDATED}
        </p>
      )}
      <section
        className={
          document ? "privacy-terms-section" : "flex flex-col gap-[10px]"
        }
      >
        <h2
          className={
            document
              ? "privacy-terms-heading"
              : "text-sm font-semibold sm:text-base"
          }
        >
          Welcome to Codebility
        </h2>
        <p
          className={
            document
              ? "privacy-terms-copy"
              : "text-sm text-[#898989] sm:text-base"
          }
        >
          {TERMS_INTRO}
        </p>
      </section>
      {TERMS_SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={
            document ? "privacy-terms-section" : "flex flex-col gap-[10px]"
          }
        >
          <h2
            className={
              document
                ? "privacy-terms-heading"
                : "text-sm font-semibold sm:text-base"
            }
          >
            {index + 1}. {section.title}
          </h2>
          <div
            className={
              document
                ? "privacy-terms-copy"
                : "text-sm text-[#898989] sm:text-base"
            }
          >
            {section.clauses.map((clause, clauseIndex) => (
              <p key={clause}>
                {index + 1}.{clauseIndex + 1} {clause}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
