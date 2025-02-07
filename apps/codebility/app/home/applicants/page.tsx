import ApplicantsList from "@/app/home/applicants/_components/applicants-list";
import { getCodevs } from "@/lib/server/codev.service";

const ApplicantsPage = async () => {
  const { data: applicants, error } = await getCodevs({
    filters: {
      role_id: 7,
      application_status: "applying",
    },
  });

  // Handle error scenario
  if (error) {
    console.error("Error fetching applicants:", error);
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
        <div>ERROR: Unable to fetch applicants</div>
      </div>
    );
  }

  // Ensure applicants is always an array
  const safeApplicants = applicants || [];

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 ">
      <ApplicantsList applicants={safeApplicants} />
    </div>
  );
};

export default ApplicantsPage;
