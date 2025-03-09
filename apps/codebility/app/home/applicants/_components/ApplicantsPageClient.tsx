"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchApplicants } from "@/app/home/applicants/action";
import ApplicantsLoading from "@/app/home/applicants/loading";
import { Codev } from "@/types/home/codev";

const ApplicantsList = dynamic(
  () => import("@/app/home/applicants/_components/ApplicantsList"),
  { loading: () => <ApplicantsLoading /> },
);

const ApplicantsPageClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicants, setApplicants] = useState<Codev[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApplicants = async () => {
      setIsLoading(true);
      try {
        const { applicants, error } = await fetchApplicants();

        if (error) setError(error);
        else setApplicants(applicants);
      } catch (err) {
        setError("Unable to fetch applicants");
      } finally {
        setIsLoading(false);
      }
    };

    getApplicants();
  }, []);

  if (isLoading) return <ApplicantsLoading />;
  if (error) return <div className="text-red-500">ERROR: {error}</div>;

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <ApplicantsList applicants={applicants} />
    </div>
  );
};

export default ApplicantsPageClient;
