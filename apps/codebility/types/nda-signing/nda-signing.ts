import type { UserInfoSchema } from "@/utils/nda-signing/nda-signing";
import type { z } from "zod";

export type UserInfo = z.infer<typeof UserInfoSchema>;

// Signature canvas interface
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
