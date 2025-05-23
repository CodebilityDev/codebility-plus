"use client";
import Image from "next/image";
import {
  IconActivityLog,
  IconApplicant,
  IconHuman,
} from "@/public/assets/svgs";

import InquiryForm from "./_components/ContactInquiryInform";

export default function ContactPage() {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-10 text-pretty bg-[#030303] px-5 py-10 text-white">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5">
            <Image src={IconHuman} alt="Human Icon" width={24} height={24} />
          </div>
          <p className="text-center">Inquiry Form</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="flex items-center gap-10">
            <div className="mx-1 w-28 border-t-2 border-white/5"></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5">
              <Image
                src={IconApplicant}
                alt="Applicant Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="mx-1 w-28 border-t-2 border-white/5"></div>
          </div>
          <p className="text-center">Short Survey</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5">
            <Image
              src={IconActivityLog}
              alt="Activity Log Icon"
              width={24}
              height={24}
            />
          </div>
          <p className="text-center">Set an Appointment</p>
        </div>
      </div>

      <InquiryForm />

      <p className="text-center">
        We prioritize the security of your information. Rest assured, we will
        ensure that your data remains safe with us.
      </p>
    </div>
  );
}
