import H1 from "@/components/global/layout/H1";
import { ApplicantsTableSkeleton } from "@/components/home/applicants/ApplicantsTableSkeleton";

export default function ApplicantsLoading() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <H1>Applicants Management</H1>
        <ApplicantsTableSkeleton />
      </div>
    </div>
  );
}
