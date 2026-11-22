import { cn } from "@codevs/ui";

export interface NdaTermsProps {
  formattedDate?: string;
  className?: string;
}

export function NdaTerms({ formattedDate, className }: NdaTermsProps) {
  return (
    <div className={cn("space-y-4 text-[13px] leading-5", className)}>
      <h2 className="text-xl font-bold">COMPANY NDA</h2>

      <p className="font-semibold text-green-500">CODEBILITY</p>

      <h3 className="font-bold">TERMS OF AGREEMENT</h3>
      <p>
        {formattedDate
          ? `This agreement is created on ${formattedDate} and remains in effect indefinitely.`
          : "This agreement remains in effect indefinitely."}{" "}
        The Intern has the flexibility to conclude their tenure at any point,
        subject to the conditions outlined in Termination of Agreement.
      </p>

      <h3 className="font-bold">
        CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):
      </h3>
      <p>
        A. The Intern agrees not to disclose, divulge, reveal, report or use,
        for any purpose, any confidential information of Codebility, which the
        Intern has obtained, or which was disclosed to the Intern by Codebility
        because of this Agreement.
      </p>
      <p>
        B. &quot;Confidential Information&quot; refers to any data or
        information relating to the business by Codebility that is not
        generally known to the public and that, if disclosed, could reasonably
        be expected to cause harm to Codebility.
      </p>

      <h3 className="font-bold">INTELLECTUAL PROPERTY</h3>
      <p>
        The Intern acknowledges and agrees that any intellectual property
        provided by Codebility during the internship will remain the exclusive
        property of the Company.
      </p>

      <h3 className="font-bold">AGREEMENT</h3>
      <p>
        This Agreement contains the entire agreement between the parties and
        supersedes any prior written or oral agreements between them concerning
        the subject matter of this Agreement.
      </p>
    </div>
  );
}
