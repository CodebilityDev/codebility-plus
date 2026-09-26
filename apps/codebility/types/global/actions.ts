import { Codev } from "@/types/global/codev";
import type { HireCodevEmail } from "@/types/global/hire-codev-email";

export interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface NdaUploadResult {
  signatureUrl: string;
  documentUrl: string;
  success: boolean;
  error?: string;
}

export interface UserData {
  first_name: string;
  last_name: string;
  codev_id?: string;
}

export type EmailProps = HireCodevEmail & {
	codev: Codev;
}
