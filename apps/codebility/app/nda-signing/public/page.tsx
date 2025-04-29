"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

// Define the validation schema for user information
const UserInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

type UserInfo = z.infer<typeof UserInfoSchema>;

type SignatureCanvasRef = {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, encoderOptions?: number) => string;
};

interface SignaturePadProps {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
  [key: string]: any;
}

const SignaturePad = forwardRef<SignatureCanvasRef, SignaturePadProps>(
  (props, ref) => {
    const [SignatureComponent, setSignatureComponent] = useState<any>(null);

    useEffect(() => {
      import("react-signature-canvas").then((mod) => {
        setSignatureComponent(() => mod.default);
      });
    }, []);

    if (!SignatureComponent) {
      return (
        <div className="flex h-[200px] items-center justify-center border border-gray-300 bg-white">
          <p className="text-gray-500">Loading signature pad...</p>
        </div>
      );
    }

    return <SignatureComponent {...props} ref={ref} />;
  },
);

SignaturePad.displayName = "SignaturePad";

export default function PublicNdaSigningPage() {
  const signatureRef = useRef<SignatureCanvasRef | null>(null);
  const [signing, setSigning] = useState(false);
  const [showNameForm, setShowNameForm] = useState(true);
 

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UserInfo>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const onSubmitUserInfo = (data: UserInfo) => {
    // Store user info in localStorage for later use
    localStorage.setItem("ndaUserFirstName", data.first_name);
    localStorage.setItem("ndaUserLastName", data.last_name);
    setShowNameForm(false);
  };

  const handleSignNda = async () => {
    try {
      if (!signatureRef.current) {
        toast.error("Signature pad not initialized");
        return;
      }

      if (signatureRef.current.isEmpty()) {
        toast.error("Please sign the document before submitting");
        return;
      }

      const first_name = localStorage.getItem("ndaUserFirstName");
      const last_name = localStorage.getItem("ndaUserLastName");

      if (!first_name || !last_name) {
        toast.error("User information is missing. Please provide your name.");
        setShowNameForm(true);
        return;
      }

      setSigning(true);
      const signatureData = signatureRef.current.toDataURL("image/png");

      // --- Begin: Use the correct NDA template for PDF generation ---
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      doc.setFont("times", "normal");
      const pageWidth = doc.internal.pageSize.getWidth();
      const lineWidth = 150;
      const formattedDate = new Date().toLocaleDateString();

      // Page 1
      doc.setFontSize(16);
      doc.text("COMPANY NDA", 20, 20);
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0);
      doc.text("CODEBILITY NDA", 20, 30);
      doc.text("CODEBILITY", 20, 40);
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(14);
      doc.text("TERMS OF AGREEMENT", 20, 55);
      doc.setFontSize(10);
      doc.text(
        `This agreement is created on ${formattedDate} and remains in effect indefinitely. The`,
        20,
        65,
      );
      doc.text(
        "Intern has the flexibility to conclude their tenure at any point, subject to the conditions",
        20,
        75,
      );
      doc.text("outlined in Termination of Agreement.", 20, 85);

      doc.setFontSize(14);
      doc.text("CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):", 20, 100);
      doc.setFontSize(10);
      doc.text(
        "A. The Intern agrees not to disclose, divulge, reveal, report or use, for any purpose, any",
        20,
        110,
      );
      doc.text(
        "confidential information of Codebility, which the Intern has obtained, or which was",
        20,
        120,
      );
      doc.text(
        "disclosed to the Intern by Codebility because of this Agreement. The Intern's obligations",
        20,
        130,
      );
      doc.text(
        "under this Agreement will continue after termination of this Agreement and will be binding",
        20,
        140,
      );
      doc.text(
        "until the Confidential Information becomes public or until Codebility sends the Intern written",
        20,
        150,
      );
      doc.text(
        "notice releasing the Intern from this Agreement, whichever occurs first.",
        20,
        160,
      );

      doc.text(
        "B. Confidential Information refers to any data or information relating to the business",
        20,
        175,
      );
      doc.text(
        "by Codebility that is not generally known to the public and that, if disclosed, could reasonably",
        20,
        185,
      );
      doc.text("be expected to cause harm to Codebility.", 20, 195);

      doc.addPage();

      // Page 2
      doc.setFontSize(14);
      doc.text("INTELLECTUAL PROPERTY", 20, 20);
      doc.setFontSize(10);
      doc.text(
        "The Intern acknowledges and agrees that any intellectual property provided by the",
        20,
        30,
      );
      doc.text(
        "Codebility during the internship will remain the exclusive property of the Company. This",
        20,
        40,
      );
      doc.text(
        "includes, but is not limited to, copyrights, patents, trade secret rights, and any other",
        20,
        50,
      );
      doc.text(
        "intellectual property rights associated with ideas, concepts, techniques, inventions,",
        20,
        60,
      );
      doc.text(
        "processes, works of authorship, confidential information, or trade secrets.",
        20,
        70,
      );

      doc.setFontSize(14);
      doc.text("USAGE RIGHTS", 20, 85);
      doc.setFontSize(10);
      doc.text(
        "The Intern agrees that any work product, including but not limited to written materials,",
        20,
        95,
      );
      doc.text(
        "designs, code, artwork, and any other creations produced during the course of the",
        20,
        105,
      );
      doc.text(
        "internship, shall be the exclusive property of the Company. The Intern grants the Company",
        20,
        115,
      );
      doc.text(
        "the irrevocable, perpetual, worldwide, royalty-free license to use, reproduce, modify, adapt,",
        20,
        125,
      );
      doc.text(
        "publish, translate, distribute, and display such work product in any media or format,",
        20,
        135,
      );
      doc.text(
        "whether now known or hereafter developed, for any purpose related to the business of the",
        20,
        145,
      );
      doc.text(
        "Company, including but not limited to marketing, promotional, and educational purposes.",
        20,
        155,
      );

      doc.text(
        "The Intern acknowledges and agrees that they have no right to further compensation,",
        20,
        170,
      );
      doc.text(
        "attribution, or recognition for the use of their work product beyond the terms of this",
        20,
        180,
      );
      doc.text("Agreement.", 20, 190);

      doc.addPage();

      // Page 3
      doc.setFontSize(14);
      doc.text("TERMINATION", 20, 20);
      doc.setFontSize(10);
      doc.text(
        "Either party may terminate this Agreement at any time by providing 30 days written notice",
        20,
        30,
      );
      doc.text("to the other party.", 20, 40);

      doc.setFontSize(14);
      doc.text("GOVERNING LAW", 20, 55);
      doc.setFontSize(10);
      doc.text(
        "This Agreement shall be governed in all respects by the laws of the Philippines.",
        20,
        65,
      );

      doc.setFontSize(14);
      doc.text("AGREEMENT", 20, 80);
      doc.setFontSize(10);
      doc.text(
        "This Agreement contains the entire agreement between the parties and supersedes any",
        20,
        90,
      );
      doc.text(
        "prior written or oral agreements between them concerning the subject matter of this",
        20,
        100,
      );
      doc.text("Agreement.", 20, 110);

      doc.text(
        "IN WITNESS WHEREOF, the parties hereto have executed this Independent Contractor",
        20,
        125,
      );
      doc.text("Agreement as of the Effective Date.", 20, 135);

      doc.addPage();

      // Page 4: Signatures
      const ceoLineY = 70;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(
        (pageWidth - lineWidth) / 2,
        ceoLineY,
        (pageWidth - lineWidth) / 2 + lineWidth,
        ceoLineY,
      );

      doc.text("CEO/FOUNDER of Codebility", pageWidth / 2, ceoLineY - 30, {
        align: "center",
      });
      doc.text("JZEFF KENDREW F SOMERA", pageWidth / 2, ceoLineY + 15, {
        align: "center",
      });
      doc.text("Signature over Printed Name", pageWidth / 2, ceoLineY + 25, {
        align: "center",
      });
      doc.text(`${formattedDate}`, pageWidth / 2, ceoLineY + 35, {
        align: "center",
      });
      doc.text("Date", pageWidth / 2, ceoLineY + 45, { align: "center" });

      doc.setPage(4);

      const signatureWidth = 70;
      const signatureX = (pageWidth - signatureWidth) / 2;

      doc.addImage(signatureData, "PNG", signatureX, 210, signatureWidth, 30);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      const underlineY = 245;
      doc.line(signatureX, underlineY, signatureX + signatureWidth, underlineY);

      doc.text(`INTERN [${first_name} ${last_name}]`, pageWidth / 2, 260, {
        align: "center",
      });
      doc.text("Signature over Printed Name", pageWidth / 2, 270, {
        align: "center",
      });
      doc.text(`Date: ${formattedDate}`, pageWidth / 2, 280, {
        align: "center",
      });

      // --- End: Use the correct NDA template for PDF generation ---

      // Convert PDF to data URI
      const pdfData = doc.output("datauristring");

      // Store the signature and PDF in localStorage
      localStorage.setItem("ndaSignature", signatureData);
      localStorage.setItem("ndaDocument", pdfData);
      localStorage.setItem("ndaSigned", "true");
      localStorage.setItem("ndaSignedAt", new Date().toISOString());

      toast.success("NDA signed successfully");

  
      // Send a message to the parent window that NDA was signed
      try {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "NDA_SIGNED",
              signed: true,
              userData: {
                first_name,
                last_name,
                signature: signatureData,
              },
            },
            "*",
          );
          setTimeout(() => window.close(), 2000);
        } else {
          toast.success(
            "You can now close this window and continue with your application",
          );
        }

    
      } catch (error) {
        console.error("Error sending message to parent window:", error);
        toast.success(
          "You can now close this window and continue with your application",
        );
      }
    } catch (error) {
      console.error("Error signing NDA:", error);
      toast.error("Failed to sign NDA. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString();

  if (showNameForm) {
    return (
      <div className="bg-black-400 relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 text-white">
        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <Image
              src="/assets/svgs/logos/codebility-light.svg"
              alt="Codebility Plus"
              width={270}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="mb-2 text-2xl font-bold text-white">
              Before Signing the NDA
            </h1>
            <p className="mb-6 text-gray-300">
              Please provide your full name to continue
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmitUserInfo)}
            className="rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-md"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name" className="text-white">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  className="mt-1 border-gray-700 bg-gray-800 text-white"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name" className="text-white">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  className="mt-1 border-gray-700 bg-gray-800 text-white"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Continue to NDA
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black-400 relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 text-white">
      <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 text-center">
          <Image
            src="/assets/svgs/logos/codebility-light.svg"
            alt="Codebility Plus"
            width={270}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="mb-2 text-2xl font-bold text-white">
            Codebility Non-Disclosure Agreement
          </h1>
          <p className="text-gray-300">Please review and sign the NDA below</p>
        </div>

        <div className="bg-light-900 text-black-400 z-[100] mb-8 h-[70vh] overflow-y-scroll rounded-lg border p-6 shadow-md ">
          <div className="mb-6 space-y-4 text-sm">
            <h2 className="mb-4 text-xl font-bold">COMPANY NDA</h2>

            <div className="font-semibold text-green-500">
              <p>CODEBILITY</p>
            </div>
            <br />

            <h3 className="mt-6 font-bold">TERMS OF AGREEMENT</h3>
            <p>
              This agreement is created on {formattedDate} and remains in effect
              indefinitely. The Intern has the flexibility to conclude their
              tenure at any point, subject to the conditions outlined in
              Termination of Agreement.
            </p>

            <h3 className="mt-6 font-bold">
              CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):
            </h3>
            <p>
              A. The Intern agrees not to disclose, divulge, reveal, report or
              use, for any purpose, any confidential information of Codebility,
              which the Intern has obtained, or which was disclosed to the
              Intern by Codebility because of this Agreement.
            </p>
            <br />
            <p>
              B. &quot;Confidential Information&quot; refers to any data or information
              relating to the business by Codebility that is not generally known
              to the public and that, if disclosed, could reasonably be expected
              to cause harm to Codebility.
            </p>
            <br />
            <h3 className="mt-6 font-bold">INTELLECTUAL PROPERTY</h3>
            <br />
            <p>
              The Intern acknowledges and agrees that any intellectual property
              provided by the Codebility during the internship will remain the
              exclusive property of the Company.
            </p>

            <br />
            <h3 className="mt-6 font-bold">AGREEMENT</h3>
            <p>
              This Agreement contains the entire agreement between the parties
              and supersedes any prior written or oral agreements between them
              concerning the subject matter of this Agreement.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-semibold">Please sign below:</p>
            <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
              <SignaturePad
                ref={signatureRef}
                canvasProps={{
                  className: "w-full h-[200px]",
                }}
                backgroundColor="white"
              />
            </div>
            <div className="mt-2 text-right">
              <Button
                variant="destructive"
                onClick={clearSignature}
                size="sm"
                className="border-white text-white hover:bg-gray-800"
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowNameForm(true)}
              className="border-white text-white hover:bg-gray-800"
            >
              Edit Name
            </Button>
            <Button
              onClick={handleSignNda}
              disabled={signing}
              className="text-md flex h-10 w-max items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-2 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:text-lg"
            >
              {signing ? "Processing..." : "Sign NDA"}
            </Button>
          </div>
        </div>
      </div>
      <div className="hero-bubble">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
     
    </div>
  );
}
