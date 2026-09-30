export interface NdaSigningTokenClientProps {
  agreementDate: string;
}

export interface NdaSigningPublicViewProps {
  formattedDate: string;
}

import type { UserInfoSchema } from "@/utils/global/nda-signing";
import type React from "react";
import type { z } from "zod";

export type UserInfo = z.infer<typeof UserInfoSchema>;

export interface SignatureCanvasRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, encoderOptions?: number) => string;
}

export interface SignaturePadProps {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
  [key: string]: any;
}