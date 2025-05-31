import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { CertificateProps } from "@/types/home/codev";
import { BookDown } from "lucide-react";

import Certificate, { handleDownload } from "./DashboardDownloadCertificate";

type Props = {
  user: {
    first_name: string;
    last_name: string;
  };
};

const DashboardCertificate = ({ user }: Props) => {
  const certRef = useRef<HTMLDivElement>(null);
  // Dummy data for the certificate
  // This should be replaced with actual data from the database
  const fullName = `${user.first_name} ${user.last_name}`;
  const certDummyData: CertificateProps = {
    background: "/assets/images/bg-certificate.png",
    logo: "/assets/images/codebility.png",
    name: fullName ?? "Intern",
    course: "Frontend Developer Training Program",
    date_from: "March 1, 2025",
    date_to: "May 1, 2025",
    description:
      "demonstrated a commitment to learning and growth and has mastered key skills in modern web technologies, including frameworks like NEXTJS, version control with Git, and the ability to create responsive and accessible web applications.",
    key_projects: [
      "Responsive Deadpool and Wolverine Website",
      "E-commerce Storefront",
    ],
    signature: "/assets/images/signature1.png",
    // signature_name: "Jzeff Kendrew Somera",
    // signature_title: "C.E.O / Founder of Codebility",
  };
  return (
    <>
      <div className="absolute left-4 top-4">
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "1000px",
            height: "700px",
            overflow: "hidden",
            zIndex: -1,
          }}
        >
          <Certificate {...certDummyData} ref={certRef} />
        </div>
        <Button
          className="md:p-15 md:w-15 h-6 w-10 p-2"
          onClick={() => handleDownload(certRef, certDummyData.name)}
        >
          <BookDown />
        </Button>
      </div>
    </>
  );
};

export default DashboardCertificate;
