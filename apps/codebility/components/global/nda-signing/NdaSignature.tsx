"use client";

import { forwardRef, Suspense, useRef, useState } from "react";
import { useDynamicImport } from "@/hooks/global/useDynamicImport";
import { Check, Eraser, PenLine } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/global/design-system/Button";
import { generateNdaPdf } from "@/utils/global/nda-signing";
import type {
  SignatureCanvasRef,
  SignaturePadProps,
} from "@/types/global/nda-signing";

function SignaturePadFallback() {
  return (
    <div className="flex h-[180px] items-center justify-center text-sm text-white/45">
      Loading signature pad...
    </div>
  );
}

const SignaturePad = forwardRef<SignatureCanvasRef, SignaturePadProps>(
  (props, ref) => {
    const SignatureComponent = useDynamicImport(
      () => import("react-signature-canvas"),
    );

    return (
      <Suspense fallback={<SignaturePadFallback />}>
        <SignatureComponent {...props} ref={ref} />
      </Suspense>
    );
  },
);

SignaturePad.displayName = "SignaturePad";

export interface NdaSignatureProps {
  firstName: string;
  lastName: string;
  signed: boolean;
  onSigned: (data: { signature: string; document: string }) => void;
}

export function NdaSignature({
  firstName,
  lastName,
  signed,
  onSigned,
}: NdaSignatureProps) {
  const signatureRef = useRef<SignatureCanvasRef | null>(null);
  const [signing, setSigning] = useState(false);

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSign = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Please sign the document before submitting");
      return;
    }

    setSigning(true);

    try {
      const signature = signatureRef.current.toDataURL("image/png");
      const date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date());
      const document = await generateNdaPdf(
        { first_name: firstName, last_name: lastName },
        signature,
        date,
      );

      onSigned({ signature, document });
      toast.success("NDA signed successfully");
    } catch {
      toast.error("Failed to sign NDA. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[13px] font-medium text-white/80">
          Signature
        </p>
        <span className="text-xs text-white/35">
          {firstName} {lastName}
        </span>
      </div>

      <div className="mt-2 overflow-hidden rounded-[8px] border border-white/15 bg-white">
        <SignaturePad
          ref={signatureRef}
          canvasProps={{ className: "h-[180px] w-full" }}
          backgroundColor="white"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={clearSignature}
          className="flex items-center gap-1.5 text-[13px] text-white/55 transition-colors hover:text-white"
        >
          <Eraser aria-hidden className="h-4 w-4" />
          Clear
        </button>

        <div className="flex items-center gap-3">
          {signed ? (
            <span className="flex items-center gap-1.5 text-[13px] text-[#7BE0B6]">
              <Check aria-hidden className="h-4 w-4" />
              Signed
            </span>
          ) : null}
          <Button
            type="button"
            size="sm"
            disabled={signing}
            onClick={handleSign}
            className="h-9 rounded-full bg-[#9747ff] px-4 text-[13px] text-white hover:bg-[#a855f7]"
          >
            <PenLine aria-hidden className="h-3.5 w-3.5" />
            {signing ? "Signing..." : "Sign NDA"}
          </Button>
        </div>
      </div>
    </div>
  );
}
