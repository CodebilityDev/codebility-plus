"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@codevs/ui/button";

export default function NdaSuccessPage() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md rounded-lg border p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Image 
            src="/assets/svgs/icon-codebility-black.svg" 
            alt="Codebility Plus" 
            width={120} 
            height={40} 
            className="mx-auto mb-4"
          />
          <div className="mb-4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold">NDA Signed Successfully</h1>
          <p className="text-gray-600">
            Thank you for signing the Non-Disclosure Agreement. Your signature has been recorded.
          </p>
        </div>
        
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">
            You may close this window now.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}