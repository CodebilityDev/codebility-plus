"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { createClientClientComponent } from "@/utils/supabase/client";

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

export default function NdaSigningPage() {
  const params = useParams();
  const router = useRouter();
   const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const signatureRef = useRef<SignatureCanvasRef | null>(null);

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codev, setCodev] = useState<any>(null);
  const [ndaRequest, setNdaRequest] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;

    async function fetchNdaRequest() {
      try {
        setLoading(true);
        const token = params.token as string;

        const { data: requestData, error: requestError } = await supabase
          .from("nda_requests")
          .select("*, codev:codev_id(*)")
          .eq("token", token)
          .single();

        if (requestError) throw requestError;

        if (!requestData) {
          setError("Invalid or expired NDA signing link");
          return;
        }

        if (new Date(requestData.expires_at) < new Date()) {
          setError("This NDA signing link has expired");
          return;
        }

        if (requestData.status === "completed") {
          setError("This NDA has already been signed");
          return;
        }

        setNdaRequest(requestData);
        setCodev(requestData.codev);
      } catch (error) {
        console.error("Error fetching NDA request:", error);
        setError("Failed to load NDA signing request");
      } finally {
        setLoading(false);
      }
    }

    fetchNdaRequest();
  }, [params.token, supabase]);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
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

      setSigning(true);

      const signatureData = signatureRef.current.toDataURL("image/png");

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      doc.setFont("times", "normal");
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const lineWidth = 150;
      
      const totalPages = 4;
      
      const getLogoAsBase64 = async () => {
        try {
          const response = await fetch("/assets/images/svgs/codebility-dark.png");
          if (!response.ok) {
            console.error("Failed to load logo image");
            return null;
          }
          
          const blob = await response.blob();
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error loading logo:", error);
          return null;
        }
      };
      
      const logoBase64 = await getLogoAsBase64();
      
      const addFooter = (doc: any, pageNumber: number) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${pageNumber} / ${totalPages}`, pageWidth - 20, pageHeight - 10);
        
        doc.setFont("times", "italic");
        doc.text("Privacy Policy", 20, pageHeight - 10);
        doc.setFont("times", "normal");
        
        if (logoBase64) {
          try {
            doc.addImage(logoBase64, "PNG", pageWidth - 60, pageHeight - 15, 30, 8);
          } catch (e) {
            console.error("Error adding logo to footer:", e);
            doc.setFontSize(10);
            doc.text("CODEBILITY", pageWidth - 60, pageHeight - 10);
          }
        } else {
          doc.setFontSize(10);
          doc.text("CODEBILITY", pageWidth - 60, pageHeight - 10);
        }
      };

      const formattedDate = ndaRequest?.created_at 
      ? new Date(ndaRequest.created_at).toLocaleDateString()
      : new Date().toLocaleDateString();
    
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
        `This agreement is created on ${formattedDate}, 2025 and remains in effect indefinitely. The`,
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
        "disclosed to the Intern by Codebility because of this Agreement. The Intern&apos;s obligations",
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
      
      addFooter(doc, 1);

      doc.addPage();

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

      addFooter(doc, 2);

      doc.addPage();

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
      
      const ceoLineY = 70;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line((pageWidth - lineWidth) / 2, ceoLineY, (pageWidth - lineWidth) / 2 + lineWidth, ceoLineY);
      
      doc.text("CEO/FOUNDER of Codebility", pageWidth / 2, ceoLineY - 30, { align: "center" });
      doc.text("JZEFF KENDREW F SOMERA", pageWidth / 2, ceoLineY + 15, { align: "center" });
      doc.text("Signature over Printed Name", pageWidth / 2, ceoLineY + 25, { align: "center" });
      doc.text(`${formattedDate}`, pageWidth / 2, ceoLineY + 35, { align: "center" });
      doc.text("Date", pageWidth / 2, ceoLineY + 45, { align: "center" });
      
      doc.text(
       `This Internship Contract/Agreement is effective as of ${formattedDate}`,
        pageWidth / 2,
        125,
        { align: "center" },
      );

      doc.setPage(3);
      
      const signatureWidth = 70;
      const signatureX = (pageWidth - signatureWidth) / 2;
      
      doc.addImage(signatureData, "PNG", signatureX, 210, signatureWidth, 30);
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      const underlineY = 245;
      doc.line(signatureX, underlineY, signatureX + signatureWidth, underlineY);
      
      doc.text(`INTERN [${codev.first_name} ${codev.last_name}]`, pageWidth / 2, 260, { align: "center" });
      doc.text("Signature over Printed Name", pageWidth / 2, 270, { align: "center" });
      doc.text(`Date: ${formattedDate}`, pageWidth / 2, 280, { align: "center" });

      const pdfData = doc.output("datauristring");

      console.log("Codev object:", codev);

      try {
        const { data: updateData, error: requestError } = await supabase
          .from("nda_requests")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", ndaRequest.id);

        if (requestError) {
          console.error("Error updating NDA request:", requestError);
          throw requestError;
        }

        console.log("NDA request updated successfully:", updateData);
      } catch (updateError) {
        console.error("Exception during NDA request update:", updateError);
      }

      const { error: codevUpdateError } = await supabase
        .from("codev")
        .update({
          nda_status: true,
          nda_signature: signatureData,
          nda_document: pdfData,
          nda_signed_at: new Date().toISOString(),
          nda_request_sent: true,
        })
        .eq("id", codev.id);

      if (codevUpdateError) {
        console.error("Error updating codev record:", codevUpdateError);
      } else {
        console.log("Successfully updated codev record with NDA information");
      }

      toast.success("Your NDA has been successfully signed and recorded.");

      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: codev.email_address,
            subject: "NDA Signed Successfully",
            content: `
              <h1>NDA Signed Successfully</h1>
              <p>Hello ${codev.first_name},</p>
              <p>Your NDA has been successfully signed and recorded in our system.</p>
              <p>Thank you for your cooperation.</p>
              <p>Codebility Plus Team</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error("Error sending NDA email:", await emailResponse.text());
        } else {
          console.log("Email notification sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending NDA email:", emailError);
      }

      router.push("/nda-signing/success");
    } catch (error) {
      console.error("Error signing NDA:", error);
      toast.error("Failed to sign NDA. Please try again or contact support.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-customBlue-300 p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          <p className="text-lg font-bold text-white">
            Loading NDA signing page...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
          <Logo />
          <div>
            <p className="mb-2 text-lg md:text-lg lg:text-3xl">Error!</p>
            <p className="text-gray mx-auto text-xs md:text-lg lg:max-w-[500px] lg:text-lg">
              {error}
            </p>
          </div>
          <Link href="/">
            <Button className="from-customTeal to-customViolet-100 h-10 w-32 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36">
              <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
                Go to Home
              </span>
            </Button>
          </Link>

          <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

          <div className="hero-bubble">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = ndaRequest?.created_at 
    ? new Date(ndaRequest.created_at).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 text-center">
          <Image
            src="/assets/svgs/logos/codebility-light.svg"
            alt="Codebility Plus"
            width={270}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">
            Codebility Non-Disclosure Agreement
          </h1>
          <p className="text-gray-600">
            Hello {codev?.first_name} {codev?.last_name}, please review and sign
            the NDA below
          </p>
        </div>

        <div className="bg-light-900 text-black-400 z-[100] mb-8 h-[70vh] overflow-y-scroll rounded-lg border p-6 shadow-md">
          <div className="mb-6 space-y-4 text-sm">
            <h2 className="mb-4 text-xl font-bold">COMPANY NDA</h2>

            <div className="font-semibold text-green-600">
              <p>CODEBILITY</p>
            </div>
            <br />
            <br />

            <h3 className="mt-6 font-bold">TERMS OF AGREEMENT</h3>
            <p>
              This agreement is created on {formattedDate} and remains in effect indefinitely. The
              Intern has the flexibility to conclude
              their tenure at any point, subject to the conditions outlined in
              Termination of Agreement.
            </p>

            <h3 className="mt-6 font-bold">
              CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):
            </h3>
            <p>
              A. The Intern agrees not to disclose, divulge, reveal, report or
              use, for any purpose, any confidential information of Codebility,
              which the Intern has obtained, or which was disclosed to the
              Intern by Codebility because of this Agreement. The Intern&apos;s
              obligations under this Agreement will continue after termination
              of this Agreement and will be binding until the Confidential
              Information becomes public or until Codebility sends the Intern
              written notice releasing the Intern from this Agreement, whichever
              occurs first.
            </p>
            <br />
            <p>
              B. &quot;Confidential Information&quot; refers to any data or information,
              oral or written, disclosed by Codebility that is not generally
              known to the public and where the release of that Confidential
              Information could reasonably be expected to cause harm to
              Codebility.
            </p>
            <br />
            <h3 className="mt-6 font-bold">INTELLECTUAL PARTY</h3>
            <br />
            <p>
              The Intern acknowledges and agrees that any intellectual property
              provided by the Codebility during the internship will remain the
              exclusive property of the Company. This includes, but is not
              limited to, copyrights, patents, trade secret rights, and any
              other intellectual property rights associated with ideas,
              concepts, techniques, inventions, processes, works of authorship,
              confidential information, or trade secret
            </p>

            <br />
            <br />
            <h3 className="mt-6 font-bold">USAGE RIGHTS</h3>
            <br />
            <p>
              The Intern agrees that any work product, including but not limited
              to written materials, designs, code, artwork, and any other
              creations produced during the course of the internship, shall be
              the exclusive property of the Company. The Intern grants the
              Company the irrevocable, perpetual, worldwide, royalty-free
              license to use, reproduce, modify, adapt, publish, translate,
              distribute, and display such work product in any media or format,
              whether now known or hereafter developed, for any purpose related
              to the business of the Company, including but not limited to
              marketing, promotional, and educational purposes.
              <br />
              The Intern acknowledges and agrees that they have no right to
              further compensation, attribution, or recognition for the use of
              their work product beyond the terms of this Agreement.
            </p>
            <br />
            <h3 className="mt-6 font-bold">TERMINATION</h3>
            <br />
            <p>
              Either party may terminate this Agreement at any time by providing
              30 days written notice to the other party.
            </p>

            <h3 className="mt-6 font-bold">GOVERNING LAW</h3>
            <p>
              This Agreement shall be governed in all respects by the laws of
              the Philippines.
            </p>

            <br />
            <h3 className="mt-6 font-bold">AGREEMENT</h3>
            <p>
              This Agreement contains the entire agreement between the parties
              and supersedes any prior written or oral agreements between them
              concerning the subject matter of this Agreement.
            </p>

            <br />

            <p>
              IN WITNESS WHEREOF, the parties hereto have executed this
              Independent Contractor Agreement as of the Effective Date.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-2 font-semibold">Signed By Agreement:</p>
            <p className="mb-2 font-semibold">Please sign below:</p>
            <div className="border border-gray-300 bg-white">
              <SignaturePad
                ref={signatureRef}
                canvasProps={{
                  width: 710,
                  height: 100,
                  className: "signature-canvas",
                }}
                backgroundColor="white"
              />
            </div>
            <div className="mt-2 text-right">
              <Button variant="destructive" onClick={clearSignature} size="sm">
                Clear
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-4">
           
            <Button
              onClick={handleSignNda}
              disabled={signing}
              className="text-md flex h-10 w-max items-center justify-center gap-2 whitespace-nowrap rounded-md bg-customBlue-100 px-6 py-2 text-white ring-offset-background transition-colors duration-300 hover:bg-customBlue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customBlue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:text-lg"
            >
              {signing ? "Processing..." : "Sign NDA"}
            </Button>
          </div>
        </div>
      </div>
      <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>
      <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

      <div className="hero-bubble">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} />
        ))}
      </div>
    </div>
  );

  
}
