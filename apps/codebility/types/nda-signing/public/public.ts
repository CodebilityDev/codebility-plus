import { UserInfoSchema } from "@/utils/nda-signing/public/public";
import React from "react";
import { z } from "zod";

export type UserInfo = z.infer<typeof UserInfoSchema>;

export type SignatureCanvasRef = {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, encoderOptions?: number) => string;
};

export interface SignaturePadProps {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
  backgroundColor?: string;
  [key: string]: any;
}
