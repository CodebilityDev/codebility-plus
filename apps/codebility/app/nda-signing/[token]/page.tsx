"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-hot-toast";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { completeNdaSigning } from "@/actions/global/nda-storage";
import { createClientClientComponent } from "@/lib/global/supabase-client";
import type { UserInfo, SignatureCanvasRef, SignaturePadProps } from "@/types/nda-signing/nda-signing";
import { UserInfoSchema, generateNdaPdf } from "@/utils/nda-signing/nda-signing";


// Dynamic signature pad component with loading state
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
        <div className="flex h-[180px] items-center justify-center border border-gray-300 bg-white">
          <p className="text-gray-500">Loading signature pad...</p>
        </div>
      );
    }

    return <SignatureComponent {...props} ref={ref} />;
  },
);

SignaturePad.displayName = "SignaturePad";

export default function PublicNdaSigningPage() {
  const { token } = useParams<{ token: string }>();
  const signatureRef = useRef<SignatureCanvasRef | null>(null);
  const [signing, setSigning] = useState(false);
  const [showNameForm, setShowNameForm] = useState(true);
  const [codevId, setCodevId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  // Fetch codev ID from token on component mount
  useEffect(() => {
    if (token) {
      fetchCodevIdFromToken(token);
    }
  }, [token]);

  /**
   * Fetches codev ID associated with the NDA token
   * This connects the signing process to the specific codev record
   */
  const fetchCodevIdFromToken = async (ndaToken: string) => {
    try {
      const supabase = createClientClientComponent();
      
      if (!supabase) {
        toast.error("Unable to connect to database");
        return;
      }
      
      const { data, error } = await supabase
        .from("nda_requests")
        .select("codev_id")
        .eq("token", ndaToken)
        .eq("status", "pending")
        .single();

      if (error) {
        console.error("Error fetching codev ID:", error);
        toast.error("Invalid or expired NDA link");
        return;
      }

      if (data?.codev_id) {
        setCodevId(data.codev_id);
      }
    } catch (error) {
      console.error("Error in fetchCodevIdFromToken:", error);
      toast.error("Failed to validate NDA link");
    }
  };

  // Clear signature canvas
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  // Handle name form submission
  const onSubmitUserInfo = (data: UserInfo) => {
    // Store user info in localStorage for later use
    localStorage.setItem("ndaUserFirstName", data.first_name);
    localStorage.setItem("ndaUserLastName", data.last_name);
    setShowNameForm(false);
  };

  // Handle NDA signing process with storage integration
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

      if (!codevId) {
        toast.error("Unable to process NDA. Please try the link again.");
        return;
      }

      setSigning(true);
      
      // Get signature data from canvas
      const signatureDataUrl = signatureRef.current.toDataURL("image/png");

      // Generate PDF document on client side since jsPDF requires browser environment
      const documentDataUrl = await generateNdaPdf({ first_name, last_name }, signatureDataUrl);

      // Use the new storage service for complete workflow
      const result = await completeNdaSigning(
        signatureDataUrl,
        documentDataUrl,
        {
          first_name,
          last_name,
          codev_id: codevId,
        }
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to complete NDA signing");
      }

      // Update NDA request status to completed
      if (token) {
        await updateNdaRequestStatus(token);
      }

      // Clean up localStorage
      localStorage.removeItem("ndaUserFirstName");
      localStorage.removeItem("ndaUserLastName");

      toast.success("NDA signed and uploaded successfully!");

      // Send message to parent window
      try {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "NDA_SIGNED",
              signed: true,
              userData: {
                first_name,
                last_name,
                codev_id: codevId,
              },
            },
            "*"
          );
          setTimeout(() => window.close(), 2000);
        } else {
          toast.success(
            "You can now close this window and continue with your application"
          );
        }
      } catch (error) {
        console.error("Error sending message to parent window:", error);
        toast.success(
          "You can now close this window and continue with your application"
        );
      }
    } catch (error) {
      console.error("Error signing NDA:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to sign NDA. Please try again."
      );
    } finally {
      setSigning(false);
    }
  };

  /**
   * Updates the NDA request status to completed after successful signing
   */
  const updateNdaRequestStatus = async (ndaToken: string) => {
    try {
      const supabase = createClientClientComponent();
      
      if (!supabase) {
        console.error("Unable to connect to database for status update");
        return;
      }
      
      await supabase
        .from("nda_requests")
        .update({ status: "completed" })
        .eq("token", ndaToken);
    } catch (error) {
      console.error("Error updating NDA request status:", error);
      // Don't throw here as the main signing process was successful
    }
  };

  if (showNameForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              NDA Signing Process
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please provide your name to proceed with the NDA
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitUserInfo)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  {...register("first_name")}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  {...register("last_name")}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to NDA Document
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Non-Disclosure Agreement (NDA)
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Please read the agreement below and provide your signature
          </p>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* NDA Content Section */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                CODEBILITY NDA
              </h2>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-medium text-gray-900">TERMS OF AGREEMENT</h3>
                  <p>
                    This agreement is created on {new Date().toLocaleDateString()} and remains 
                    in effect indefinitely. The Intern has the flexibility to conclude their 
                    tenure at any point, subject to the conditions outlined in Termination of Agreement.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">
                    CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):
                  </h3>
                  <p>
                    A. The Intern agrees not to disclose, divulge, reveal, report or use, 
                    for any purpose, any confidential information of Codebility, which the 
                    Intern has obtained, or which was disclosed to the Intern by Codebility 
                    because of this Agreement.
                  </p>
                  <p>
                    B. Confidential Information refers to any data or information relating 
                    to the business by Codebility that is not generally known to the public 
                    and that, if disclosed, could reasonably be expected to cause harm to Codebility.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">INTELLECTUAL PROPERTY</h3>
                  <p>
                    All intellectual property developed during the internship period belongs to Codebility.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">TERMINATION</h3>
                  <p>
                    Either party may terminate this Agreement at any time by providing 30 days 
                    written notice to the other party.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Your Signature
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    Please sign below:
                  </Label>
                  <div className="mt-2 border border-gray-300 bg-white">
                    <SignaturePad
                      ref={signatureRef}
                      canvasProps={{
                        width: 400,
                        height: 180,
                        className: "signature-canvas w-full",
                      }}
                      backgroundColor="rgba(255,255,255,1)"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSignature}
                    disabled={signing}
                    className="flex-1"
                  >
                    Clear Signature
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNameForm(true)}
                    disabled={signing}
                    className="flex-1"
                  >
                    Edit Name
                  </Button>
                </div>

                <Button
                  onClick={handleSignNda}
                  disabled={signing}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  {signing ? "Processing..." : "Sign NDA"}
                </Button>

                <p className="text-xs text-gray-500">
                  By signing this document, you agree to the terms and conditions outlined above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}